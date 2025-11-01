import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, IndianRupee, Users, Calendar } from 'lucide-react';
import { chatSession } from '@/service/AIModel';
import { BUDGET_PREDICTOR_PROMPT } from '@/constants/options';
import { toast } from 'sonner';

const BudgetPredictor = ({ destination, days, travelers, onBudgetSelect }) => {
  const [budgetPrediction, setBudgetPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customBudget, setCustomBudget] = useState('');

  useEffect(() => {
    if (destination && days && travelers) {
      // IMMEDIATE TEST: Set hardcoded realistic values first
      const testBudget = {
        budget: 25000,   // ₹25,000 for 2 people, 5 days budget
        moderate: 60000, // ₹60,000 for 2 people, 5 days moderate  
        luxury: 140000   // ₹1,40,000 for 2 people, 5 days luxury
      };

      console.log('Setting test budget first:', testBudget);
      setBudgetPrediction(testBudget);

      // Then calculate the real budget
      setTimeout(() => {
        const defaultBudget = getDefaultBudgetEstimate();
        console.log('Budget Calculation Debug:', {
          destination,
          days,
          travelers,
          calculatedBudget: defaultBudget
        });
        setBudgetPrediction(defaultBudget);
        predictBudget();
      }, 100);
    }
  }, [destination, days, travelers]);

  const predictBudget = async () => {
    setIsLoading(true);
    try {
      // ALWAYS use default realistic budget - don't trust AI parsing for now
      const defaultBudget = getDefaultBudgetEstimate();
      console.log('Using default realistic budget:', defaultBudget);
      setBudgetPrediction(defaultBudget);

      // Optional: Try AI but don't use the result if it's unrealistic
      // const prompt = BUDGET_PREDICTOR_PROMPT
      //   .replace('{destination}', destination)
      //   .replace('{days}', days)
      //   .replace('{travelers}', travelers);
      // const result = await chatSession.sendMessage(prompt);
      // const response = result?.response?.text();
      // console.log('AI Response (not used):', response);

    } catch (error) {
      console.error('Budget prediction error:', error);
      setBudgetPrediction(getDefaultBudgetEstimate());
    } finally {
      setIsLoading(false);
    }
  };

  const parseBudgetResponse = (response) => {
    // Default budget structure if AI parsing fails
    const defaultBudget = getDefaultBudgetEstimate();

    try {
      // Try to extract budget information from AI response
      const budgetMatch = response.match(/budget|cost|price|₹|INR/gi);
      if (budgetMatch) {
        // Extract numbers and create budget ranges
        const numbers = response.match(/₹?[\d,]+/g) || [];
        if (numbers.length >= 3) {
          return {
            budget: parseInt(numbers[0].replace(/[₹,]/g, '')),
            moderate: parseInt(numbers[1].replace(/[₹,]/g, '')),
            luxury: parseInt(numbers[2].replace(/[₹,]/g, ''))
          };
        }
      }
      return defaultBudget;
    } catch (error) {
      return defaultBudget;
    }
  };

  const getDefaultBudgetEstimate = () => {
    // Extract number from travelers string (e.g., "2 People" -> 2, "Solo Traveler" -> 1)
    let travelerCount = 1;
    if (travelers) {
      const match = travelers.match(/\d+/);
      if (match) {
        travelerCount = parseInt(match[0]);
      } else if (travelers.toLowerCase().includes('solo')) {
        travelerCount = 1;
      } else if (travelers.toLowerCase().includes('couple')) {
        travelerCount = 2;
      } else if (travelers.toLowerCase().includes('family')) {
        travelerCount = 4;
      } else if (travelers.toLowerCase().includes('friends')) {
        travelerCount = 6;
      }
    }

    const totalDays = parseInt(days) || 1;

    // Realistic Indian travel costs per person per day (in INR)
    const costPerPersonPerDay = {
      budget: {
        accommodation: 800,   // Budget hotels/hostels
        food: 600,           // Local food, street food
        transport: 400,      // Local transport, buses
        activities: 500,     // Basic sightseeing
        miscellaneous: 200   // Shopping, tips, etc.
      },
      moderate: {
        accommodation: 2500,  // 3-star hotels
        food: 1200,          // Mix of local and restaurants
        transport: 800,      // Taxis, trains
        activities: 1000,    // Paid attractions, tours
        miscellaneous: 500   // Shopping, souvenirs
      },
      luxury: {
        accommodation: 6000,  // 4-5 star hotels
        food: 2500,          // Fine dining, room service
        transport: 2000,     // Private cars, flights
        activities: 2500,    // Premium experiences
        miscellaneous: 1000  // Luxury shopping
      }
    };

    // Calculate total per category
    const calculateTotal = (category) => {
      const dailyCost = Object.values(costPerPersonPerDay[category]).reduce((sum, cost) => sum + cost, 0);
      const total = dailyCost * travelerCount * totalDays;
      console.log(`${category} calculation:`, {
        dailyCost,
        travelerCount,
        totalDays,
        total
      });
      return total;
    };

    const result = {
      budget: calculateTotal('budget'),
      moderate: calculateTotal('moderate'),
      luxury: calculateTotal('luxury')
    };

    console.log('Final budget calculation:', {
      travelers,
      days,
      travelerCount,
      totalDays,
      result
    });

    return result;
  };

  const formatCurrency = (amount) => {
    // Handle NaN or invalid amounts
    if (!amount || isNaN(amount)) {
      return '₹0';
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetBreakdown = (totalBudget) => {
    // Handle invalid budget amounts
    const budget = parseInt(totalBudget) || 0;

    // More realistic Indian travel budget breakdown
    return {
      accommodation: Math.round(budget * 0.35),  // 35% - Hotels/stays
      food: Math.round(budget * 0.25),          // 25% - Meals and dining
      activities: Math.round(budget * 0.20),    // 20% - Sightseeing, tours
      transport: Math.round(budget * 0.15),     // 15% - Local and intercity transport
      miscellaneous: Math.round(budget * 0.05)  // 5% - Shopping, tips, emergency
    };
  };

  const BudgetCard = ({ type, amount, isRecommended = false }) => {
    const breakdown = getBudgetBreakdown(amount);

    const getBudgetTitle = (type) => {
      switch (type) {
        case 'budget': return 'Budget Travel';
        case 'moderate': return 'Comfortable';
        case 'luxury': return 'Luxury';
        default: return type;
      }
    };

    const getBudgetDescription = (type) => {
      switch (type) {
        case 'budget': return 'Hostels, local food, public transport';
        case 'moderate': return '3-star hotels, mix dining, private transport';
        case 'luxury': return '4-5 star hotels, fine dining, premium experiences';
        default: return '';
      }
    };

    return (
      <Card className={`cursor-pointer transition-all hover:shadow-lg ${isRecommended ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`} onClick={() => onBudgetSelect && onBudgetSelect(type, amount)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{getBudgetTitle(type)}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">{getBudgetDescription(type)}</p>
            </div>
            {isRecommended && <Badge variant="default">Recommended</Badge>}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(amount)}
          </div>
          <p className="text-xs text-gray-500">
            ₹{Math.round(amount / parseInt(days) / (parseInt(travelers?.match(/\d+/)?.[0]) || 1)).toLocaleString()} per person per day
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>🏨 Accommodation</span>
              <span>{formatCurrency(breakdown.accommodation)}</span>
            </div>
            <div className="flex justify-between">
              <span>🍽️ Food</span>
              <span>{formatCurrency(breakdown.food)}</span>
            </div>
            <div className="flex justify-between">
              <span>🎯 Activities</span>
              <span>{formatCurrency(breakdown.activities)}</span>
            </div>
            <div className="flex justify-between">
              <span>🚗 Transport</span>
              <span>{formatCurrency(breakdown.transport)}</span>
            </div>
            <div className="flex justify-between">
              <span>💼 Miscellaneous</span>
              <span>{formatCurrency(breakdown.miscellaneous)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 animate-spin" />
            <span>Calculating optimal budget...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Budget Predictor
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {travelers} travelers
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {days} days
            </div>
          </div>
        </CardHeader>
      </Card>

      {budgetPrediction && (
        <div className="grid md:grid-cols-3 gap-4">
          <BudgetCard
            type="budget"
            amount={budgetPrediction.budget}
          />
          <BudgetCard
            type="moderate"
            amount={budgetPrediction.moderate}
            isRecommended={true}
          />
          <BudgetCard
            type="luxury"
            amount={budgetPrediction.luxury}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Enter your budget"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => onBudgetSelect && onBudgetSelect('custom', parseInt(customBudget))}
              disabled={!customBudget || parseInt(customBudget) < 1000}
            >
              Use This Budget
            </Button>
          </div>
          {customBudget && parseInt(customBudget) >= 1000 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Budget Breakdown:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(getBudgetBreakdown(parseInt(customBudget))).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPredictor;