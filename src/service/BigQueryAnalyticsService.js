// BigQuery Analytics Service for WanderMind
// This service handles analytics, insights, and ML-powered predictions using Google BigQuery

class BigQueryAnalyticsService {
  constructor() {
    this.projectId = import.meta.env.VITE_GCP_PROJECT_ID;
    this.datasetId = 'wandermind_analytics';
    this.apiEndpoint = import.meta.env.VITE_BIGQUERY_API_ENDPOINT;
    this.apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
  }

  // ==========================================
  // 1. TRIP DATA ANALYTICS
  // ==========================================

  /**
   * Log trip generation event to BigQuery
   * Used for: Analytics, trend analysis, ML training
   */
  async logTripGeneration(tripData) {
    const event = {
      event_type: 'trip_generated',
      timestamp: new Date().toISOString(),
      user_id: tripData.userEmail,
      destination: tripData.userSelection?.location?.label,
      duration_days: parseInt(tripData.userSelection?.noofDays),
      budget_type: tripData.userSelection?.budget,
      budget_amount: tripData.userSelection?.budgetAmount,
      travelers: tripData.userSelection?.traveler,
      persona: tripData.userSelection?.persona,
      themes: tripData.userSelection?.themes,
      constraints: tripData.userSelection?.safetyFilters,
      session_id: this.getSessionId()
    };

    return this.insertRow('trip_events', event);
  }

  /**
   * Log user interaction events
   * Used for: Preference learning, UX optimization
   */
  async logUserInteraction(eventType, eventData) {
    const event = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      user_id: this.getUserId(),
      event_data: JSON.stringify(eventData),
      session_id: this.getSessionId()
    };

