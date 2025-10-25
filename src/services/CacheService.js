// Advanced Caching Service for Performance Optimization
class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    
    // Cache configuration
    this.config = {
      DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
      MAX_CACHE_SIZE: 100, // Maximum number of cached items
      CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 minutes
    };
    
    // Start cleanup interval
    this.startCleanupInterval();
  }
  
  // Set cache with TTL
  set(key, value, ttl = this.config.DEFAULT_TTL) {
    // Implement LRU eviction if cache is full
    if (this.memoryCache.size >= this.config.MAX_CACHE_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    const expiresAt = Date.now() + ttl;
    this.memoryCache.set(key, {
      value,
      expiresAt,
      accessCount: 0,
      createdAt: Date.now()
    });
    
    this.cacheStats.sets++;
    return true;
  }
  
  // Get from cache
  get(key) {
    const cached = this.memoryCache.get(key);
    
    if (!cached) {
      this.cacheStats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      this.cacheStats.misses++;
      return null;
    }
    
    // Update access statistics
    cached.accessCount++;
    this.cacheStats.hits++;
    
    return cached.value;
  }
  
  // Delete from cache
  delete(key) {
    const deleted = this.memoryCache.delete(key);
    if (deleted) {
      this.cacheStats.deletes++;
    }
    return deleted;
  }
  
  // Clear all cache
  clear() {
    this.memoryCache.clear();
    this.cacheStats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
  }
  
  // Get cache statistics
  getStats() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? (this.cacheStats.hits / total * 100).toFixed(2) : 0;
    
    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      size: this.memoryCache.size,
      maxSize: this.config.MAX_CACHE_SIZE
    };
  }
  
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, cached] of this.memoryCache.entries()) {
      if (now > cached.expiresAt) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }
    
    console.log(`Cache cleanup: removed ${cleanedCount} expired entries`);
    return cleanedCount;
  }
  
  // Start automatic cleanup
  startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, this.config.CLEANUP_INTERVAL);
  }
  
  // Cache with async function
  async getOrSet(key, asyncFn, ttl = this.config.DEFAULT_TTL) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }
    
    try {
      const value = await asyncFn();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Cache decorators for common use cases
export const withCache = (key, ttl) => {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cacheKey = typeof key === 'function' ? key(...args) : `${key}_${JSON.stringify(args)}`;
      
      return await cacheService.getOrSet(cacheKey, async () => {
        return await method.apply(this, args);
      }, ttl);
    };
    
    return descriptor;
  };
};

export default cacheService;