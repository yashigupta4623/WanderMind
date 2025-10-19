// Feedback Service for managing user feedback and dynamic stats
class FeedbackService {
  constructor() {
    this.feedbackKey = 'wandermind_feedback';
    this.statsKey = 'wandermind_stats';
    this.initializeStats();
  }

  // Initialize default stats if not present
  initializeStats() {
    const existingStats = this.getStats();
    if (!existingStats) {
      const defaultStats = {
        tripsPlanned: 50247,
        destinations: 28,
        userRating: 4.9,
        totalUsers: 12500,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.statsKey, JSON.stringify(defaultStats));
    }
  }

  // Get current stats
  getStats() {
    try {
      const stats = localStorage.getItem(this.statsKey);
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }

  // Update stats based on user actions
  updateStats(action, value = 1) {
    const stats = this.getStats();
    if (!stats) return;

    switch (action) {
      case 'trip_planned':
        stats.tripsPlanned += value;
        break;
      case 'destination_added':
        stats.destinations = Math.max(stats.destinations, value);
        break;
      case 'user_joined':
        stats.totalUsers += value;
        break;
      case 'rating_updated':
        // Calculate new average rating
        const currentTotal = stats.userRating * stats.totalUsers;
        const newTotal = currentTotal + value;
        stats.userRating = Math.round((newTotal / (stats.totalUsers + 1)) * 10) / 10;
        break;
    }

    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.statsKey, JSON.stringify(stats));
    
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
  }

  // Get all feedback
  getFeedback() {
    try {
      const feedback = localStorage.getItem(this.feedbackKey);
      return feedback ? JSON.parse(feedback) : [];
    } catch (error) {
      console.error('Error getting feedback:', error);
      return [];
    }
  }

  // Add new feedback
  addFeedback(feedbackData) {
    const feedback = this.getFeedback();
    const newFeedback = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...feedbackData
    };
    
    feedback.push(newFeedback);
    localStorage.setItem(this.feedbackKey, JSON.stringify(feedback));
    
    // Update stats based on feedback
    if (feedbackData.rating) {
      this.updateStats('rating_updated', feedbackData.rating);
    }
    
    return newFeedback;
  }

  // Get feedback summary
  getFeedbackSummary() {
    const feedback = this.getFeedback();
    const total = feedback.length;
    
    if (total === 0) return { averageRating: 4.9, totalFeedback: 0 };
    
    const averageRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / total;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalFeedback: total,
      recentFeedback: feedback.slice(-5).reverse()
    };
  }

  // Simulate real-time updates (for demo purposes)
  simulateRealTimeUpdates() {
    setInterval(() => {
      // Randomly update stats to simulate real users
      const actions = ['trip_planned', 'user_joined'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (Math.random() > 0.7) { // 30% chance every interval
        this.updateStats(randomAction, 1);
      }
    }, 10000); // Every 10 seconds
  }
}

export const feedbackService = new FeedbackService();

// Start real-time simulation
feedbackService.simulateRealTimeUpdates();