import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, MapPin, IndianRupee, Clock, Navigation, Sparkles } from 'lucide-react';
import { aiCopilot } from '@/service/AICopilotService';
import { toast } from 'sonner';

const LastMinuteQuickPlan = ({ onPlanGenerated }) => {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickPlan, setQuickPlan] = useState(null);

  const handleGenerateQuickPlan = async () => {
    if (!location || !budget) {
      toast.error('Please enter location and budget');
      return;
    }

    if (parseInt(budget) < 500) {
      toast.error('Minimum budget is ₹500');
      return;
    }

    setLoading(true);
    toast.loading('AI Copilot creating your quick plan...');

    try {
      const plan = await aiCopilot.generateQuickPlan(location, parseInt(budget));
      setQuickPlan(plan);
      
      toast.dismiss();
      toast.success('Quick plan ready! 🚀');
      
      if (onPlanGenerated) {
        onPlanGenerated(plan);
      }
    } catch (error) {
      console.error('Quick plan error:', error);
      toast.dismiss();
      toast.error('Failed to generate quick plan');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBudget = (amount) => {
    setBudget(amount.toString());
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Last-Minute Quick Plan
            <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-800">
              INSTANT
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Just landed? Get a hyper-compressed plan in seconds!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Where are you right now?
              </label>
              <Input
                placeholder="e.g., Jaipur, Mumbai, Goa..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-base"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4" />
                Quick budget (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g., 2000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="text-base"
                min="500"
              />
              <div className="flex gap-2 mt-2">
                {[1000, 2000, 3000, 5000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickBudget(amount)}
                    className="text-xs"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateQuickPlan}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Creating Quick Plan...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Instant Plan
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Plan generated in under 10 seconds • 2-3 key spots only</span>
          </div>
        </CardContent>
      </Card>

      {quickPlan && (
        <Card className="border-2 border-green-300 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Navigation className="w-5 h-5" />
              Your Quick Plan Ready!
              <Badge variant="secondary" className="ml-auto">
                {quickPlan.totalTime}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Cost</div>
                <div className="text-xl font-bold text-green-600">{quickPlan.totalCost}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Duration</div>
                <div className="text-xl font-bold text-blue-600">{quickPlan.totalTime}</div>
              </div>
            </div>

            <div className="space-y-3">
              {quickPlan.quickPlan.map((spot, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {spot.time}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        🚗 {spot.travel}
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30">
                      {spot.cost}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {index + 1}. {spot.spot}
                  </h4>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 {spot.why}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-200 mb-1">
                    Pro Tips:
                  </h5>
                  <ul className="text-xs text-purple-800 dark:text-purple-300 space-y-1">
                    <li>• All spots are within 15 mins of each other</li>
                    <li>• Book transport in advance to save time</li>
                    <li>• Keep ₹{Math.floor(parseInt(budget) * 0.2)} extra for emergencies</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setQuickPlan(null);
                setLocation('');
                setBudget('');
              }}
            >
              Create Another Quick Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LastMinuteQuickPlan;
