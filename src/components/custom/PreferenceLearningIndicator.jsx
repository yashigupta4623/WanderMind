import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { preferenceLearning } from '@/service/PreferenceLearningService';
import { toast } from 'sonner';

const PreferenceLearningIndicator = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadInsights = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const data = await preferenceLearning.getLearnedPreferences(userId);
    setInsights(data?.insights);
    setLoading(false);
  };

  const createDemoData = async () => {
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    toast.loading('Creating demo preferences...');
    await preferenceLearning.createDemoPreferences(userId);
    await loadInsights();
    toast.dismiss();
    toast.success('Demo preferences created! AI will now personalize your trips.');
  };

  if (loading) {
    return (
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.totalInteractions === 0) {
    return (
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <Brain className="w-5 h-5" />
            AI Learning Your Preferences
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              As you create trips and interact with recommendations, our AI learns your preferences automatically.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Future trips will be personalized based on your choices</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={createDemoData}
              className="w-full mt-2"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Create Demo Preferences (For Testing)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFoodTypeLabel = (type) => {
    const labels = {
      streetFood: 'Street Food & Local Eateries',
      fancyRestaurants: 'Fine Dining',
      localCuisine: 'Authentic Local Cuisine',
      cafes: 'Cafes & Casual Dining'
    };
    return labels[type] || type;
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Brain className="w-5 h-5" />
          AI Learned Your Preferences
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <Badge variant="secondary" className="ml-auto">
            {insights.totalInteractions} interactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Based on your past trips:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {insights.preferredFoodType && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                🍽️ {getFoodTypeLabel(insights.preferredFoodType)}
              </Badge>
            )}
            
            {insights.preferredActivities?.map(activity => (
              <Badge key={activity} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                🎯 {activity.charAt(0).toUpperCase() + activity.slice(1)}
              </Badge>
            ))}
            
            {insights.avoidsCrowds && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                🌿 Prefers less crowded
              </Badge>
            )}
            
            {insights.preferredTiming && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                ⏰ {insights.preferredTiming.charAt(0).toUpperCase() + insights.preferredTiming.slice(1)} person
              </Badge>
            )}

            {insights.preferredAccommodation && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200">
                🏨 {insights.preferredAccommodation.charAt(0).toUpperCase() + insights.preferredAccommodation.slice(1)} hotels
              </Badge>
            )}
          </div>

          <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Smart Personalization:</strong> Your next trip will automatically include more {insights.preferredFoodType && getFoodTypeLabel(insights.preferredFoodType).toLowerCase()}, 
                {insights.preferredActivities?.length > 0 && ` ${insights.preferredActivities[0]} activities,`}
                {insights.avoidsCrowds && ' less crowded places,'}
                {insights.preferredTiming && ` and ${insights.preferredTiming} timings`}.
              </span>
            </p>
          </div>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={async () => {
              toast.loading('Refreshing preferences...');
              await preferenceLearning.createDemoPreferences(userId);
              await loadInsights();
              toast.dismiss();
              toast.success('Preferences updated! AI learned new patterns.');
            }}
            className="w-full text-xs !bg-blue-50 dark:!bg-gray-700 !text-blue-700 dark:!text-gray-100 hover:!bg-blue-100 dark:hover:!bg-gray-600"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Refresh Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferenceLearningIndicator;
