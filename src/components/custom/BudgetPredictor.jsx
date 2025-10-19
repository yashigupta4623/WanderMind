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
      predictBudget();
    }
  }, [destination, days, travelers]);

  const predictBudget = async () => {
    setIsLoading(true);
    try {
      const prompt = BUDGET_PREDICTOR_PROMPT
        .replace('{destination}', destination)
        .replace('{days}', days)
        .replace('{travelers}', travelers);

      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();
      
      // Parse the AI response for budget ranges
      const budgetData = parseBudgetResponse(response);
      setBudgetPrediction(budgetData);
    } catch (error) {
      console.error('Budget prediction error:', error);
      toast.error('Failed to predict budget. Using default estimates.');
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
    const basePerDay = {
      budget: 2000,
      moderate: 4000,
      luxury: 8000
    };

    const multiplier = parseInt(travelers) || 1;
    const totalDays = parseInt(days) || 1;

    return {
      budget: basePerDay.budget * totalDays * multiplier,
      moderate: basePerDay.moderate * totalDays * multiplier,
      luxury: basePerDay.luxury * totalDays * multiplier
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetBreakdown = (totalBudget) => {
    return {
      accommodation: Math.round(totalBudget * 0.4),
      food: Math.round(totalBudget * 0.25),
      activities: Math.round(totalBudget * 0.2),
      transport: Math.round(totalBudget * 0.1),
      miscellaneous: Math.round(totalBudget * 0.05)
    };
  };

  const BudgetCard = ({ type, amount, isRecommended = false }) => {
    const breakdown = getBudgetBreakdown(amount);
    
    return (
      <Card className={`cursor-pointer transition-all hover:shadow-lg ${
        isRecommended ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`} onClick={() => onBudgetSelect && onBudgetSelect(type, amount)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg capitalize">{type}</CardTitle>
            {isRecommended && <Badge variant="default">Recommended</Badge>}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(amount)}
          </div>
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