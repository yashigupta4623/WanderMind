import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const WeatherAdaptive = ({ destination, itinerary, onItineraryUpdate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (destination) {
      fetchWeatherData();
    }
  }, [destination]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you'd use a weather API like OpenWeatherMap
      // For demo purposes, we'll simulate weather data
      const mockWeatherData = generateMockWeatherData();
      setWeatherData(mockWeatherData);
      
      // Analyze weather and generate alerts/recommendations
      analyzeWeatherImpact(mockWeatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast.error('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockWeatherData = () => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'stormy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      current: {
        condition: randomCondition,
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        visibility: Math.floor(Math.random() * 5) + 5 // 5-10 km
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        high: Math.floor(Math.random() * 15) + 20,
        low: Math.floor(Math.random() * 10) + 10,
        precipitation: Math.floor(Math.random() * 80)
      }))
    };
  };

  const analyzeWeatherImpact = (weather) => {
    const alerts = [];
    const recommendations = [];

    // Check current weather conditions
    if (weather.current.condition === 'rainy' || weather.current.condition === 'stormy') {
      alerts.push({
        type: 'warning',
        title: 'Weather Alert',
        message: 'Rain expected today. Outdoor activities may be affected.',
        severity: 'medium'
      });

      recommendations.push({
        type: 'alternative',
        title: 'Indoor Alternatives',
        suggestions: [
          'Visit museums and cultural centers',
          'Explore covered markets and shopping areas',
          'Try local cooking classes',
          'Visit indoor entertainment venues'
        ]
      });
    }

    if (weather.current.temperature > 35) {
      alerts.push({
        type: 'heat',
        title: 'High Temperature Alert',
        message: 'Very hot weather expected. Stay hydrated and avoid midday sun.',
        severity: 'high'
      });

      recommendations.push({
        type: 'timing',
        title: 'Optimal Activity Times',
        suggestions: [
          'Plan outdoor activities for early morning (6-9 AM)',
          'Take afternoon breaks in air-conditioned spaces',
          'Schedule evening activities after 6 PM',
          'Carry extra water and sun protection'
        ]
      });
    }

    // Check forecast for upcoming days
    const rainyDays = weather.forecast.filter(day => 
      day.condition === 'rainy' || day.precipitation > 60
    );

    if (rainyDays.length > 2) {
      recommendations.push({
        type: 'planning',
        title: 'Multi-Day Weather Planning',
        suggestions: [
          'Reschedule outdoor activities to clearer days',
          'Book indoor attractions in advance',
          'Consider flexible accommodation with good amenities',
          'Pack appropriate rain gear'
        ]
      });
    }

    setWeatherAlerts(alerts);
    setAdaptiveRecommendations(recommendations);
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: <Sun className="w-6 h-6 text-yellow-500" />,
      cloudy: <Cloud className="w-6 h-6 text-gray-500" />,
      rainy: <CloudRain className="w-6 h-6 text-blue-500" />,
      stormy: <CloudRain className="w-6 h-6 text-purple-500" />
    };
    return icons[condition] || <Cloud className="w-6 h-6 text-gray-500" />;
  };

  const getConditionColor = (condition) => {
    const colors = {
      sunny: 'bg-yellow-100 text-yellow-800',
      cloudy: 'bg-gray-100 text-gray-800',
      rainy: 'bg-blue-100 text-blue-800',
      stormy: 'bg-purple-100 text-purple-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const applyRecommendation = (recommendation) => {
    // In a real implementation, this would modify the itinerary
    toast.success('Recommendation applied to your itinerary!');
    if (onItineraryUpdate) {
      onItineraryUpdate({
        type: 'weather_adaptation',
        recommendation: recommendation
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Checking weather conditions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {weatherData && getWeatherIcon(weatherData.current.condition)}
            Weather-Adaptive Planning
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time weather monitoring with smart itinerary adjustments
          </p>
        </CardHeader>
        <CardContent>
          {weatherData && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Current Condition</span>
                  <Badge className={getConditionColor(weatherData.current.condition)}>
                    {weatherData.current.condition}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Temperature</span>
                  <span className="font-medium">{weatherData.current.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Humidity</span>
                  <span className="font-medium">{weatherData.current.humidity}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Wind Speed</span>
                  <span className="font-medium">{weatherData.current.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Visibility</span>
                  <span className="font-medium">{weatherData.current.visibility} km</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchWeatherData}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Weather
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 7-Day Forecast */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium">{day.day}</p>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <p className="text-xs">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-gray-500">/{day.low}°</span>
                  </p>
                  {day.precipitation > 30 && (
                    <p className="text-xs text-blue-600">{day.precipitation}%</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Recommendations */}
      {adaptiveRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Smart Recommendations
            </CardTitle>
            <p className="text-sm text-gray-600">
              AI-powered suggestions based on current weather conditions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {adaptiveRecommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Button 
                    size="sm" 
                    onClick={() => applyRecommendation(rec)}
                  >
                    Apply
                  </Button>
                </div>
                <ul className="space-y-1">
                  {rec.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherAdaptive;