import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Users, Plus, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

const TravelConstraints = ({ onConstraintsUpdate }) => {
  const [constraints, setConstraints] = useState({
    timeConstraints: {
      backToHotelBy: '22:00',
      startDayAfter: '08:00',
      maxHoursPerDay: 10
    },
    budgetConstraints: {
      maxPaidActivitiesPerDay: 2,
      maxMealBudgetPerDay: 1500
    },
    crowdConstraints: {
      avoidVeryCrowded: true,
      preferOffPeakHours: true
    },
    accessibilityConstraints: {
      wheelchairAccessible: false,
      maxWalkingDistance: 5
    },
    customConstraints: []
  });

  const [newConstraint, setNewConstraint] = useState('');

  const updateConstraint = (category, key, value) => {
    const updated = {
      ...constraints,
      [category]: {
        ...constraints[category],
        [key]: value
      }
    };
    setConstraints(updated);
    onConstraintsUpdate(updated);
    toast.success('Constraint updated');
  };

  const addCustomConstraint = () => {
    if (!newConstraint.trim()) return;
    
    const updated = {
      ...constraints,
      customConstraints: [...constraints.customConstraints, newConstraint]
    };
    setConstraints(updated);
    onConstraintsUpdate(updated);
    setNewConstraint('');
    toast.success('Custom constraint added');
  };

  const removeCustomConstraint = (index) => {
    const updated = {
      ...constraints,
      customConstraints: constraints.customConstraints.filter((_, i) => i !== index)
    };
    setConstraints(updated);
    onConstraintsUpdate(updated);
  };

  const countActiveConstraints = () => {
    let count = 0;
    if (constraints.timeConstraints.backToHotelBy !== '22:00') count++;
    if (constraints.timeConstraints.startDayAfter !== '08:00') count++;
    if (constraints.timeConstraints.maxHoursPerDay !== 10) count++;
    if (constraints.budgetConstraints.maxPaidActivitiesPerDay !== 2) count++;
    if (constraints.budgetConstraints.maxMealBudgetPerDay !== 1500) count++;
    if (constraints.crowdConstraints.avoidVeryCrowded) count++;
    if (constraints.crowdConstraints.preferOffPeakHours) count++;
    if (constraints.accessibilityConstraints.wheelchairAccessible) count++;
    if (constraints.accessibilityConstraints.maxWalkingDistance !== 5) count++;
    count += constraints.customConstraints.length;
    return count;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Travel Constraints
            <Badge variant="secondary" className="ml-auto">AI will respect these</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Constraints */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Time Constraints
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Back to hotel by
                </label>
                <Input
                  type="time"
                  value={constraints.timeConstraints.backToHotelBy}
                  onChange={(e) => updateConstraint('timeConstraints', 'backToHotelBy', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Start day after
                </label>
                <Input
                  type="time"
                  value={constraints.timeConstraints.startDayAfter}
                  onChange={(e) => updateConstraint('timeConstraints', 'startDayAfter', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Max hours of activities per day
              </label>
              <Input
                type="number"
                min="4"
                max="16"
                value={constraints.timeConstraints.maxHoursPerDay}
                onChange={(e) => updateConstraint('timeConstraints', 'maxHoursPerDay', parseInt(e.target.value))}
                className="text-sm"
              />
            </div>
          </div>

          {/* Budget Constraints */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              Budget Constraints
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Max paid activities/day
                </label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={constraints.budgetConstraints.maxPaidActivitiesPerDay}
                  onChange={(e) => updateConstraint('budgetConstraints', 'maxPaidActivitiesPerDay', parseInt(e.target.value))}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Max meal budget/day (₹)
                </label>
                <Input
                  type="number"
                  step="100"
                  value={constraints.budgetConstraints.maxMealBudgetPerDay}
                  onChange={(e) => updateConstraint('budgetConstraints', 'maxMealBudgetPerDay', parseInt(e.target.value))}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Crowd Constraints */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Crowd Preferences
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Avoid very crowded places
                </label>
                <Switch
                  checked={constraints.crowdConstraints.avoidVeryCrowded}
                  onCheckedChange={(checked) => updateConstraint('crowdConstraints', 'avoidVeryCrowded', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Prefer off-peak hours
                </label>
                <Switch
                  checked={constraints.crowdConstraints.preferOffPeakHours}
                  onCheckedChange={(checked) => updateConstraint('crowdConstraints', 'preferOffPeakHours', checked)}
                />
              </div>
            </div>
          </div>

          {/* Accessibility Constraints */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              Accessibility Needs
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Wheelchair accessible only
                </label>
                <Switch
                  checked={constraints.accessibilityConstraints.wheelchairAccessible}
                  onCheckedChange={(checked) => updateConstraint('accessibilityConstraints', 'wheelchairAccessible', checked)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Max walking distance/day (km)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={constraints.accessibilityConstraints.maxWalkingDistance}
                  onChange={(e) => updateConstraint('accessibilityConstraints', 'maxWalkingDistance', parseInt(e.target.value))}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Custom Constraints */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Custom Constraints
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Must visit at least 1 temple per day"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomConstraint()}
                className="text-sm"
              />
              <Button size="sm" onClick={addCustomConstraint}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {constraints.customConstraints.length > 0 && (
              <div className="space-y-2">
                {constraints.customConstraints.map((constraint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{constraint}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomConstraint(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Constraints Summary */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-1">
                Active Constraints: {countActiveConstraints()}
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                AI will generate your itinerary respecting all constraints. You can modify these anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelConstraints;
