import { chatSession } from './AIModel';

class SafetyAccessibilityService {
  constructor() {
    // Curated safety data for major Indian cities
    this.safetyDatabase = {
      // Women-safe areas in major cities
      womenSafeAreas: {
        'Delhi': ['Connaught Place', 'Khan Market', 'Hauz Khas Village', 'Select Citywalk', 'DLF Promenade'],
        'Mumbai': ['Colaba', 'Bandra', 'Juhu', 'Marine Drive', 'Phoenix Mall'],
        'Bangalore': ['MG Road', 'Indiranagar', 'Koramangala', 'UB City', 'Orion Mall'],
        'Jaipur': ['City Palace', 'Hawa Mahal', 'Amber Fort', 'JLN Marg', 'World Trade Park'],
        'Goa': ['Panjim', 'Calangute Beach', 'Baga Beach (daytime)', 'Anjuna Flea Market', 'Fort Aguada']
      },
      
      // Wheelchair accessible venues
      wheelchairAccessible: {
        'Delhi': ['India Gate', 'Lotus Temple', 'Akshardham', 'Select Citywalk', 'DLF Mall of India'],
        'Mumbai': ['Gateway of India', 'Marine Drive', 'Phoenix Mall', 'Nehru Science Centre', 'Sanjay Gandhi National Park'],
        'Bangalore': ['Lalbagh', 'Cubbon Park', 'Vidhana Soudha', 'UB City', 'Phoenix Marketcity'],
        'Jaipur': ['City Palace (partial)', 'Jal Mahal (exterior)', 'World Trade Park', 'Pink Square Mall'],
        'Goa': ['Basilica of Bom Jesus', 'Fort Aguada', 'Panjim Church Square', 'Deltin Royale Casino']
      },
      
      // Kid-friendly attractions
      kidFriendly: {
        'Delhi': ['National Science Centre', 'Nehru Planetarium', 'Adventure Island', 'KidZania', 'Lodhi Garden'],
        'Mumbai': ['Nehru Science Centre', 'Taraporewala Aquarium', 'EsselWorld', 'Sanjay Gandhi National Park', 'Juhu Beach'],
        'Bangalore': ['Wonderla', 'Cubbon Park', 'Lalbagh', 'Innovative Film City', 'Bannerghatta Zoo'],
        'Jaipur': ['Jaipur Zoo', 'Jawahar Kala Kendra', 'Fun Kingdom', 'Nahargarh Fort', 'Jal Mahal'],
        'Goa': ['Splashdown Waterpark', 'Butterfly Conservatory', 'Goa Science Centre', 'Beaches', 'Spice Plantations']
      }
    };
    
    // Time-of-day recommendations
    this.timeRecommendations = {
      earlyMorning: ['temples', 'gardens', 'sunrise points', 'yoga centers', 'morning walks'],
      morning: ['museums', 'historical sites', 'markets', 'shopping', 'sightseeing'],
      afternoon: ['indoor attractions', 'malls', 'cafes', 'museums', 'art galleries'],
      evening: ['sunset points', 'beach walks', 'light shows', 'cultural performances', 'markets'],
      night: ['night markets', 'rooftop restaurants', 'cultural shows', 'well-lit promenades']
    };
  }

