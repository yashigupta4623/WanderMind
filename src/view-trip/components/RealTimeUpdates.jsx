import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  AlertTriangle, 
  Calendar, 
  Navigation, 
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';

function RealTimeUpdates({ trip }) {
  const [updates, setUpdates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const destination = trip?.userSelection?.location?.label || trip?.tripDetails?.destination || '';

  useEffect(() => {
    if (destination) {
      fetchRealTimeUpdates();
      // Refresh every 5 minutes
      const interval = setInterval(fetchRealTimeUpdates, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [destination]);

  const fetchRealTimeUpdates = () => {
    setLoading(true);
    // Simulate real-time data (in production, this would call actual APIs)
    setTimeout(() => {
      setUpdates(generateMockUpdates(destination));
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const generateMockUpdates = (city) => {
    const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C

    return {
      weather: {
        condition: randomWeather,
        temperature: temp,
        humidity: Math.floor(Math.random() * 30) + 50,
        icon: randomWeather.includes('Rain') ? '🌧️' : randomWeather.includes('Cloud') ? '☁️' : '☀️',
        recommendation: temp > 30 ? 'Stay hydrated and use sunscreen' : 'Perfect weather for sightseeing!'
      },
      traffic: {
        status: Math.random() > 0.5 ? 'Moderate' : 'Light',
        color: Math.random() > 0.5 ? 'yellow' : 'green',
        message: 'Traffic is flowing smoothly on major routes'
      },
      events: [
        {
          name: 'Local Food Festival',
          date: 'Today, 6:00 PM',
          location: 'City Center',
          type: 'Cultural'
        },
        {
          name: 'Weekend Market',
          date: 'Tomorrow, 9:00 AM',
          location: 'Main Square',
          type: 'Shopping'
        }
      ],
      alerts: [
        {
          type: 'info',
          message: 'Museum closed on Mondays',
          icon: <Info className="w-4 h-4" />
        }
      ],
      crowdLevels: {
        touristSpots: Math.random() > 0.5 ? 'Moderate' : 'Low',
        restaurants: Math.random() > 0.5 ? 'Busy' : 'Moderate',
        recommendation: 'Best time to visit popular attractions: Early morning (8-10 AM)'
      },
      localTips: [
        'Local markets are less crowded on weekday mornings',
        'Book restaurants in advance for dinner',
        'Use local transport apps for better rates'
      ]
    };
  };

  if (loading && !updates) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-3">Loading real-time updates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!updates) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Real-Time Updates</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRealTimeUpdates}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{updates.weather.icon}</span>
              <div>
                <div className="text-3xl font-bold">{updates.weather.temperature}°C</div>
                <div className="text-gray-600 dark:text-gray-400">{updates.weather.condition}</div>
                <div className="text-sm text-gray-500">Humidity: {updates.weather.humidity}%</div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 {updates.weather.recommendation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Traffic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-purple-600" />
              Traffic Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${
                updates.traffic.color === 'green' ? 'bg-green-500' : 
                updates.traffic.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-2xl font-bold">{updates.traffic.status}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {updates.traffic.message}
            </p>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium">🚗 Travel Tip</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Use local ride-sharing apps for better rates and real-time tracking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Crowd Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Crowd Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tourist Spots</span>
                <Badge variant={updates.crowdLevels.touristSpots === 'Low' ? 'secondary' : 'outline'}>
                  {updates.crowdLevels.touristSpots}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Restaurants</span>
                <Badge variant={updates.crowdLevels.restaurants === 'Moderate' ? 'secondary' : 'outline'}>
                  {updates.crowdLevels.restaurants}
                </Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                ⏰ {updates.crowdLevels.recommendation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Local Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Happening Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {updates.events.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        📍 {event.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        🕐 {event.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {updates.alerts.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
              <AlertTriangle className="w-5 h-5" />
              Important Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {updates.alerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                  {alert.icon}
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Local Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            Local Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {updates.localTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">💡</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RealTimeUpdates;
