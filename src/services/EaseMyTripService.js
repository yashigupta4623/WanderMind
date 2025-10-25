// EaseMyTrip Integration Service
import { cacheService } from './CacheService';
import { SecurityUtils } from '../config/security';

class EaseMyTripService {
  constructor() {
    this.baseURL = import.meta.env.VITE_EMT_API_URL || 'https://api.easemytrip.com/v1';
    this.apiKey = import.meta.env.VITE_EMT_API_KEY;
    this.partnerId = import.meta.env.VITE_EMT_PARTNER_ID;
    
    // Request configuration
    this.requestConfig = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000
    };
  }
  
  // Generic API request with caching and error handling
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `emt_${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;
    }
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Partner-ID': this.partnerId,
        'X-Request-ID': crypto.randomUUID(),
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await this.fetchWithRetry(url, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`EMT API Error: ${data.message || response.statusText}`);
      }
      
      // Cache successful GET responses
      if (!options.method || options.method === 'GET') {
        cacheService.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
      }
      
      return data;
    } catch (error) {
      console.error('EaseMyTrip API Error:', error);
      throw new Error(`Failed to fetch from EaseMyTrip: ${error.message}`);
    }
  }
  
  // Fetch with retry logic
  async fetchWithRetry(url, options, retries = this.requestConfig.retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestConfig.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (retries > 0 && !error.name === 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, this.requestConfig.retryDelay));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }
  
  // Flight Search
  async searchFlights(searchParams) {
    const sanitizedParams = {
      origin: SecurityUtils.sanitizeInput(searchParams.origin),
      destination: SecurityUtils.sanitizeInput(searchParams.destination),
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      passengers: Math.min(parseInt(searchParams.passengers) || 1, 9),
      class: SecurityUtils.sanitizeInput(searchParams.class) || 'economy'
    };
    
    return await this.makeRequest('/flights/search', {
      method: 'POST',
      body: JSON.stringify(sanitizedParams)
    });
  }
  
  // Hotel Search
  async searchHotels(searchParams) {
    const sanitizedParams = {
      destination: SecurityUtils.sanitizeInput(searchParams.destination),
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      rooms: Math.min(parseInt(searchParams.rooms) || 1, 5),
      guests: Math.min(parseInt(searchParams.guests) || 1, 10),
      starRating: searchParams.starRating,
      priceRange: searchParams.priceRange
    };
    
    return await this.makeRequest('/hotels/search', {
      method: 'POST',
      body: JSON.stringify(sanitizedParams)
    });
  }
  
  // Bus Search
  async searchBuses(searchParams) {
    const sanitizedParams = {
      origin: SecurityUtils.sanitizeInput(searchParams.origin),
      destination: SecurityUtils.sanitizeInput(searchParams.destination),
      travelDate: searchParams.travelDate,
      passengers: Math.min(parseInt(searchParams.passengers) || 1, 6)
    };
    
    return await this.makeRequest('/buses/search', {
      method: 'POST',
      body: JSON.stringify(sanitizedParams)
    });
  }
  
  // Train Search
  async searchTrains(searchParams) {
    const sanitizedParams = {
      origin: SecurityUtils.sanitizeInput(searchParams.origin),
      destination: SecurityUtils.sanitizeInput(searchParams.destination),
      travelDate: searchParams.travelDate,
      class: SecurityUtils.sanitizeInput(searchParams.class) || 'sleeper',
      passengers: Math.min(parseInt(searchParams.passengers) || 1, 6)
    };
    
    return await this.makeRequest('/trains/search', {
      method: 'POST',
      body: JSON.stringify(sanitizedParams)
    });
  }
  
  // Get Popular Destinations
  async getPopularDestinations(type = 'all') {
    return await this.makeRequest(`/destinations/popular?type=${type}`);
  }
  
  // Get Destination Details
  async getDestinationDetails(destinationId) {
    return await this.makeRequest(`/destinations/${destinationId}`);
  }
  
  // Create Booking
  async createBooking(bookingData) {
    const sanitizedData = {
      ...bookingData,
      customerInfo: {
        name: SecurityUtils.sanitizeInput(bookingData.customerInfo.name),
        email: SecurityUtils.sanitizeInput(bookingData.customerInfo.email),
        phone: SecurityUtils.sanitizeInput(bookingData.customerInfo.phone)
      }
    };
    
    return await this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(sanitizedData)
    });
  }
  
  // Get Booking Details
  async getBookingDetails(bookingId) {
    return await this.makeRequest(`/bookings/${bookingId}`);
  }
  
  // Cancel Booking
  async cancelBooking(bookingId, reason) {
    return await this.makeRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: SecurityUtils.sanitizeInput(reason) })
    });
  }
  
  // Get User Bookings
  async getUserBookings(userId, status = 'all') {
    return await this.makeRequest(`/users/${userId}/bookings?status=${status}`);
  }
  
  // Price Comparison
  async comparePrices(searchParams) {
    const cacheKey = `price_comparison_${JSON.stringify(searchParams)}`;
    
    return await cacheService.getOrSet(cacheKey, async () => {
      const [flights, hotels, buses, trains] = await Promise.allSettled([
        this.searchFlights(searchParams).catch(() => null),
        this.searchHotels(searchParams).catch(() => null),
        this.searchBuses(searchParams).catch(() => null),
        this.searchTrains(searchParams).catch(() => null)
      ]);
      
      return {
        flights: flights.status === 'fulfilled' ? flights.value : null,
        hotels: hotels.status === 'fulfilled' ? hotels.value : null,
        buses: buses.status === 'fulfilled' ? buses.value : null,
        trains: trains.status === 'fulfilled' ? trains.value : null,
        timestamp: new Date().toISOString()
      };
    }, 10 * 60 * 1000); // 10 minutes cache
  }
  
  // Health Check
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return { status: 'healthy', ...response };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

// Create singleton instance
export const easeMyTripService = new EaseMyTripService();
export default easeMyTripService;