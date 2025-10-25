// Performance Monitoring and Optimization Service
class PerformanceService {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      userInteractions: [],
      errors: [],
      resources: []
    };
    
    this.thresholds = {
      pageLoadTime: 3000, // 3 seconds
      apiResponseTime: 2000, // 2 seconds
      firstContentfulPaint: 1500, // 1.5 seconds
      largestContentfulPaint: 2500, // 2.5 seconds
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 100 // 100ms
    };
    
    this.observers = new Map();
    this.initializeMonitoring();
  }
  
  // Initialize performance monitoring
  initializeMonitoring() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals();
      this.initializeResourceObserver();
      this.initializeNavigationObserver();
      this.initializeErrorTracking();
      this.startPeriodicReporting();
    }
  }
  
  // Initialize Web Vitals monitoring
  initializeWebVitals() {
    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('webVitals', {
            name: 'FCP',
            value: entry.startTime,
            timestamp: Date.now(),
            threshold: this.thresholds.firstContentfulPaint,
            passed: entry.startTime <= this.thresholds.firstContentfulPaint
          });
        }
      });
    });
    
    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('webVitals', {
        name: 'LCP',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        threshold: this.thresholds.largestContentfulPaint,
        passed: lastEntry.startTime <= this.thresholds.largestContentfulPaint
      });
    });
    
    // Cumulative Layout Shift
    this.observePerformanceEntry('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.recordMetric('webVitals', {
        name: 'CLS',
        value: clsValue,
        timestamp: Date.now(),
        threshold: this.thresholds.cumulativeLayoutShift,
        passed: clsValue <= this.thresholds.cumulativeLayoutShift
      });
    });
    
    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      const firstInput = entries[0];
      this.recordMetric('webVitals', {
        name: 'FID',
        value: firstInput.processingStart - firstInput.startTime,
        timestamp: Date.now(),
        threshold: this.thresholds.firstInputDelay,
        passed: (firstInput.processingStart - firstInput.startTime) <= this.thresholds.firstInputDelay
      });
    });
  }
  
  // Initialize resource observer
  initializeResourceObserver() {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach(entry => {
        const resourceMetric = {
          name: entry.name,
          type: entry.initiatorType,
          duration: entry.duration,
          size: entry.transferSize || 0,
          timestamp: Date.now(),
          startTime: entry.startTime,
          responseEnd: entry.responseEnd
        };
        
        this.recordMetric('resources', resourceMetric);
        
        // Check for slow resources
        if (entry.duration > 1000) {
          this.recordMetric('slowResources', {
            ...resourceMetric,
            warning: 'Slow resource load detected'
          });
        }
      });
    });
  }
  
  // Initialize navigation observer
  initializeNavigationObserver() {
    this.observePerformanceEntry('navigation', (entries) => {
      entries.forEach(entry => {
        const navigationMetric = {
          type: entry.type,
          duration: entry.duration,
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          timestamp: Date.now(),
          passed: entry.duration <= this.thresholds.pageLoadTime
        };
        
        this.recordMetric('navigation', navigationMetric);
      });
    });
  }
  
  // Initialize error tracking
  initializeErrorTracking() {
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });
  }
  
  // Observe performance entries
  observePerformanceEntry(type, callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        
        observer.observe({ type, buffered: true });
        this.observers.set(type, observer);
      } catch (error) {
        console.warn(`Failed to observe ${type} performance entries:`, error);
      }
    }
  }
  
  // Record metric
  recordMetric(category, metric) {
    if (!this.metrics[category]) {
      this.metrics[category] = [];
    }
    
    this.metrics[category].push(metric);
    
    // Keep only last 100 entries per category
    if (this.metrics[category].length > 100) {
      this.metrics[category] = this.metrics[category].slice(-100);
    }
    
    // Emit performance event for real-time monitoring
    this.emitPerformanceEvent(category, metric);
  }
  
  // Record error
  recordError(error) {
    this.recordMetric('errors', error);
    
    // Send critical errors immediately
    if (this.isCriticalError(error)) {
      this.sendErrorReport(error);
    }
  }
  
  // Check if error is critical
  isCriticalError(error) {
    const criticalPatterns = [
      /payment/i,
      /booking/i,
      /authentication/i,
      /security/i,
      /database/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }
  
  // Emit performance event
  emitPerformanceEvent(category, metric) {
    const event = new CustomEvent('performance-metric', {
      detail: { category, metric }
    });
    
    window.dispatchEvent(event);
  }
  
  // Measure API call performance
  measureApiCall(url, startTime, endTime, success, error = null) {
    const duration = endTime - startTime;
    const apiMetric = {
      url,
      duration,
      success,
      error: error?.message,
      timestamp: Date.now(),
      passed: duration <= this.thresholds.apiResponseTime
    };
    
    this.recordMetric('apiCalls', apiMetric);
    
    // Alert on slow API calls
    if (duration > this.thresholds.apiResponseTime) {
      console.warn(`Slow API call detected: ${url} took ${duration}ms`);
    }
    
    return apiMetric;
  }
  
  // Measure user interaction
  measureUserInteraction(action, element, duration) {
    const interactionMetric = {
      action,
      element: element?.tagName || 'unknown',
      duration,
      timestamp: Date.now()
    };
    
    this.recordMetric('userInteractions', interactionMetric);
    return interactionMetric;
  }
  
  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      timestamp: Date.now(),
      webVitals: this.getWebVitalsSummary(),
      apiPerformance: this.getApiPerformanceSummary(),
      resourcePerformance: this.getResourcePerformanceSummary(),
      errorRate: this.getErrorRate(),
      recommendations: this.getRecommendations()
    };
    
    return summary;
  }
  
  // Get Web Vitals summary
  getWebVitalsSummary() {
    const webVitals = this.metrics.webVitals || [];
    const latest = {};
    
    webVitals.forEach(metric => {
      latest[metric.name] = metric;
    });
    
    return {
      fcp: latest.FCP,
      lcp: latest.LCP,
      cls: latest.CLS,
      fid: latest.FID,
      overallScore: this.calculateWebVitalsScore(latest)
    };
  }
  
  // Calculate Web Vitals score
  calculateWebVitalsScore(vitals) {
    const scores = [];
    
    if (vitals.FCP) scores.push(vitals.FCP.passed ? 100 : 50);
    if (vitals.LCP) scores.push(vitals.LCP.passed ? 100 : 50);
    if (vitals.CLS) scores.push(vitals.CLS.passed ? 100 : 50);
    if (vitals.FID) scores.push(vitals.FID.passed ? 100 : 50);
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  }
  
  // Get API performance summary
  getApiPerformanceSummary() {
    const apiCalls = this.metrics.apiCalls || [];
    
    if (apiCalls.length === 0) return null;
    
    const durations = apiCalls.map(call => call.duration);
    const successRate = (apiCalls.filter(call => call.success).length / apiCalls.length) * 100;
    
    return {
      totalCalls: apiCalls.length,
      averageResponseTime: Math.round(durations.reduce((a, b) => a + b) / durations.length),
      successRate: Math.round(successRate),
      slowCalls: apiCalls.filter(call => !call.passed).length
    };
  }
  
  // Get resource performance summary
  getResourcePerformanceSummary() {
    const resources = this.metrics.resources || [];
    
    if (resources.length === 0) return null;
    
    const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
    const averageLoadTime = resources.reduce((sum, resource) => sum + resource.duration, 0) / resources.length;
    
    return {
      totalResources: resources.length,
      totalSize: Math.round(totalSize / 1024), // KB
      averageLoadTime: Math.round(averageLoadTime),
      slowResources: (this.metrics.slowResources || []).length
    };
  }
  
  // Get error rate
  getErrorRate() {
    const errors = this.metrics.errors || [];
    const timeWindow = 60 * 60 * 1000; // 1 hour
    const recentErrors = errors.filter(error => 
      Date.now() - error.timestamp < timeWindow
    );
    
    return {
      total: errors.length,
      recent: recentErrors.length,
      critical: errors.filter(error => this.isCriticalError(error)).length
    };
  }
  
  // Get performance recommendations
  getRecommendations() {
    const recommendations = [];
    const summary = this.getPerformanceSummary();
    
    // Web Vitals recommendations
    const webVitals = summary.webVitals;
    if (webVitals.fcp && !webVitals.fcp.passed) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'First Contentful Paint is slow. Consider optimizing critical resources.'
      });
    }
    
    if (webVitals.lcp && !webVitals.lcp.passed) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Largest Contentful Paint is slow. Optimize images and critical resources.'
      });
    }
    
    // API performance recommendations
    if (summary.apiPerformance && summary.apiPerformance.slowCalls > 0) {
      recommendations.push({
        type: 'api',
        priority: 'medium',
        message: `${summary.apiPerformance.slowCalls} slow API calls detected. Consider caching or optimization.`
      });
    }
    
    // Resource recommendations
    if (summary.resourcePerformance && summary.resourcePerformance.slowResources > 0) {
      recommendations.push({
        type: 'resources',
        priority: 'medium',
        message: 'Slow resources detected. Consider compression or CDN usage.'
      });
    }
    
    return recommendations;
  }
  
  // Send performance report
  async sendPerformanceReport() {
    const summary = this.getPerformanceSummary();
    
    try {
      await fetch('/api/performance/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(summary)
      });
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }
  
  // Send error report
  async sendErrorReport(error) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
    } catch (reportError) {
      console.error('Failed to send error report:', reportError);
    }
  }
  
  // Start periodic reporting
  startPeriodicReporting() {
    // Send performance report every 5 minutes
    setInterval(() => {
      this.sendPerformanceReport();
    }, 5 * 60 * 1000);
  }
  
  // Clean up observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Create singleton instance
export const performanceService = new PerformanceService();

// Performance decorator for functions
export const withPerformanceTracking = (name) => {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const startTime = performance.now();
      let error = null;
      let result;
      
      try {
        result = await method.apply(this, args);
      } catch (err) {
        error = err;
        throw err;
      } finally {
        const endTime = performance.now();
        performanceService.measureApiCall(
          name || `${target.constructor.name}.${propertyName}`,
          startTime,
          endTime,
          !error,
          error
        );
      }
      
      return result;
    };
    
    return descriptor;
  };
};

export default performanceService;