    return this.insertRow('user_interactions', event);
  }

  // ==========================================
  // 2. PREFERENCE LEARNING WITH ML
  // ==========================================

  /**
   * Get personalized recommendations using BigQuery ML
   * Uses trained ML model on historical trip data
   */
  async getPersonalizedRecommendations(userId) {
    const query = `
      SELECT 
        destination,
        predicted_rating,
        budget_range,
        best_season
      FROM 
        ML.PREDICT(MODEL \`${this.projectId}.${this.datasetId}.trip_recommendation_model\`,
          (SELECT 
            '${userId}' as user_id,
            user_preferences,
            past_destinations,
            budget_history
          FROM \`${this.projectId}.${this.datasetId}.user_profiles\`
          WHERE user_id = '${userId}'))
      ORDER BY predicted_rating DESC
      LIMIT 5
    `;

    return this.executeQuery(query);
  }

  /**
   * Predict optimal budget using ML model
   * Trained on: destination, duration, season, traveler count
   */
  async predictOptimalBudget(destination, days, travelers) {
    const query = `
      SELECT 
        predicted_budget,
        confidence_score,
        budget_breakdown
      FROM 
        ML.PREDICT(MODEL \`${this.projectId}.${this.datasetId}.budget_prediction_model\`,
          (SELECT 
            '${destination}' as destination,
            ${days} as duration_days,
            ${travelers} as traveler_count,
            EXTRACT(MONTH FROM CURRENT_DATE()) as travel_month
          ))
    `;

    return this.executeQuery(query);
  }

  // ==========================================
  // 3. TRAVEL TRENDS & INSIGHTS
  // ==========================================

  /**
   * Get trending destinations
   * Real-time analysis of popular destinations
   */
  async getTrendingDestinations(timeframe = '30_days') {
    const query = `
      SELECT 
        destination,
        COUNT(*) as trip_count,
        AVG(budget_amount) as avg_budget,
        AVG(duration_days) as avg_duration,
        ARRAY_AGG(DISTINCT persona IGNORE NULLS) as popular_personas
      FROM \`${this.projectId}.${this.datasetId}.trip_events\`
      WHERE 
        timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeframe === '30_days' ? 30 : 7} DAY)
        AND event_type = 'trip_generated'
      GROUP BY destination
      ORDER BY trip_count DESC
      LIMIT 10
    `;

    return this.executeQuery(query);
  }

  /**
   * Get seasonal travel patterns
   * Helps with pricing and recommendations
   */
  async getSeasonalPatterns(destination) {
    const query = `
      SELECT 
        EXTRACT(MONTH FROM timestamp) as month,
        COUNT(*) as bookings,
        AVG(budget_amount) as avg_budget,
        APPROX_QUANTILES(budget_amount, 100)[OFFSET(50)] as median_budget
      FROM \`${this.projectId}.${this.datasetId}.trip_events\`
      WHERE 
        destination = '${destination}'
        AND event_type = 'trip_generated'
      GROUP BY month
      ORDER BY month
    `;

    return this.executeQuery(query);
  }

  // ==========================================
  // 4. PRICING INTELLIGENCE
  // ==========================================

  /**
   * Get dynamic pricing insights
   * Based on: demand, season, competition
   */
  async getDynamicPricingInsights(destination, travelDate) {
    const query = `
      WITH recent_bookings AS (
        SELECT 
          budget_amount,
          duration_days,
          timestamp
        FROM \`${this.projectId}.${this.datasetId}.trip_events\`
        WHERE 
          destination = '${destination}'
          AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
      )
      SELECT 
        AVG(budget_amount) as avg_price,
        MIN(budget_amount) as min_price,
        MAX(budget_amount) as max_price,
        STDDEV(budget_amount) as price_volatility,
        COUNT(*) as sample_size,
        CASE 
          WHEN COUNT(*) > 100 THEN 'High Demand'
          WHEN COUNT(*) > 50 THEN 'Medium Demand'
          ELSE 'Low Demand'
        END as demand_level
      FROM recent_bookings
    `;

    return this.executeQuery(query);
  }

  // ==========================================
  // 5. USER BEHAVIOR ANALYTICS
  // ==========================================

  /**
   * Get user engagement metrics
   * For: Product optimization, feature prioritization
   */
  async getUserEngagementMetrics() {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(DISTINCT user_id) as daily_active_users,
        COUNT(*) as total_events,
        COUNTIF(event_type = 'trip_generated') as trips_generated,
        COUNTIF(event_type = 'booking_completed') as bookings_completed,
        SAFE_DIVIDE(
          COUNTIF(event_type = 'booking_completed'),
          COUNTIF(event_type = 'trip_generated')
        ) * 100 as conversion_rate
      FROM \`${this.projectId}.${this.datasetId}.user_interactions\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
      GROUP BY date
      ORDER BY date DESC
    `;

    return this.executeQuery(query);
  }

  /**
   * Get feature usage statistics
   * Helps prioritize feature development
   */
  async getFeatureUsageStats() {
    const query = `
      SELECT 
        JSON_EXTRACT_SCALAR(event_data, '$.feature') as feature_name,
        COUNT(*) as usage_count,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(CAST(JSON_EXTRACT_SCALAR(event_data, '$.duration_seconds') AS FLOAT64)) as avg_duration
      FROM \`${this.projectId}.${this.datasetId}.user_interactions\`
      WHERE 
        event_type = 'feature_used'
        AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
      GROUP BY feature_name
      ORDER BY usage_count DESC
    `;

    return this.executeQuery(query);
  }

  // ==========================================
  // 6. SAFETY & SUSTAINABILITY ANALYTICS
  // ==========================================

  /**
   * Get carbon footprint trends
   * For: Sustainability reporting
   */
  async getCarbonFootprintTrends() {
    const query = `
      SELECT 
        DATE_TRUNC(timestamp, MONTH) as month,
        AVG(CAST(JSON_EXTRACT_SCALAR(event_data, '$.carbon_kg') AS FLOAT64)) as avg_carbon_kg,
        COUNTIF(JSON_EXTRACT_SCALAR(event_data, '$.transport') = 'train') as train_trips,
        COUNTIF(JSON_EXTRACT_SCALAR(event_data, '$.transport') = 'flight') as flight_trips,
        COUNTIF(JSON_EXTRACT_SCALAR(event_data, '$.transport') = 'bus') as bus_trips
      FROM \`${this.projectId}.${this.datasetId}.trip_events\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month DESC
    `;

    return this.executeQuery(query);
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  async executeQuery(query) {
    try {
      // In production, use @google-cloud/bigquery SDK
      // For demo, return mock data
      console.log('BigQuery Query:', query);
      
      if (!this.apiEndpoint) {
        console.warn('BigQuery not configured. Using mock data.');
        return this.getMockData(query);
      }

      const response = await fetch(`${this.apiEndpoint}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ query, useLegacySql: false })
      });

      return await response.json();
    } catch (error) {
      console.error('BigQuery query error:', error);
      return this.getMockData(query);
    }
  }

  async insertRow(tableName, data) {
    try {
      console.log(`Inserting into BigQuery table: ${tableName}`, data);
      
      if (!this.apiEndpoint) {
        console.warn('BigQuery not configured. Data logged locally.');
        return { success: true, mock: true };
      }

      const response = await fetch(`${this.apiEndpoint}/insertAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          table: `${this.projectId}.${this.datasetId}.${tableName}`,
          rows: [{ json: data }]
        })
      });

      return await response.json();
    } catch (error) {
      console.error('BigQuery insert error:', error);
      return { success: false, error: error.message };
    }
  }

  getMockData(query) {
    // Return realistic mock data for demo
    if (query.includes('trending_destinations')) {
      return {
        rows: [
          { destination: 'Goa', trip_count: 1250, avg_budget: 28000, avg_duration: 4.2 },
          { destination: 'Jaipur', trip_count: 980, avg_budget: 22000, avg_duration: 3.5 },
          { destination: 'Kerala', trip_count: 850, avg_budget: 35000, avg_duration: 5.8 }
        ]
      };
    }
    
    if (query.includes('budget_prediction')) {
      return {
        rows: [
          { predicted_budget: 25000, confidence_score: 0.87, budget_breakdown: '{"hotel":8750,"food":6250}' }
        ]
      };
    }

    return { rows: [], mock: true };
  }

  getUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email || 'anonymous';
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('wandermind_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('wandermind_session_id', sessionId);
    }
    return sessionId;
  }
}

export const bigQueryAnalytics = new BigQueryAnalyticsService();