  // Tag a place with safety and accessibility attributes
  tagPlace(placeName, city, placeType) {
    const tags = {
      safeForWomen: false,
      safeForSolo: false,
      wheelchairAccessible: false,
      kidFriendly: false,
      crowdLevel: 'moderate',
      bestTimeOfDay: 'morning',
      walkingRequired: 'moderate',
      isolationLevel: 'low'
    };

    // Check women-safe areas
    if (this.safetyDatabase.womenSafeAreas[city]?.some(area => 
      placeName.toLowerCase().includes(area.toLowerCase())
    )) {
      tags.safeForWomen = true;
      tags.safeForSolo = true;
    }

    // Check wheelchair accessibility
    if (this.safetyDatabase.wheelchairAccessible[city]?.some(area => 
      placeName.toLowerCase().includes(area.toLowerCase())
    )) {
      tags.wheelchairAccessible = true;
    }

    // Check kid-friendly
    if (this.safetyDatabase.kidFriendly[city]?.some(area => 
      placeName.toLowerCase().includes(area.toLowerCase())
    )) {
      tags.kidFriendly = true;
    }

    // Heuristic tagging based on place type
    const lowerPlaceName = placeName.toLowerCase();
    const lowerPlaceType = placeType?.toLowerCase() || '';

    // Safety heuristics
    if (lowerPlaceName.includes('mall') || lowerPlaceName.includes('museum') || 
        lowerPlaceName.includes('temple') || lowerPlaceName.includes('palace')) {
      tags.safeForWomen = true;
      tags.safeForSolo = true;
      tags.crowdLevel = 'high';
    }

    if (lowerPlaceName.includes('market') || lowerPlaceName.includes('bazaar')) {
      tags.crowdLevel = 'high';
      tags.safeForWomen = true;
    }

    if (lowerPlaceName.includes('fort') || lowerPlaceName.includes('hill') || 
        lowerPlaceName.includes('trek')) {
      tags.isolationLevel = 'medium';
      tags.walkingRequired = 'high';
    }

    // Accessibility heuristics
    if (lowerPlaceName.includes('mall') || lowerPlaceName.includes('hotel') || 
        lowerPlaceName.includes('restaurant')) {
      tags.wheelchairAccessible = true;
      tags.walkingRequired = 'low';
    }

    if (lowerPlaceName.includes('garden') || lowerPlaceName.includes('park')) {
      tags.kidFriendly = true;
      tags.wheelchairAccessible = true;
      tags.walkingRequired = 'moderate';
    }

    // Time recommendations
    if (lowerPlaceName.includes('temple') || lowerPlaceName.includes('sunrise')) {
      tags.bestTimeOfDay = 'earlyMorning';
    } else if (lowerPlaceName.includes('museum') || lowerPlaceName.includes('palace')) {
      tags.bestTimeOfDay = 'morning';
    } else if (lowerPlaceName.includes('mall') || lowerPlaceName.includes('cafe')) {
      tags.bestTimeOfDay = 'afternoon';
    } else if (lowerPlaceName.includes('sunset') || lowerPlaceName.includes('beach')) {
      tags.bestTimeOfDay = 'evening';
    } else if (lowerPlaceName.includes('night market') || lowerPlaceName.includes('club')) {
      tags.bestTimeOfDay = 'night';
    }

    return tags;
  }

  // Filter itinerary based on safety/accessibility preferences
  filterItinerary(itinerary, filters, city) {
    if (!itinerary || !Array.isArray(itinerary)) {
      return itinerary;
    }

    return itinerary.map(day => {
      if (!day.activities || !Array.isArray(day.activities)) {
        return day;
      }

      let filteredActivities = day.activities.map(activity => {
        const tags = this.tagPlace(activity.activity || activity.placeName || '', city, activity.type);
        
        // Apply filters
        let shouldInclude = true;
        let warnings = [];
        let alternatives = [];

        // Safety filters
        if (filters.safeForWomen && !tags.safeForWomen) {
          warnings.push('⚠️ May not be ideal for solo women travelers');
          shouldInclude = false;
        }

        if (filters.safeForSolo && !tags.safeForSolo) {
          warnings.push('⚠️ Better to visit with a group');
          shouldInclude = false;
        }

        if (filters.avoidIsolatedAreas && tags.isolationLevel === 'high') {
          warnings.push('⚠️ Isolated area - consider visiting during peak hours');
          shouldInclude = false;
        }

        if (filters.preferCrowdedPlaces && tags.crowdLevel === 'low') {
          shouldInclude = false;
        }

        // Accessibility filters
        if (filters.wheelchairFriendly && !tags.wheelchairAccessible) {
          warnings.push('♿ Limited wheelchair accessibility');
          shouldInclude = false;
        }

        if (filters.lowWalking && tags.walkingRequired === 'high') {
          warnings.push('🚶 Requires significant walking');
          shouldInclude = false;
        }

        // Family filters
        if (filters.familyWithKids && !tags.kidFriendly) {
          warnings.push('👶 May not be suitable for young children');
        }

        if (filters.includeKidFriendly && !tags.kidFriendly) {
          shouldInclude = false;
        }

        // Time filters
        const activityTime = activity.time || '';
        const hour = parseInt(activityTime.split(':')[0]) || 10;

        if (filters.avoidLateNight && hour >= 21) {
          warnings.push('🌙 Late night activity');
          shouldInclude = false;
        }

        if (filters.avoidEarlyMorning && hour < 9) {
          warnings.push('🌅 Early morning activity');
          shouldInclude = false;
        }

        if (filters.preferDaytime && (hour < 9 || hour >= 18)) {
          shouldInclude = false;
        }

        return {
          ...activity,
          safetyTags: tags,
          warnings,
          alternatives,
          recommended: shouldInclude
        };
      });

      // Filter out non-recommended activities if filters are strict
      const hasStrictFilters = filters.safeForWomen || filters.wheelchairFriendly || 
                               filters.familyWithKids || filters.preferDaytime;
      
      if (hasStrictFilters) {
        filteredActivities = filteredActivities.filter(a => a.recommended);
      }

      return {
        ...day,
        activities: filteredActivities
      };
    });
  }

