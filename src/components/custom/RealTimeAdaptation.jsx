import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CloudRain, 
  Clock, 
  MapPin, 
  Zap, 
  RefreshCw,
  CheckCircle,
  Navigation,
  Thermometer,
  Wind
} from 'lucide-react';
import { toast } from 'sonner';

const RealTimeAdaptation = ({ tripData, currentLocation, onItineraryUpdate }) => {
  const [adaptations, setAdaptations] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock real-time data sources
  const [realTimeData, setRealTimeData] = useState({
    weather: {
      current: { condition: 'sunny', temp: 28, humidity: 65, windSpeed: 12 },
      forecast: { condition: 'rainy', probability: 80, startTime: '14:00' }
    },
    traffic: {
      currentDelay: 15, // minutes
      alternativeRoute: 'Via Ring Road (saves 20 mins)',
      congestionLevel: 'moderate'
    },
    events: [
      { name: 'Local Festival', impact: 'Road closures near City Center', severity: 'high' },
      { name: 'Cricket Match', impact: 'Heavy traffic near Stadium', severity: 'medium' }
    ],
    deals: [
      { type: 'restaurant', name: 'Spice Garden', discount: '30% off lunch', validTill: '15:00' },
      { type: 'activity', name: 'Museum Entry', discount: 'Buy 1 Get 1 Free', validTill: '18:00' }
    ]
  });

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        generateAdaptations();
        setLastUpdate(new Date());
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring, tripData]);

  const generateAdaptations = () => {
    const newAdaptations = [];

    // Weather-based adaptations
    if (realTimeData.weather.forecast.condition === 'rainy' && realTimeData.weather.forecast.probability > 70) {
      newAdaptations.push({
        id: 'weather_rain',
        type: 'weather',
        severity: 'high',
        title: 'Rain Expected This Afternoon',
        description: `${realTimeData.weather.forecast.probability}% chance of rain starting at ${realTimeData.weather.forecast.startTime}`,
        impact: 'Outdoor activities may be affected',
        suggestions: [
          'Move outdoor activities to morning slots',
          'Visit covered markets and museums in afternoon',
          'Book indoor dining experiences',
          'Carry umbrella and rain gear'
        ],
        alternatives: [
          { original: 'Garden Walk', alternative: 'Art Gallery Visit', reason: 'Indoor alternative' },
          { original: 'Street Food Tour', alternative: 'Cooking Class', reason: 'Covered venue' }
        ],
        autoApply: false,
        priority: 'high'
      });
    }

    // Traffic-based adaptations
    if (realTimeData.traffic.currentDelay > 10) {
      newAdaptations.push({
        id: 'traffic_delay',
        type: 'traffic',
        severity: 'medium',
        title: 'Traffic Congestion Detected',
        description: `Current delay: ${realTimeData.traffic.currentDelay} minutes`,
        impact: 'May affect scheduled activities timing',
        suggestions: [
          'Leave 30 minutes earlier for next destination',
          realTimeData.traffic.alternativeRoute,
          'Consider using metro/public transport',
          'Reschedule non-critical activities'
        ],
        alternatives: [],
        autoApply: true,
        priority: 'medium'
      });
    }

    // Event-based adaptations
    realTimeData.events.forEach((event, index) => {
      if (event.severity === 'high') {
        newAdaptations.push({
          id: `event_${index}`,
          type: 'event',
          severity: event.severity,
          title: `Local Event: ${event.name}`,
          description: event.impact,
          impact: 'Route changes may be required',
          suggestions: [
            'Avoid affected areas during peak hours',
            'Use alternative routes',
            'Consider joining the festivities if interested',
            'Book transportation in advance'
          ],
          alternatives: [],
          autoApply: false,
          priority: event.severity
        });
      }
    });

    // Deal-based adaptations
    realTimeData.deals.forEach((deal, index) => {
      newAdaptations.push({
        id: `deal_${index}`,
        type: 'opportunity',
        severity: 'low',
        title: `Limited Time Offer: ${deal.name}`,
        description: `${deal.discount} - Valid till ${deal.validTill}`,
        impact: 'Potential savings on your itinerary',
        suggestions: [
          'Add to today\'s itinerary if nearby',
          'Adjust meal/activity timing to avail offer',
          'Share with travel companions'
        ],
        alternatives: [],
        autoApply: false,
        priority: 'low'
      });
    });

    setAdaptations(newAdaptations);
  };

  const applyAdaptation = (adaptationId) => {
    const adaptation = adaptations.find(a => a.id === adaptationId);
    if (!adaptation) return;

    // Simulate applying the adaptation
    toast.success(`Applied: ${adaptation.title}`);
    
    // Remove the adaptation after applying
    setAdaptations(prev => prev.filter(a => a.id !== adaptationId));

    // Notify parent component
    if (onItineraryUpdate) {
      onItineraryUpdate({
        type: 'real_time_adaptation',
        adaptation: adaptation,
        timestamp: new Date()
      });
    }
  };

  const dismissAdaptation = (adaptationId) => {
    setAdaptations(prev => prev.filter(a => a.id !== adaptationId));
    toast.info('Suggestion dismissed');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'weather': return <CloudRain className="w-5 h-5" />;
      case 'traffic': return <Navigation className="w-5 h-5" />;
      case 'event': return <MapPin className="w-5 h-5" />;
      case 'opportunity': return <Zap className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${isMonitoring ? 'animate-spin text-green-500' : 'text-gray-400'}`} />
              Real-Time Trip Adaptation
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? 'Pause' : 'Resume'} Monitoring
            </Button>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isMonitoring ? 'Active Monitoring' : 'Paused'}
            </div>
            <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <div>
                <div className="font-medium">{realTimeData.weather.current.temp}°C</div>
                <div className="text-xs text-gray-500">Temperature</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">{realTimeData.weather.current.humidity}%</div>
                <div className="text-xs text-gray-500">Humidity</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-medium">{realTimeData.weather.current.windSpeed} km/h</div>
                <div className="text-xs text-gray-500">Wind Speed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-green-500" />
              <div>
                <div className="font-medium">{realTimeData.traffic.congestionLevel}</div>
                <div className="text-xs text-gray-500">Traffic</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Adaptations */}
      {adaptations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Smart Recommendations</h3>
          {adaptations.map((adaptation) => (
            <Card key={adaptation.id} className={`border-l-4 ${getSeverityColor(adaptation.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(adaptation.type)}
                      <h4 className="font-semibold">{adaptation.title}</h4>
                      <Badge variant={adaptation.severity === 'high' ? 'destructive' : 'secondary'}>
                        {adaptation.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{adaptation.description}</p>
                    <p className="text-sm font-medium text-gray-800 mb-3">{adaptation.impact}</p>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Suggestions:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {adaptation.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {adaptation.alternatives.length > 0 && (
                      <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-600">
                        <h5 className="text-sm font-medium mb-2">Alternative Options:</h5>
                        {adaptation.alternatives.map((alt, index) => (
                          <div key={index} className="text-sm">
                            <span className="line-through text-gray-400">{alt.original}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600 font-medium">{alt.alternative}</span>
                            <span className="text-xs text-gray-500 ml-2">({alt.reason})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => applyAdaptation(adaptation.id)}
                      className="whitespace-nowrap"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dismissAdaptation(adaptation.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">All Good!</h3>
            <p className="text-gray-600">
              No adaptations needed right now. Your itinerary is on track.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Auto-adaptation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adaptation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Auto-apply traffic route optimizations</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Notify about weather changes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Show local deals and offers</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Auto-reschedule for major disruptions</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAdaptation;