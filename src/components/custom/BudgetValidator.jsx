import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, Calendar, MapPin } from 'lucide-react';

const BudgetValidator = ({ destination, days, travelers, budget, onSuggestionAccept }) => {
  const [validation, setValidation] = useState(null);
  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    if (destination && days && travelers && budget) {
      validateBudget();
    }
  }, [destination, days, travelers, budget]);

  const validateBudget = () => {
    const travelerCount = parseInt(travelers?.match(/\d+/)?.[0]) || 1;
    const totalDays = parseInt(days) || 1;
    const budgetAmount = parseInt(budget) || 0;

    const minimumBudgets = {
      'goa': 3000,
      'mumbai': 3500,
      'delhi': 3000,
      'jaipur': 2500,
      'kerala': 3200,
      'manali': 3500,
      'udaipur': 3000,
      'agra': 2500,
      'bangalore': 3200,
      'hyderabad': 2800,
      'pune': 2800,
      'kolkata': 2600,
      'chennai': 2800,
      'default': 3000
    };

    const destKey = destination.toLowerCase();
    const minPerDay = Object.keys(minimumBudgets).find(key => 
      destKey.includes(key)
    ) ? minimumBudgets[Object.keys(minimumBudgets).find(key => destKey.includes(key))] 
      : minimumBudgets.default;

    const minimumRequired = minPerDay * travelerCount * totalDays;
    const isValid = budgetAmount >= minimumRequired;

    if (!isValid) {
      const alts = [
        {
          type: 'shorter',
          title: 'Shorter Trip',
          description: `Try ${Math.floor(budgetAmount / (minPerDay * travelerCount))} days instead`,
          savings: minimumRequired - budgetAmount,
          icon: Calendar,
          action: () => onSuggestionAccept?.({ 
            type: 'days', 
            value: Math.floor(budgetAmount / (minPerDay * travelerCount)) 
          })
        },
        {
          type: 'cheaper',
          title: 'Budget-Friendly Destination',
          description: 'Consider Pondicherry, Rishikesh, or Hampi',
          savings: Math.round((minimumRequired - budgetAmount) * 0.6),
          icon: MapPin,
          action: () => onSuggestionAccept?.({ type: 'destination', value: 'alternative' })
        },
        {
          type: 'increase',
          title: 'Increase Budget',
          description: `Add ₹${(minimumRequired - budgetAmount).toLocaleString()} for comfortable trip`,
          savings: 0,
          icon: TrendingDown,
          action: () => onSuggestionAccept?.({ type: 'budget', value: minimumRequired })
        }
      ];
      setAlternatives(alts);
    }

    setValidation({
      isValid,
      minimumRequired,
      currentBudget: budgetAmount,
      shortfall: minimumRequired - budgetAmount
    });
  };

  if (!validation) return null;

  if (validation.isValid) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                Budget Looks Good!
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your budget of ₹{validation.currentBudget.toLocaleString()} is sufficient for this trip
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-300 bg-orange-50 dark:bg-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="w-5 h-5" />
          Budget Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>{destination}</strong> typically needs a minimum of{' '}
            <strong className="text-orange-600">₹{validation.minimumRequired.toLocaleString()}</strong>{' '}
            for {days} days with {travelers}.
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Your current budget: ₹{validation.currentBudget.toLocaleString()}{' '}
            (₹{validation.shortfall.toLocaleString()} short)
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
            💡 Smart Alternatives:
          </h4>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                onClick={alt.action}
              >
                <div className="flex items-start gap-3 text-left">
                  <alt.icon className="w-5 h-5 mt-1 text-orange-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {alt.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {alt.description}
                    </div>
                    {alt.savings > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Save ₹{alt.savings.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetValidator;
