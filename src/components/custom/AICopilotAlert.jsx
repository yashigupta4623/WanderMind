import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Cloud, Plane, Calendar, 
  CheckCircle, X, RefreshCw, Sparkles, Bell 
} from 'lucide-react';
import { aiCopilot } from '@/service/AICopilotService';
import { toast } from 'sonner';

const AICopilotAlert = ({ tripData, onReplan }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (tripData) {
      checkForAlerts();
      // Check every 5 minutes
      const interval = setInterval(checkForAlerts, 300000);
      return () => clearInterval(interval);
    }
  }, [tripData]);

  const checkForAlerts = async () => {
    setLoading(true);
    try {
      const newAlerts = await aiCopilot.checkForDisruptions(tripData, 'Day 1');
      setAlerts(newAlerts.filter(alert => !dismissed.includes(alert.title)));
    } catch (error) {
      console.error('Error checking alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (alert) => {
    toast.loading('AI Copilot is re-planning your trip...');
    
    try {
      const updatedTrip = await aiCopilot.applyReplan(tripData, alert, 'accept');
      
      if (onReplan) {
        onReplan(updatedTrip);
      }
      
      toast.dismiss();
      toast.success('Trip re-planned successfully! ✨');
      
      // Remove alert
      setAlerts(alerts.filter(a => a.title !== alert.title));
      
      // Show notification
      showNotification(alert);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to re-plan trip');
    }
  };

  const handleDismiss = (alert) => {
    setDismissed([...dismissed, alert.title]);
    setAlerts(alerts.filter(a => a.title !== alert.title));
    toast.info('Alert dismissed');
  };

  const showNotification = (alert) => {
    const message = aiCopilot.generateNotificationMessage(alert);
    
    // Show in-app notification
    toast.success(
      <div className="space-y-2">
        <div className="font-semibold">Trip Updated!</div>
        <div className="text-xs">{alert.updateReason || 'Your itinerary has been optimized'}</div>
      </div>,
      { duration: 5000 }
    );

    // Simulate WhatsApp/SMS notification (in production, use real API)
    console.log('📱 WhatsApp/SMS Notification:', message);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-300 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-orange-300 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'weather': return <Cloud className="w-5 h-5" />;
      case 'transport': return <Plane className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (alerts.length === 0 && !loading) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                All Clear! ✨
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                No disruptions detected. Your trip is on track.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkForAlerts}
              className="ml-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-lg">AI Copilot Alerts</h3>
          <Badge variant="secondary">{alerts.length} active</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkForAlerts}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {alerts.map((alert, index) => (
        <Card key={index} className={`border-2 ${getSeverityColor(alert.severity)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {getSeverityIcon(alert.type)}
              {alert.title}
              <Badge 
                variant="outline" 
                className={`ml-auto ${
                  alert.severity === 'high' ? 'border-red-500 text-red-700' :
                  alert.severity === 'medium' ? 'border-orange-500 text-orange-700' :
                  'border-blue-500 text-blue-700'
                }`}
              >
                {alert.severity}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {alert.message}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                💡 {alert.suggestion}
              </p>
            </div>

            {alert.alternatives && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <h5 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Suggested Alternatives:
                </h5>
                <div className="space-y-2">
                  {alert.alternatives.map((alt, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="line-through text-gray-500">{alt.original}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {alt.alternative.name}
                        </span>
                      </div>
                      <span className="text-gray-500">({alt.alternative.duration})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => handleAccept(alert)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept & Re-plan
              </Button>
              <Button
                onClick={() => handleDismiss(alert)}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Dismiss
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Bell className="w-3 h-3" />
              <span>Notification will be sent via app & SMS</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AICopilotAlert;
