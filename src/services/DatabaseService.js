// Database Service with MCP Support for Scalability
import { cacheService } from './CacheService';
import { SecurityUtils } from '../config/security';

class DatabaseService {
  constructor() {
    this.connectionPool = new Map();
    this.config = {
      maxConnections: 10,
      connectionTimeout: 30000,
      queryTimeout: 15000,
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    // MCP Configuration
    this.mcpConfig = {
      enabled: import.meta.env.VITE_MCP_ENABLED === 'true',
      serverUrl: import.meta.env.VITE_MCP_SERVER_URL,
      apiKey: import.meta.env.VITE_MCP_API_KEY,
      database: import.meta.env.VITE_MCP_DATABASE || 'wandermind'
    };
    
    this.initializeConnection();
  }
  
  // Initialize database connection
  async initializeConnection() {
    try {
      if (this.mcpConfig.enabled) {
        await this.initializeMCPConnection();
      } else {
        await this.initializeLocalConnection();
      }
      console.log('Database connection initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }
  
  // Initialize MCP connection
  async initializeMCPConnection() {
    const connection = {
      type: 'mcp',
      url: this.mcpConfig.serverUrl,
      headers: {
        'Authorization': `Bearer ${this.mcpConfig.apiKey}`,
        'Content-Type': 'application/json',
        'X-Database': this.mcpConfig.database
      }
    };
    
    // Test connection
    await this.testConnection(connection);
    this.connectionPool.set('primary', connection);
  }
  
  // Initialize local connection (fallback)
  async initializeLocalConnection() {
    // For development/fallback - using IndexedDB
    const connection = {
      type: 'indexeddb',
      dbName: 'WanderMindDB',
      version: 1,
      stores: ['users', 'trips', 'bookings', 'preferences', 'cache']
    };
    
    this.connectionPool.set('primary', connection);
  }
  
  // Test database connection
  async testConnection(connection) {
    if (connection.type === 'mcp') {
      const response = await fetch(`${connection.url}/health`, {
        headers: connection.headers,
        timeout: this.config.connectionTimeout
      });
      
      if (!response.ok) {
        throw new Error(`MCP connection test failed: ${response.statusText}`);
      }
    }
  }
  
  // Execute query with caching
  async query(sql, params = [], options = {}) {
    const cacheKey = options.cache ? `db_query_${sql}_${JSON.stringify(params)}` : null;
    
    // Check cache first
    if (cacheKey) {
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;
    }
    
    const connection = this.connectionPool.get('primary');
    let result;
    
    try {
      if (connection.type === 'mcp') {
        result = await this.executeMCPQuery(connection, sql, params);
      } else {
        result = await this.executeLocalQuery(connection, sql, params);
      }
      
      // Cache successful queries
      if (cacheKey && result) {
        const ttl = options.cacheTTL || 5 * 60 * 1000; // 5 minutes default
        cacheService.set(cacheKey, result, ttl);
      }
      
      return result;
    } catch (error) {
      console.error('Database query failed:', error);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }
  
  // Execute MCP query
  async executeMCPQuery(connection, sql, params) {
    const sanitizedSql = SecurityUtils.sanitizeInput(sql);
    const sanitizedParams = params.map(param => SecurityUtils.sanitizeInput(param));
    
    const response = await fetch(`${connection.url}/query`, {
      method: 'POST',
      headers: connection.headers,
      body: JSON.stringify({
        sql: sanitizedSql,
        params: sanitizedParams,
        timeout: this.config.queryTimeout
      })
    });
    
    if (!response.ok) {
      throw new Error(`MCP query failed: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  // Execute local query (IndexedDB)
  async executeLocalQuery(connection, sql, params) {
    // Simplified local query execution for development
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(connection.dbName, connection.version);
      
      request.onerror = () => reject(new Error('IndexedDB connection failed'));
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        // Implement basic CRUD operations
        resolve({ success: true, data: [] });
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        connection.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        });
      };
    });
  }
  
  // User operations
  async createUser(userData) {
    const sanitizedData = {
      name: SecurityUtils.sanitizeInput(userData.name),
      email: SecurityUtils.sanitizeInput(userData.email),
      phone: SecurityUtils.sanitizeInput(userData.phone),
      preferences: userData.preferences || {},
      createdAt: new Date().toISOString()
    };
    
    const sql = `
      INSERT INTO users (name, email, phone, preferences, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    return await this.query(sql, [
      sanitizedData.name,
      sanitizedData.email,
      sanitizedData.phone,
      JSON.stringify(sanitizedData.preferences),
      sanitizedData.createdAt
    ]);
  }
  
  async getUserById(userId) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await this.query(sql, [userId], { cache: true, cacheTTL: 10 * 60 * 1000 });
  }
  
  async updateUser(userId, userData) {
    const sanitizedData = {
      name: SecurityUtils.sanitizeInput(userData.name),
      email: SecurityUtils.sanitizeInput(userData.email),
      phone: SecurityUtils.sanitizeInput(userData.phone),
      preferences: userData.preferences || {}
    };
    
    const sql = `
      UPDATE users 
      SET name = ?, email = ?, phone = ?, preferences = ?, updated_at = ?
      WHERE id = ?
    `;
    
    return await this.query(sql, [
      sanitizedData.name,
      sanitizedData.email,
      sanitizedData.phone,
      JSON.stringify(sanitizedData.preferences),
      new Date().toISOString(),
      userId
    ]);
  }
  
  // Trip operations
  async createTrip(tripData) {
    const sanitizedData = {
      userId: parseInt(tripData.userId),
      destination: SecurityUtils.sanitizeInput(tripData.destination),
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: parseFloat(tripData.budget),
      preferences: tripData.preferences || {},
      itinerary: tripData.itinerary || {},
      status: 'planning'
    };
    
    const sql = `
      INSERT INTO trips (user_id, destination, start_date, end_date, budget, preferences, itinerary, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    return await this.query(sql, [
      sanitizedData.userId,
      sanitizedData.destination,
      sanitizedData.startDate,
      sanitizedData.endDate,
      sanitizedData.budget,
      JSON.stringify(sanitizedData.preferences),
      JSON.stringify(sanitizedData.itinerary),
      sanitizedData.status,
      new Date().toISOString()
    ]);
  }
  
  async getUserTrips(userId) {
    const sql = 'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC';
    return await this.query(sql, [userId], { cache: true, cacheTTL: 5 * 60 * 1000 });
  }
  
  async getTripById(tripId) {
    const sql = 'SELECT * FROM trips WHERE id = ?';
    return await this.query(sql, [tripId], { cache: true });
  }
  
  // Booking operations
  async createBooking(bookingData) {
    const sanitizedData = {
      tripId: parseInt(bookingData.tripId),
      userId: parseInt(bookingData.userId),
      type: SecurityUtils.sanitizeInput(bookingData.type),
      details: bookingData.details || {},
      amount: parseFloat(bookingData.amount),
      status: 'pending',
      paymentId: SecurityUtils.sanitizeInput(bookingData.paymentId)
    };
    
    const sql = `
      INSERT INTO bookings (trip_id, user_id, type, details, amount, status, payment_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    return await this.query(sql, [
      sanitizedData.tripId,
      sanitizedData.userId,
      sanitizedData.type,
      JSON.stringify(sanitizedData.details),
      sanitizedData.amount,
      sanitizedData.status,
      sanitizedData.paymentId,
      new Date().toISOString()
    ]);
  }
  
  async getBookingById(bookingId) {
    const sql = 'SELECT * FROM bookings WHERE id = ?';
    return await this.query(sql, [bookingId], { cache: true });
  }
  
  async updateBookingStatus(bookingId, status) {
    const sql = 'UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?';
    return await this.query(sql, [status, new Date().toISOString(), bookingId]);
  }
  
  // Analytics and reporting
  async getAnalytics(timeRange = '30d') {
    const sql = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT t.id) as total_trips,
        COUNT(DISTINCT b.id) as total_bookings,
        SUM(b.amount) as total_revenue
      FROM users u
      LEFT JOIN trips t ON u.id = t.user_id
      LEFT JOIN bookings b ON t.id = b.trip_id
      WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return await this.query(sql, [days], { cache: true, cacheTTL: 60 * 60 * 1000 });
  }
  
  // Health check
  async healthCheck() {
    try {
      const connection = this.connectionPool.get('primary');
      if (connection.type === 'mcp') {
        await this.testConnection(connection);
      }
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }
  
  // Close connections
  async close() {
    this.connectionPool.clear();
    console.log('Database connections closed');
  }
}

// Create singleton instance
export const databaseService = new DatabaseService();
export default databaseService;