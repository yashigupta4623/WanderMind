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
  const [selectedBudgetType, setSelectedBudgetType] = useState(null);

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
    const isSelected = selectedBudgetType === type;

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

    const handleCardClick = () => {
      setSelectedBudgetType(type);
      if (onBudgetSelect) {
        onBudgetSelect(type, amount);
      }
    };

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
          isSelected 
            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
            : isRecommended 
              ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`} 
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-lg ${
                isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {getBudgetTitle(type)}
              </CardTitle>
              <p className={`text-xs mt-1 ${
                isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {getBudgetDescription(type)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              {isSelected && (
                <Badge variant="default" className="bg-blue-600 text-white">
                  Selected
                </Badge>
              )}
              {isRecommended && !isSelected && (
                <Badge variant="outline" className="border-orange-400 text-orange-600 bg-orange-100 dark:bg-orange-900/30">
                  Recommended
                </Badge>
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {formatCurrency(amount)}
          </div>
          <p className={`text-xs ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            ₹{Math.round(amount / parseInt(days) / (parseInt(travelers?.match(/\d+/)?.[0]) || 1)).toLocaleString()} per person per day
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between ${
              isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <span>🏨 Accommodation</span>
              <span className="font-medium">{formatCurrency(breakdown.accommodation)}</span>
            </div>
            <div className={`flex justify-between ${
              isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <span>🍽️ Food</span>
              <span className="font-medium">{formatCurrency(breakdown.food)}</span>
            </div>
            <div className={`flex justify-between ${
              isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <span>🎯 Activities</span>
              <span className="font-medium">{formatCurrency(breakdown.activities)}</span>
            </div>
            <div className={`flex justify-between ${
              isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <span>🚗 Transport</span>
              <span className="font-medium">{formatCurrency(breakdown.transport)}</span>
            </div>
            <div className={`flex justify-between ${
              isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              <span>💼 Miscellaneous</span>
              <span className="font-medium">{formatCurrency(breakdown.miscellaneous)}</span>
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
        <>
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
          
          {/* Quick Budget Selection */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Quick Budget Selection:</h4>
              <div className="flex flex-wrap gap-2">
                {[15000, 25000, 50000, 75000, 100000, 150000].map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedBudgetType === 'quick' && customBudget == amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCustomBudget(amount.toString());
                      setSelectedBudgetType('quick');
                      onBudgetSelect && onBudgetSelect('custom', amount);
                    }}
                    className="text-xs"
                  >
                    ₹{amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Custom Budget
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set your own budget amount for personalized planning
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Enter your budget (min ₹1,000)"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="pl-10 text-lg font-medium"
                min="1000"
                step="1000"
              />
            </div>
            <Button
              onClick={() => {
                setSelectedBudgetType('custom');
                onBudgetSelect && onBudgetSelect('custom', parseInt(customBudget));
              }}
              disabled={!customBudget || parseInt(customBudget) < 1000}
              className="px-6"
            >
              Use This Budget
            </Button>
          </div>
          {customBudget && parseInt(customBudget) >= 1000 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3 text-green-800 dark:text-green-200">Budget Breakdown:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(getBudgetBreakdown(parseInt(customBudget))).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{key}:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                <div className="flex justify-between font-bold text-green-800 dark:text-green-200">
                  <span>Per Person Per Day:</span>
                  <span>₹{Math.round(parseInt(customBudget) / parseInt(days) / (parseInt(travelers?.match(/\d+/)?.[0]) || 1)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPredictor;