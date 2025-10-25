// Security Configuration for WanderMind
export const SECURITY_CONFIG = {
  // API Security
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10
  },
  
  // Data Validation
  INPUT_VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_LENGTH: 32,
    IV_LENGTH: 16
  },
  
  // Session Management
  SESSION: {
    TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour
    SECURE_COOKIES: true,
    SAME_SITE: 'strict'
  },
  
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://accounts.google.com"],
    STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    IMG_SRC: ["'self'", "data:", "https:", "blob:"],
    CONNECT_SRC: ["'self'", "https://api.easemytrip.com", "https://maps.googleapis.com"],
    FONT_SRC: ["'self'", "https://fonts.gstatic.com"]
  }
};

// Security Utilities
export class SecurityUtils {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .substring(0, SECURITY_CONFIG.INPUT_VALIDATION.MAX_STRING_LENGTH);
  }
  
  static validateFileUpload(file) {
    const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = SECURITY_CONFIG.INPUT_VALIDATION;
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large');
    }
    
    return true;
  }
  
  static generateCSRFToken() {
    return crypto.randomUUID();
  }
  
  static validateCSRFToken(token, sessionToken) {
    return token === sessionToken;
  }
}