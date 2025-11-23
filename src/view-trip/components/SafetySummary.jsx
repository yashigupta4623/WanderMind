import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  ShieldCheck,
  Users,
  Accessibility,
  Baby,
  Moon,
  Sun,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Clock,
  Footprints,
  Car,
  AlertCircle
} from 'lucide-react';

function SafetySummary({ trip }) {
  const safetyFilters = trip?.userSelection?.safetyFilters;
  const safetyMode = trip?.safetyMode;

  if (!safetyFilters || Object.values(safetyFilters).every(v => v === false)) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            Safety & Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">No specific safety filters were applied to this trip.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getModeIcon = () => {
    if (safetyFilters.safeForWomen && safetyFilters.safeForSolo) {
      return <ShieldCheck className="w-6 h-6 text-pink-600" />;
    }
    if (safetyFilters.wheelchairFriendly) {
      return <Accessibility className="w-6 h-6 text-blue-600" />;
    }
    if (safetyFilters.familyWithKids) {
      return <Baby className="w-6 h-6 text-green-600" />;
    }
    return <Shield className="w-6 h-6 text-purple-600" />;
  };

  const getActiveModes = () => {
    const modes = [];
    if (safetyFilters.safeForWomen || safetyFilters.safeForSolo) {
      modes.push('🛡️ Women Solo Traveler');
    }
    if (safetyFilters.wheelchairFriendly) {
      modes.push('♿ Accessibility Mode');
    }
    if (safetyFilters.familyWithKids) {
      modes.push('👨‍👩‍👧‍👦 Family with Kids');
    }
    return modes;
  };

  const getActiveFilters = () => {
    const filters = [];

    // Safety Filters
    if (safetyFilters.safeForWomen) {
      filters.push({
        icon: <ShieldCheck className="w-4 h-4" />,
        label: 'Safe for Women',
        description: 'Well-lit, populated areas',
        color: 'pink'
      });
    }

    if (safetyFilters.safeForSolo) {
      filters.push({
        icon: <Users className="w-4 h-4" />,
        label: 'Safe for Solo Travelers',
        description: 'Tourist-friendly areas',
        color: 'blue'
      });
    }

    if (safetyFilters.avoidIsolatedAreas) {
      filters.push({
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Avoid Isolated Areas',
        description: 'Main tourist areas only',
        color: 'orange'
      });
    }

    if (safetyFilters.preferCrowdedPlaces) {
      filters.push({
        icon: <MapPin className="w-4 h-4" />,
        label: 'Prefer Crowded Places',
        description: 'Popular tourist spots',
        color: 'green'
      });
    }

    // Accessibility Filters
    if (safetyFilters.wheelchairFriendly) {
      filters.push({
        icon: <Accessibility className="w-4 h-4" />,
        label: 'Wheelchair Friendly',
        description: 'Ramps, elevators, accessible',
        color: 'blue'
      });
    }

    if (safetyFilters.lowWalking) {
      filters.push({
        icon: <Car className="w-4 h-4" />,
        label: 'Low Walking Itinerary',
        description: `Max ${safetyFilters.maxWalkingDistance}km/day`,
        color: 'purple'
      });
    }

    // Family Filters
    if (safetyFilters.familyWithKids) {
      filters.push({
        icon: <Baby className="w-4 h-4" />,
        label: 'Family with Kids',
        description: 'Kid-friendly attractions',
        color: 'green'
      });
    }

    if (safetyFilters.includeKidFriendly) {
      filters.push({
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Kid-Friendly Places',
        description: 'Parks, museums, interactive',
        color: 'indigo'
      });
    }

    // Time Filters
    if (safetyFilters.preferDaytime) {
      filters.push({
        icon: <Sun className="w-4 h-4" />,
        label: 'Daytime Activities',
        description: '9 AM - 6 PM only',
        color: 'yellow'
      });
    }

    if (safetyFilters.avoidLateNight) {
      filters.push({
        icon: <Moon className="w-4 h-4" />,
        label: 'Avoid Late Night',
        description: 'No activities after 9 PM',
        color: 'gray'
      });
    }

    if (safetyFilters.avoidEarlyMorning) {
      filters.push({
        icon: <Clock className="w-4 h-4" />,
        label: 'Avoid Early Morning',
        description: 'Start after 9 AM',
        color: 'orange'
      });
    }

    return filters;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      gray: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconColorClasses = (color) => {
    const colorMap = {
      pink: 'text-pink-600 dark:text-pink-400',
      blue: 'text-blue-600 dark:text-blue-400',
      orange: 'text-orange-600 dark:text-orange-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      gray: 'text-gray-600 dark:text-gray-400',
      indigo: 'text-indigo-600 dark:text-indigo-400'
    };
    return colorMap[color] || colorMap.blue;
  };

  const activeModes = getActiveModes();
  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getModeIcon()}
              <div>
                <CardTitle className="text-lg">Safety & Accessibility</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This trip is optimized for your safety and comfort preferences
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
              ✓ Enabled
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Active Modes */}
      {activeModes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Active Travel Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeModes.map((mode, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm">
                  {mode}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Grid */}
      {activeFilters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Applied Filters ({activeFilters.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeFilters.map((filter, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getColorClasses(filter.color)}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 ${getIconColorClasses(filter.color)}`}>
                      {filter.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{filter.label}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {filter.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-2">How Your Preferences Were Applied:</p>
              <ul className="space-y-1 text-xs">
                <li>✓ All places and activities match your safety requirements</li>
                <li>✓ Itinerary timing respects your time preferences</li>
                <li>✓ Walking distances align with your accessibility needs</li>
                <li>✓ Venues are selected based on your comfort level</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-2">Safety Tips for Your Trip:</p>
              <ul className="space-y-1 text-xs">
                <li>• Share your itinerary with trusted friends/family</li>
                <li>• Keep emergency contacts handy</li>
                <li>• Check local weather and travel advisories</li>
                <li>• Stay connected with offline maps downloaded</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SafetySummary;
