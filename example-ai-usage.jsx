// ============================================
// SIMPLE AI MODEL - COPY & PASTE EXAMPLES
// ============================================

import { simpleAI } from '@/service/SimpleAIModel';

// ============================================
// EXAMPLE 1: Basic Question
// ============================================
async function example1() {
  const answer = await simpleAI.ask('What are the top 5 tourist spots in Paris?');
  console.log(answer);
}

// ============================================
// EXAMPLE 2: Get JSON Data
// ============================================
async function example2() {
  const data = await simpleAI.askJSON(`
    List 3 European cities perfect for a weekend trip.
    Return JSON: { "cities": [{"name": "...", "reason": "..."}] }
  `);
  console.log(data.cities);
}

// ============================================
// EXAMPLE 3: Generate Travel Plan
// ============================================
async function example3() {
  const plan = await simpleAI.generateTravelPlan('Tokyo', 3);
  console.log('Destination:', plan.destination);
  console.log('Highlights:', plan.highlights);
  console.log('Activities:', plan.activities);
}

// ============================================
// EXAMPLE 4: City Insights
// ============================================
async function example4() {
  const insights = await simpleAI.getCityInsights('Barcelona');
  console.log('Famous for:', insights.famousFor);
  console.log('Must try:', insights.mustTry);
  console.log('Best time:', insights.bestTime);
}

// ============================================
// EXAMPLE 5: Budget Prediction
// ============================================
async function example5() {
  const budget = await simpleAI.predictBudget('Bali', 7, 'moderate');
  console.log('Total cost:', budget.total);
  console.log('Breakdown:', {
    accommodation: budget.accommodation,
    food: budget.food,
    activities: budget.activities
  });
}

// ============================================
// EXAMPLE 6: Custom Travel Recommender
// ============================================
async function recommendDestinations(userPreferences) {
  const prompt = `
    User preferences: ${userPreferences}
    Recommend 3 destinations that match. Return JSON:
    {
      "recommendations": [
        {
          "destination": "city name",
          "country": "country",
          "matchScore": "percentage",
          "why": "reason it matches",
          "bestFor": "what it's best for",
          "estimatedBudget": "rough budget"
        }
      ]
    }
  `;
  
  return await simpleAI.askJSON(prompt);
}

// Usage:
// const recs = await recommendDestinations('beaches, adventure, under $2000');

// ============================================
// EXAMPLE 7: Smart Packing List
// ============================================
async function generatePackingList(destination, days, season) {
  const prompt = `
    Create a packing list for ${days} days in ${destination} during ${season}.
    Return JSON:
    {
      "essentials": ["item1", "item2"],
      "clothing": ["item1", "item2"],
      "electronics": ["item1", "item2"],
      "optional": ["item1", "item2"]
    }
  `;
  
  return await simpleAI.askJSON(prompt);
}

// ============================================
// EXAMPLE 8: Local Food Recommendations
// ============================================
async function findLocalFood(city, dietary = 'none') {
  const prompt = `
    Recommend 5 must-try local foods in ${city}.
    Dietary restrictions: ${dietary}
    Return JSON:
    {
      "foods": [
        {
          "name": "dish name",
          "description": "brief description",
          "whereToFind": "restaurant or area",
          "priceRange": "$-$$$"
        }
      ]
    }
  `;
  
  return await simpleAI.askJSON(prompt);
}

// ============================================
// EXAMPLE 9: Weather & Best Time to Visit
// ============================================
async function getBestTimeToVisit(destination) {
  const prompt = `
    When is the best time to visit ${destination}?
    Return JSON:
    {
      "bestMonths": ["month1", "month2"],
      "weather": "typical weather description",
      "avoid": "months to avoid and why",
      "events": ["special events during best time"]
    }
  `;
  
  return await simpleAI.askJSON(prompt);
}

// ============================================
// EXAMPLE 10: Safety & Travel Tips
// ============================================
async function getSafetyTips(destination) {
  const prompt = `
    Provide safety and travel tips for ${destination}.
    Return JSON:
    {
      "safetyRating": "1-10",
      "safetyTips": ["tip1", "tip2", "tip3"],
      "scamsToAvoid": ["scam1", "scam2"],
      "emergencyNumbers": {"police": "...", "ambulance": "..."},
      "culturalDos": ["do1", "do2"],
      "culturalDonts": ["dont1", "dont2"]
    }
  `;
  
  return await simpleAI.askJSON(prompt);
}

// ============================================
// EXAMPLE 11: Use in React Component
// ============================================
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function TravelRecommender() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const result = await simpleAI.askJSON(`
        Recommend 3 hidden gem destinations in Europe.
        Return JSON with name, description, and why it's special.
      `);
      setRecommendations(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={getRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </Button>
      {recommendations && (
        <div>
          {/* Display recommendations */}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 12: Error Handling
// ============================================
async function safeAICall() {
  try {
    const result = await simpleAI.ask('Your question here');
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error.message);
    return { 
      success: false, 
      error: error.message,
      fallback: 'Use default data or show error to user'
    };
  }
}

// ============================================
// EXAMPLE 13: Check Configuration
// ============================================
function checkAIStatus() {
  if (!simpleAI.isConfigured()) {
    console.error('AI not configured! Check your .env file');
    return false;
  }
  
  const status = simpleAI.getStatus();
  console.log('AI Status:', status);
  return true;
}

// ============================================
// READY TO USE!
// ============================================
// Copy any example above and use it in your app
// Visit http://localhost:5173/test-ai to test live
