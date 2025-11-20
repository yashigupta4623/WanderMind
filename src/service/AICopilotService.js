import { chatSession } from './AIModel';

class AICopilotService {
  constructor() {
    this.activeAlerts = [];
    this.weatherCache = {};
  }

  // Simulate weather check (in production, use real weather API)
  async checkWeather(location, date) {
    const weatherConditions = ['sunny', 'rainy', 'cloudy', 'stormy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    return {
      condition: randomCondition,
      temperature: Math.floor(Math.random() * 15) + 20,
      precipitation: randomCondition === 'rainy' || randomCondition === 'stormy' ? Math.floor(Math.random() * 80) + 20 : 0,
      windSpeed: Math.floor(Math.random() * 20) + 5
    };
  }

  // Check for disruptions and suggest alternatives
  async checkForDisruptions(tripData, currentDay) {
    const alerts = [];
    
    // Check weather
    const weather = await this.checkWeather(tripData.destination, new Date());
    
    if (weather.condition === 'rainy' || weather.condition === 'stormy') {
      const outdoorActivities = this.findOutdoorActivities(tripData, currentDay);
      
      if (outdoorActivities.length > 0) {
        alerts.push({
          type: 'weather',
          severity: 'high',
          title: '🌧️ Weather Alert',
          message: `It's ${weather.condition} with ${weather.precipitation}% chance of rain. ${outdoorActivities.length} outdoor activities may be affected.`,
          suggestion: 'Swap outdoor activities with indoor alternatives?',
          alternatives: this.generateIndoorAlternatives(outdoorActivities),
          action: 'replan'
        });
      }
    }

    // Simulate flight delay check
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'transport',
        severity: 'medium',
        title: '✈️ Flight Delay Alert',
        message: 'Your flight is delayed by 2 hours.',
        suggestion: 'Shall I adjust Day 1 schedule?',
        action: 'reschedule'
      });
    }

    // Check for local events
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'event',
        severity: 'low',
        title: '🎉 Local Event Detected',
        message: 'There\'s a local festival happening today!',
        suggestion: 'Would you like to add this to your itinerary?',
        action: 'add'
      });
    }

    return alerts;
  }

  findOutdoorActivities(tripData, day) {
    const outdoorKeywords = ['walk', 'park', 'beach', 'garden', 'outdoor', 'trek', 'hiking', 'market'];
    const activities = [];

    if (tripData?.itinerary?.[day]?.plan) {
      tripData.itinerary[day].plan.forEach(activity => {
        const isOutdoor = outdoorKeywords.some(keyword => 
          activity.placeName?.toLowerCase().includes(keyword) ||
          activity.placeDetails?.toLowerCase().includes(keyword)
        );
        if (isOutdoor) {
          activities.push(activity);
        }
      });
    }

    return activities;
  }

  generateIndoorAlternatives(outdoorActivities) {
    const indoorOptions = [
      { name: 'Local Museum', type: 'museum', duration: '2-3 hours' },
      { name: 'Art Gallery', type: 'gallery', duration: '1-2 hours' },
      { name: 'Shopping Mall', type: 'shopping', duration: '2-4 hours' },
      { name: 'Indoor Café', type: 'cafe', duration: '1-2 hours' },
      { name: 'Cultural Center', type: 'cultural', duration: '2-3 hours' },
      { name: 'Spa & Wellness', type: 'wellness', duration: '2-3 hours' }
    ];

    return outdoorActivities.map((activity, index) => ({
      original: activity.placeName,
      alternative: indoorOptions[index % indoorOptions.length]
    }));
  }

  // Generate last-minute quick plan
  async generateQuickPlan(location, budget, duration = '1 day') {
    const quickPlanPrompt = `
Generate a HYPER-COMPRESSED quick travel plan for someone who just landed.

Location: ${location}
Budget: ₹${budget}
Duration: ${duration}
Urgency: IMMEDIATE (user just landed)

Generate ONLY 2-3 KEY spots + 1-2 food options that are:
1. Close to each other (minimize travel time)
2. Can be covered in ${duration}
3. Within ₹${budget} budget
4. Must-see/must-do only

Format as JSON with:
{
  "quickPlan": [
    {
      "time": "Now - 2 hours",
      "spot": "Place name",
      "why": "One line reason",
      "cost": "₹X",
      "travel": "X mins"
    }
  ],
  "totalCost": "₹X",
  "totalTime": "X hours"
}

Keep it MINIMAL and ACTIONABLE.`;

    try {
      const result = await chatSession.sendMessage(quickPlanPrompt);
      const response = result?.response?.text();
      
      // Try to parse JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback quick plan
      return this.generateFallbackQuickPlan(location, budget);
    } catch (error) {
      console.error('Quick plan generation error:', error);
      return this.generateFallbackQuickPlan(location, budget);
    }
  }

  generateFallbackQuickPlan(location, budget) {
    const budgetPerSpot = Math.floor(budget / 3);
    
    return {
      quickPlan: [
        {
          time: 'Now - 2 hours',
          spot: `${location} Main Attraction`,
          why: 'Must-see landmark, close to airport/station',
          cost: `₹${budgetPerSpot}`,
          travel: '15 mins'
        },
        {
          time: '2-3 hours',
          spot: 'Local Food Street',
          why: 'Authentic local cuisine experience',
          cost: `₹${Math.floor(budgetPerSpot * 0.6)}`,
          travel: '10 mins'
        },
        {
          time: '3-5 hours',
          spot: `${location} Market/Shopping Area`,
          why: 'Quick shopping and local culture',
          cost: `₹${Math.floor(budgetPerSpot * 0.8)}`,
          travel: '5 mins'
        }
      ],
      totalCost: `₹${budget}`,
      totalTime: '5 hours'
    };
  }

  // Apply re-plan based on alert
  async applyReplan(tripData, alert, userChoice) {
    if (alert.type === 'weather' && userChoice === 'accept') {
      // Swap outdoor activities with indoor alternatives
      const updatedItinerary = { ...tripData.itinerary };
      
      alert.alternatives.forEach(alt => {
        // Find and replace in itinerary
        Object.keys(updatedItinerary).forEach(day => {
          if (updatedItinerary[day].plan) {
            updatedItinerary[day].plan = updatedItinerary[day].plan.map(activity => {
              if (activity.placeName === alt.original) {
                return {
                  ...activity,
                  placeName: alt.alternative.name,
                  placeDetails: `Indoor alternative due to weather. ${alt.alternative.type}`,
                  timeTravel: alt.alternative.duration
                };
              }
              return activity;
            });
          }
        });
      });

      return {
        ...tripData,
        itinerary: updatedItinerary,
        lastUpdated: Date.now(),
        updateReason: 'Weather-based re-planning'
      };
    }

    if (alert.type === 'transport' && userChoice === 'accept') {
      // Shift Day 1 schedule by 2 hours
      const updatedItinerary = { ...tripData.itinerary };
      
      if (updatedItinerary['Day 1']?.plan) {
        updatedItinerary['Day 1'].plan = updatedItinerary['Day 1'].plan.map(activity => {
          // Shift time by 2 hours
          const timeMatch = activity.timeTravel?.match(/(\d+):(\d+)/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]) + 2;
            activity.timeTravel = `${hours}:${timeMatch[2]}`;
          }
          return activity;
        });
      }

      return {
        ...tripData,
        itinerary: updatedItinerary,
        lastUpdated: Date.now(),
        updateReason: 'Flight delay adjustment'
      };
    }

    return tripData;
  }

  // Generate notification message
  generateNotificationMessage(alert) {
    let message = `🤖 WanderMind AI Copilot\n\n`;
    message += `${alert.title}\n`;
    message += `${alert.message}\n\n`;
    message += `💡 ${alert.suggestion}\n\n`;
    
    if (alert.alternatives) {
      message += `Suggested alternatives:\n`;
      alert.alternatives.forEach((alt, index) => {
        message += `${index + 1}. ${alt.alternative.name} (${alt.alternative.duration})\n`;
      });
    }
    
    return message;
  }
}

export const aiCopilot = new AICopilotService();
