import { db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

class PreferenceLearningService {
  constructor() {
    this.userPreferences = {};
  }

  // Track user interactions
  async trackInteraction(userId, interaction) {
    const { type, item, action } = interaction;
    
    try {
      const prefDoc = doc(db, 'UserPreferences', userId);
      const prefSnap = await getDoc(prefDoc);
      
      let preferences = prefSnap.exists() ? prefSnap.data() : {
        foodPreferences: { streetFood: 0, fancyRestaurants: 0, localCuisine: 0, cafes: 0 },
        activityPreferences: { heritage: 0, adventure: 0, relaxation: 0, shopping: 0, nightlife: 0, nature: 0 },
        accommodationPreferences: { budget: 0, luxury: 0, boutique: 0 },
        transportPreferences: { public: 0, private: 0, walking: 0 },
        timingPreferences: { morning: 0, afternoon: 0, evening: 0 },
        crowdPreferences: { avoidCrowded: 0, dontMind: 0 },
        learningHistory: []
      };

      // Update preferences based on action
      if (type === 'restaurant' || type === 'food') {
        if (item.priceRange === 'budget' && action === 'selected') {
          preferences.foodPreferences.streetFood += 1;
        } else if (item.priceRange === 'luxury' && action === 'skipped') {
          preferences.foodPreferences.fancyRestaurants -= 1;
        } else if (item.priceRange === 'luxury' && action === 'selected') {
          preferences.foodPreferences.fancyRestaurants += 1;
        } else if (action === 'selected' && item.category === 'local') {
          preferences.foodPreferences.localCuisine += 1;
        }
      }

      if (type === 'activity') {
        if (action === 'selected') {
          const category = item.category || 'general';
          preferences.activityPreferences[category] = 
            (preferences.activityPreferences[category] || 0) + 1;
        } else if (action === 'skipped') {
          const category = item.category || 'general';
          preferences.activityPreferences[category] = 
            (preferences.activityPreferences[category] || 0) - 0.5;
        }
      }

      if (type === 'hotel') {
        if (action === 'selected') {
          if (item.priceRange === 'budget') {
            preferences.accommodationPreferences.budget += 1;
          } else if (item.priceRange === 'luxury') {
            preferences.accommodationPreferences.luxury += 1;
          } else {
            preferences.accommodationPreferences.boutique += 1;
          }
        }
      }

      if (type === 'timing') {
        if (action === 'preferred') {
          preferences.timingPreferences[item.timeOfDay] = 
            (preferences.timingPreferences[item.timeOfDay] || 0) + 1;
        }
      }

      if (type === 'crowd') {
        if (action === 'avoided') {
          preferences.crowdPreferences.avoidCrowded += 1;
        } else if (action === 'selected') {
          preferences.crowdPreferences.dontMind += 1;
        }
      }

      // Add to learning history
      preferences.learningHistory.push({
        timestamp: Date.now(),
        type,
        item: item.name || item.title,
        action,
        context: item.context || {}
      });

      // Keep only last 100 interactions
      if (preferences.learningHistory.length > 100) {
        preferences.learningHistory = preferences.learningHistory.slice(-100);
      }

      await setDoc(prefDoc, preferences);
      return preferences;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return null;
    }
  }

  // Get learned preferences for trip generation
  async getLearnedPreferences(userId) {
    if (!userId) return null;

    try {
      const prefDoc = doc(db, 'UserPreferences', userId);
      const prefSnap = await getDoc(prefDoc);
      
      if (!prefSnap.exists()) {
        return null;
      }

      const prefs = prefSnap.data();
      
      // Generate insights
      const insights = {
        preferredFoodType: this.getTopPreference(prefs.foodPreferences),
        preferredActivities: this.getTopPreferences(prefs.activityPreferences, 3),
        preferredAccommodation: this.getTopPreference(prefs.accommodationPreferences),
        preferredTransport: this.getTopPreference(prefs.transportPreferences),
        preferredTiming: this.getTopPreference(prefs.timingPreferences),
        avoidsCrowds: prefs.crowdPreferences.avoidCrowded > prefs.crowdPreferences.dontMind,
        totalInteractions: prefs.learningHistory?.length || 0
      };

      return { preferences: prefs, insights };
    } catch (error) {
      console.error('Error getting learned preferences:', error);
      return null;
    }
  }

  getTopPreference(prefObj) {
    if (!prefObj) return null;
    const entries = Object.entries(prefObj).filter(([_, value]) => value > 0);
    if (entries.length === 0) return null;
    return entries.sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  getTopPreferences(prefObj, count = 3) {
    if (!prefObj) return [];
    return Object.entries(prefObj)
      .filter(([_, value]) => value > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([key]) => key);
  }

  // Generate AI prompt enhancement based on learned preferences
  generatePreferencePrompt(insights) {
    if (!insights || insights.totalInteractions === 0) return '';

    let prompt = '\n\n🎯 USER LEARNED PREFERENCES (Apply these strictly):';
    
    if (insights.preferredFoodType) {
      const foodMap = {
        streetFood: 'street food and local eateries',
        fancyRestaurants: 'fine dining and upscale restaurants',
        localCuisine: 'authentic local cuisine',
        cafes: 'cafes and casual dining'
      };
      prompt += `\n- Food: User strongly prefers ${foodMap[insights.preferredFoodType] || insights.preferredFoodType}. Prioritize this in all restaurant recommendations.`;
    }
    
    if (insights.preferredActivities?.length > 0) {
      prompt += `\n- Activities: User enjoys ${insights.preferredActivities.join(', ')}. Include more of these activities in the itinerary.`;
    }
    
    if (insights.avoidsCrowds) {
      prompt += `\n- Crowds: User prefers less crowded places. Suggest off-peak timings and quieter alternatives whenever possible.`;
    }
    
    if (insights.preferredTiming) {
      prompt += `\n- Timing: User prefers ${insights.preferredTiming} activities. Schedule most activities during this time.`;
    }

    if (insights.preferredAccommodation) {
      prompt += `\n- Accommodation: User prefers ${insights.preferredAccommodation} hotels. Prioritize this category.`;
    }

    prompt += `\n\nNote: These preferences are learned from ${insights.totalInteractions} past interactions. Apply them to personalize this trip.`;

    return prompt;
  }

  // Create demo preferences for testing - generates varied data each time
  async createDemoPreferences(userId) {
    // Generate random preferences to simulate learning
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const demoPreferences = {
      foodPreferences: { 
        streetFood: random(5, 10), 
        fancyRestaurants: random(0, 4), 
        localCuisine: random(4, 8), 
        cafes: random(2, 6) 
      },
      activityPreferences: { 
        heritage: random(4, 9), 
        adventure: random(2, 7), 
        relaxation: random(1, 5), 
        shopping: random(0, 4), 
        nightlife: random(0, 3), 
        nature: random(3, 8) 
      },
      accommodationPreferences: { 
        budget: random(3, 8), 
        luxury: random(0, 4), 
        boutique: random(1, 5) 
      },
      transportPreferences: { 
        public: random(4, 8), 
        private: random(1, 5), 
        walking: random(2, 6) 
      },
      timingPreferences: { 
        morning: random(5, 10), 
        afternoon: random(2, 7), 
        evening: random(1, 5) 
      },
      crowdPreferences: { 
        avoidCrowded: random(4, 9), 
        dontMind: random(1, 4) 
      },
      learningHistory: [
        { timestamp: Date.now() - 86400000, type: 'food', item: 'Street Food Stall', action: 'selected' },
        { timestamp: Date.now() - 172800000, type: 'activity', item: 'Heritage Walk', action: 'selected' },
        { timestamp: Date.now() - 259200000, type: 'food', item: 'Fine Dining Restaurant', action: 'skipped' },
      ]
    };

    try {
      const prefDoc = doc(db, 'UserPreferences', userId);
      await setDoc(prefDoc, demoPreferences);
      return demoPreferences;
    } catch (error) {
      console.error('Error creating demo preferences:', error);
      return null;
    }
  }
}

export const preferenceLearning = new PreferenceLearningService();