  // Generate safety prompt for AI
  generateSafetyPrompt(filters) {
    const prompts = [];

    if (filters.safeForWomen) {
      prompts.push('CRITICAL: Only recommend well-lit, populated areas that are safe for solo women travelers. Include safety tips.');
    }

    if (filters.safeForSolo) {
      prompts.push('Recommend tourist-friendly areas with good connectivity and safety for solo travelers.');
    }

    if (filters.avoidIsolatedAreas) {
      prompts.push('Avoid remote, isolated, or less-populated locations. Stick to main tourist areas.');
    }

    if (filters.preferCrowdedPlaces) {
      prompts.push('Prefer popular, crowded tourist spots with high footfall and good security.');
    }

    if (filters.wheelchairFriendly) {
      prompts.push('CRITICAL: Only include wheelchair-accessible venues with ramps, elevators, and accessible facilities.');
    }

    if (filters.lowWalking) {
      prompts.push(`Minimize walking. Plan cab/auto-heavy itinerary. Max ${filters.maxWalkingDistance}km walking per day.`);
    }

    if (filters.familyWithKids) {
      prompts.push('Include kid-friendly attractions: parks, museums, interactive exhibits, family restaurants.');
    }

    if (filters.avoidLateNight) {
      prompts.push('No activities after 9 PM. End each day by 8:30 PM.');
    }

    if (filters.preferDaytime) {
      prompts.push('All activities between 9 AM - 6 PM only. Daytime itinerary.');
    }

    if (filters.avoidEarlyMorning) {
      prompts.push('Start activities after 9 AM. No early morning plans.');
    }

    if (prompts.length === 0) {
      return '';
    }

    return `\n\nSAFETY & ACCESSIBILITY REQUIREMENTS:\n${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
  }

  // Get safety score for a destination
  async getSafetyScore(destination, filters) {
    try {
      const prompt = `
Rate the safety and accessibility of ${destination} for the following traveler profile:
- Women solo traveler: ${filters.safeForWomen ? 'Yes' : 'No'}
- Wheelchair accessibility needed: ${filters.wheelchairFriendly ? 'Yes' : 'No'}
- Family with kids: ${filters.familyWithKids ? 'Yes' : 'No'}

Provide a JSON response with:
{
  "safetyScore": 0-10,
  "accessibilityScore": 0-10,
  "familyFriendlyScore": 0-10,
  "recommendations": ["tip1", "tip2", "tip3"],
  "warnings": ["warning1", "warning2"],
  "bestAreas": ["area1", "area2", "area3"]
}
`;

      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackSafetyScore(destination);
    } catch (error) {
      console.error('Error getting safety score:', error);
      return this.getFallbackSafetyScore(destination);
    }
  }

  getFallbackSafetyScore(destination) {
    // Fallback safety scores for major cities
    const scores = {
      'Delhi': { safetyScore: 7, accessibilityScore: 6, familyFriendlyScore: 8 },
      'Mumbai': { safetyScore: 8, accessibilityScore: 7, familyFriendlyScore: 8 },
      'Bangalore': { safetyScore: 8, accessibilityScore: 7, familyFriendlyScore: 9 },
      'Jaipur': { safetyScore: 7, accessibilityScore: 6, familyFriendlyScore: 8 },
      'Goa': { safetyScore: 8, accessibilityScore: 6, familyFriendlyScore: 9 }
    };

    return scores[destination] || { safetyScore: 7, accessibilityScore: 6, familyFriendlyScore: 7 };
  }

  // Get alternative suggestions
  getAlternatives(activity, filters, city) {
    const alternatives = [];

    if (filters.safeForWomen && this.safetyDatabase.womenSafeAreas[city]) {
      alternatives.push({
        type: 'safety',
        suggestion: `Consider visiting ${this.safetyDatabase.womenSafeAreas[city][0]} instead - known to be safe for women travelers`
      });
    }

    if (filters.wheelchairFriendly && this.safetyDatabase.wheelchairAccessible[city]) {
      alternatives.push({
        type: 'accessibility',
        suggestion: `Alternative: ${this.safetyDatabase.wheelchairAccessible[city][0]} - wheelchair accessible`
      });
    }

    if (filters.familyWithKids && this.safetyDatabase.kidFriendly[city]) {
      alternatives.push({
        type: 'family',
        suggestion: `Kid-friendly option: ${this.safetyDatabase.kidFriendly[city][0]}`
      });
    }

    return alternatives;
  }
}

export const safetyAccessibilityService = new SafetyAccessibilityService();
