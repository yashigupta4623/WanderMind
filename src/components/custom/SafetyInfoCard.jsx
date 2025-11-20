import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Users,
  Lightbulb
} from 'lucide-react';
import { safetyAccessibilityService } from '@/service/SafetyAccessibilityService';

const SafetyInfoCard = ({ destination, tripData }) => {
  const [expanded, setExpanded] = useState(false);
  const [safetyInfo, setSafetyInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destination) {
      loadSafetyInfo();
    }
  }, [destination]);

  const loadSafetyInfo = async () => {
    setLoading(true);
    try {
      // Get curated safety data
      const city = destination.split(',')[0].trim();
      const womenSafeAreas = safetyAccessibilityService.safetyDatabase.womenSafeAreas[city] || [];
      const wheelchairAccessible = safetyAccessibilityService.safetyDatabase.wheelchairAccessible[city] || [];
      const kidFriendly = safetyAccessibilityService.safetyDatabase.kidFriendly[city] || [];

      setSafetyInfo({
        womenSafeAreas: womenSafeAreas.slice(0, 5),
        wheelchairAccessible: wheelchairAccessible.slice(0, 5),
        kidFriendly: kidFriendly.slice(0, 5),
        generalTips: [
          'Keep emergency contacts handy',
          'Share your itinerary with family/friends',
          'Use registered taxis or ride-sharing apps',
          'Avoid isolated areas after dark',
          'Keep copies of important documents'
        ]
      });
    } catch (error) {
      console.error('Error loading safety info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!safetyInfo) {
    return null;
  }

  return (
    <Card className="border-2 border-pink-300 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-600" />
            <span>Safety & Accessibility Info</span>
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              India-First
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Curated safety information for {destination}
        </p>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4">
          {/* Women-Safe Areas */}
          {safetyInfo.womenSafeAreas.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Safe Areas for Women Travelers
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {safetyInfo.womenSafeAreas.map((area, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Wheelchair Accessible */}
          {safetyInfo.wheelchairAccessible.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Wheelchair Accessible Venues
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {safetyInfo.wheelchairAccessible.map((venue, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {venue}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Kid-Friendly */}
          {safetyInfo.kidFriendly.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Kid-Friendly Attractions
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {safetyInfo.kidFriendly.map((place, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {place}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* General Safety Tips */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Safety Tips
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {safetyInfo.generalTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Info */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Emergency Contacts
                </p>
                <div className="text-red-700 dark:text-red-300 space-y-1">
                  <p>• Police: 100</p>
                  <p>• Ambulance: 102</p>
                  <p>• Women Helpline: 1091</p>
                  <p>• Tourist Helpline: 1363</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                This information is curated from verified sources and traveler reviews. 
                Always exercise caution and trust your instincts while traveling.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SafetyInfoCard;
