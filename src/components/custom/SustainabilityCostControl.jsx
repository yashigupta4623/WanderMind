import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Leaf, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Plane,
  Train,
  Bus,
  Lock,
  Unlock,
  Calculator,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';

const SustainabilityCostControl = ({ tripData, onBudgetUpdate }) => {
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [budgetLocked, setBudgetLocked] = useState(false);
  const [showGreenerAlternative, setShowGreenerAlternative] = useState(false);
  const [splitCount, setSplitCount] = useState(1);

  useEffect(() => {
    calculateCarbonFootprint();
    calculateCostBreakdown();
  }, [tripData]);

  const calculateCarbonFootprint = () => {
    const transport = tripData?.userSelection?.transport || 'flight';
    const distance = estimateDistance(tripData?.userSelection?.location?.label);
    
    const emissionFactors = {
      flight: 0.255,
      train: 0.041,
      bus: 0.089,
      car: 0.171
    };

    const co2kg = distance * (emissionFactors[transport] || emissionFactors.flight);
    
    const alternatives = Object.keys(emissionFactors)
      .filter(t => t !== transport)
      .map(t => ({
        type: t,
        co2kg: distance * emissionFactors[t],
        savings: co2kg - (distance * emissionFactors[t]),
        savingsPercent: ((co2kg - (distance * emissionFactors[t])) / co2kg * 100).toFixed(0)
      }))
      .sort((a, b) => a.co2kg - b.co2kg);

    setCarbonFootprint({
      current: {
        type: transport,
        co2kg: co2kg.toFixed(1),
        trees: (co2kg / 21).toFixed(1)
      },
      alternatives: alternatives.slice(0, 2)
    });
  };

  const estimateDistance = (destination) => {
    const distances = {
      'Delhi': 0,
      'Mumbai': 1400,
      'Bangalore': 2150,
      'Kolkata': 1500,
      'Chennai': 2180,
      'Hyderabad': 1580,
      'Pune': 1450,
      'Jaipur': 280,
      'Goa': 1870,
      'Kerala': 2700,
      'Agra': 230,
      'Udaipur': 660
    };

    const dest = destination?.split(',')[0]?.trim();
    return distances[dest] || 1000;
  };

  const calculateCostBreakdown = () => {
    const days = parseInt(tripData?.userSelection?.noofDays) || 3;
    const travelers = tripData?.userSelection?.traveler || '1 Person';
    const numTravelers = parseInt(travelers.match(/\d+/)?.[0]) || 1;
    const budgetAmount = tripData?.userSelection?.budgetAmount || 25000;

    const breakdown = {
      total: budgetAmount,
      perPerson: Math.round(budgetAmount / numTravelers),
      perDay: Math.round(budgetAmount / days),
      perPersonPerDay: Math.round(budgetAmount / numTravelers / days),
      categories: {
        accommodation: Math.round(budgetAmount * 0.35),
        food: Math.round(budgetAmount * 0.25),
        transport: Math.round(budgetAmount * 0.20),
        activities: Math.round(budgetAmount * 0.15),
        miscellaneous: Math.round(budgetAmount * 0.05)
      },
      travelers: numTravelers,
      days: days
    };

    setCostBreakdown(breakdown);
    setSplitCount(numTravelers);
  };

  const handleBudgetLockToggle = () => {
    setBudgetLocked(!budgetLocked);
    if (!budgetLocked) {
      toast.success('Budget locked! 🔒 Any changes will require approval');
    } else {
      toast.info('Budget unlocked 🔓');
    }
  };

  const requestBudgetChange = (newAmount, reason) => {
    if (budgetLocked) {
      toast.error(
        <div>
          <p className="font-semibold">Budget Locked!</p>
          <p className="text-sm">New suggestion: ₹{newAmount.toLocaleString()}</p>
          <p className="text-sm">Reason: {reason}</p>
          <p className="text-xs mt-2">Unlock budget to accept changes</p>
        </div>,
        { duration: 5000 }
      );
      return false;
    }
    return true;
  };

  const switchToGreenerOption = (alternative) => {
    const currentBudget = costBreakdown?.total || 25000;
    const transportCost = costBreakdown?.categories?.transport || 5000;
    
    let newTransportCost = transportCost;
    if (alternative.type === 'train') {
      newTransportCost = transportCost * 0.6;
    } else if (alternative.type === 'bus') {
      newTransportCost = transportCost * 0.4;
    }

    const newTotal = currentBudget - transportCost + newTransportCost;
    const savings = currentBudget - newTotal;

    if (budgetLocked && newTotal > currentBudget) {
      requestBudgetChange(newTotal, `Switching to ${alternative.type} for sustainability`);
      return;
    }

    toast.success(
      <div>
        <p className="font-semibold">Switched to {alternative.type}! 🌱</p>
        <p className="text-sm">CO₂ saved: {alternative.savings.toFixed(1)} kg</p>
        <p className="text-sm">Money saved: ₹{savings.toFixed(0)}</p>
      </div>,
      { duration: 4000 }
    );

    if (onBudgetUpdate) {
      onBudgetUpdate({ transport: alternative.type, budget: newTotal });
    }
  };

  const getTransportIcon = (type) => {
    switch(type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      default: return <Plane className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Sustainability & Cost Transparency
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              Eco-Friendly
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your carbon footprint and manage costs transparently
          </p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carbonFootprint && (
              <>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTransportIcon(carbonFootprint.current.type)}
                      <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {carbonFootprint.current.type}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      Current
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {carbonFootprint.current.co2kg} kg CO₂
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ≈ {carbonFootprint.current.trees} trees needed to offset
                  </div>
                </div>

                {carbonFootprint.alternatives.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Greener Alternatives
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGreenerAlternative(!showGreenerAlternative)}
                        className="text-xs"
                      >
                        {showGreenerAlternative ? 'Hide' : 'Show'}
                      </Button>
                    </div>

                    {showGreenerAlternative && carbonFootprint.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTransportIcon(alt.type)}
                            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {alt.type}
                            </span>
                          </div>
                          <Badge className="bg-green-600 text-white text-xs">
                            -{alt.savingsPercent}% CO₂
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {alt.co2kg.toFixed(1)} kg CO₂
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Saves {alt.savings.toFixed(1)} kg CO₂
                        </div>
                        <Button
                          size="sm"
                          onClick={() => switchToGreenerOption(alt)}
                          className="w-full mt-2 bg-green-600 hover:bg-green-700"
                        >
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Switch to {alt.type}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Choosing train or bus can reduce your carbon footprint by up to 80%!
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {costBreakdown && (
              <>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{costBreakdown.total.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {costBreakdown.travelers} traveler{costBreakdown.travelers > 1 ? 's' : ''} • {costBreakdown.days} days
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Per Person Cost
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ₹{costBreakdown.perPerson.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Per Day</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ₹{costBreakdown.perPersonPerDay.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Category Breakdown
                  </h4>
                  {Object.entries(costBreakdown.categories).map(([category, amount]) => {
                    const percentage = ((amount / costBreakdown.total) * 100).toFixed(0);
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{category}</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            ₹{amount.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Bill Split Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {costBreakdown && (
            <>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Split between:</label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-bold">{splitCount}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSplitCount(splitCount + 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">people</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Per Person</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{Math.round(costBreakdown.total / splitCount).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Per Person/Day</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{Math.round(costBreakdown.total / splitCount / costBreakdown.days).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-xs text-purple-800 dark:text-purple-200">
                  💡 Each person pays ₹{Math.round(costBreakdown.total / splitCount).toLocaleString()} for the entire trip
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {budgetLocked ? <Lock className="w-5 h-5 text-red-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
            Budget Lock Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Lock Budget
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Prevent changes without approval
              </div>
            </div>
            <Switch
              checked={budgetLocked}
              onCheckedChange={handleBudgetLockToggle}
            />
          </div>

          {budgetLocked ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-semibold mb-1">Budget Locked 🔒</p>
                  <p className="text-xs">
                    Any suggestions that exceed the current budget will require your approval. 
                    The system will show justification before making changes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <Unlock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-1">Budget Unlocked 🔓</p>
                  <p className="text-xs">
                    The system can make budget adjustments automatically to improve your trip.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>How it works:</strong> When locked, any AI suggestion that increases costs will show:
              <br />• New amount
              <br />• Reason for change
              <br />• Request for approval
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-800 dark:text-gray-200">
              <p className="font-semibold mb-2">Transparency Features Active:</p>
              <ul className="space-y-1 text-xs">
                <li>✅ Carbon footprint calculated for all transport options</li>
                <li>✅ Greener alternatives suggested with CO₂ savings</li>
                <li>✅ Complete cost breakdown by category</li>
                <li>✅ Per-person and per-day costs calculated</li>
                <li>✅ Bill split calculator for group trips</li>
                <li>✅ Budget lock prevents unauthorized changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityCostControl;
