import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
  Car
} from 'lucide-react';
import { toast } from 'sonner';

const SafetyAccessibilityFilters = ({ onFiltersUpdate }) => {
  const [filters, setFilters] = useState({
    // Safety Filters
    safeForWomen: false,
    safeForSolo: false,
    avoidIsolatedAreas: false,
    preferCrowdedPlaces: false,
    
    // Accessibility Filters
    wheelchairFriendly: false,
    lowWalking: false,
    maxWalkingDistance: 5, // km per day
    
    // Family Filters
    familyWithKids: false,
    avoidLateNight: false,
    includeKidFriendly: false,
    
    // Time Preferences
    preferDaytime: false,
    avoidEarlyMorning: false
  });

  const [activeMode, setActiveMode] = useState(null);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFiltersUpdate) {
      onFiltersUpdate(newFilters);
    }
  };

  const activateMode = (mode) => {
    let modeFilters = { ...filters };
    
    switch(mode) {
      case 'women-solo':
        modeFilters = {
          ...modeFilters,
          safeForWomen: true,
          safeForSolo: true,
          avoidIsolatedAreas: true,
          preferCrowdedPlaces: true,
          preferDaytime: true,
          avoidLateNight: true
        };
        toast.success('🛡️ Women Solo Traveler mode activated! Safety-first recommendations enabled.');
        break;
        
      case 'accessibility':
        modeFilters = {
          ...modeFilters,
          wheelchairFriendly: true,
          lowWalking: true,
          maxWalkingDistance: 2,
          avoidEarlyMorning: true
        };
        toast.success('♿ Accessibility mode activated! Low-walking, wheelchair-friendly itinerary.');
        break;
        
      case 'family-kids':
        modeFilters = {
          ...modeFilters,
          familyWithKids: true,
          avoidLateNight: true,
          includeKidFriendly: true,
          preferDaytime: true,
          maxWalkingDistance: 3
        };
        toast.success('👨‍👩‍👧‍👦 Family with Kids mode activated! Kid-friendly, safe itinerary.');
        break;
        
      default:
        break;
    }
    
    setFilters(modeFilters);
    setActiveMode(mode);
    
    if (onFiltersUpdate) {
      onFiltersUpdate(modeFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      safeForWomen: false,
      safeForSolo: false,
      avoidIsolatedAreas: false,
      preferCrowdedPlaces: false,
      wheelchairFriendly: false,
      lowWalking: false,
      maxWalkingDistance: 5,
      familyWithKids: false,
      avoidLateNight: false,
      includeKidFriendly: false,
      preferDaytime: false,
      avoidEarlyMorning: false
    };
    
    setFilters(clearedFilters);
    setActiveMode(null);
    
    if (onFiltersUpdate) {
      onFiltersUpdate(clearedFilters);
    }
    
    toast.info('Filters cleared');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(v => v === true).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Safety, Accessibility & Special Filters
            <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-800">
              India-First
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalized filters for safe, accessible, and comfortable travel experiences 🇮🇳
          </p>
        </CardHeader>
      </Card>

      {/* Quick Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Quick Mode Selection
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            One-click presets for common travel needs
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => activateMode('women-solo')}
            variant={activeMode === 'women-solo' ? 'default' : 'outline'}
            className={`w-full justify-start h-auto py-4 ${
              activeMode === 'women-solo' 
                ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                : 'hover:border-pink-400'
            }`}
          >
            <div className="flex items-start gap-3 text-left">
              <ShieldCheck className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-base">Women Solo Traveler</div>
                <div className="text-xs opacity-90 mt-1">
                  Safe areas • Crowded places • Daytime activities • Avoid isolated spots
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => activateMode('accessibility')}
            variant={activeMode === 'accessibility' ? 'default' : 'outline'}
            className={`w-full justify-start h-auto py-4 ${
              activeMode === 'accessibility' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'hover:border-blue-400'
            }`}
          >
            <div className="flex items-start gap-3 text-left">
              <Accessibility className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-base">Accessibility Mode</div>
                <div className="text-xs opacity-90 mt-1">
                  Wheelchair friendly • Minimal walking • Cab/auto heavy • Accessible venues
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => activateMode('family-kids')}
            variant={activeMode === 'family-kids' ? 'default' : 'outline'}
            className={`w-full justify-start h-auto py-4 ${
              activeMode === 'family-kids' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:border-green-400'
            }`}
          >
            <div className="flex items-start gap-3 text-left">
              <Baby className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-base">Family with Kids</div>
                <div className="text-xs opacity-90 mt-1">
                  Kid-friendly • Parks • No late nights • Short walks • Family restaurants
                </div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Safety Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Safety Filters
            <Badge variant="outline" className="ml-auto">
              {Object.values(filters).filter(v => v === true && ['safeForWomen', 'safeForSolo', 'avoidIsolatedAreas', 'preferCrowdedPlaces'].includes(v)).length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-pink-600" />
              <div>
                <div className="font-medium text-sm">Safe for Women</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Well-lit, populated areas with good reviews
                </div>
              </div>
            </div>
            <Switch
              checked={filters.safeForWomen}
              onCheckedChange={(checked) => handleFilterChange('safeForWomen', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Safe for Solo Travelers</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Tourist-friendly areas with good connectivity
                </div>
              </div>
            </div>
            <Switch
              checked={filters.safeForSolo}
              onCheckedChange={(checked) => handleFilterChange('safeForSolo', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">Avoid Isolated Areas</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Skip remote or less-populated locations
                </div>
              </div>
            </div>
            <Switch
              checked={filters.avoidIsolatedAreas}
              onCheckedChange={(checked) => handleFilterChange('avoidIsolatedAreas', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">Prefer Crowded Places</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Popular tourist spots with good footfall
                </div>
              </div>
            </div>
            <Switch
              checked={filters.preferCrowdedPlaces}
              onCheckedChange={(checked) => handleFilterChange('preferCrowdedPlaces', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-blue-600" />
            Accessibility Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Accessibility className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Wheelchair Friendly</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Ramps, elevators, accessible facilities
                </div>
              </div>
            </div>
            <Switch
              checked={filters.wheelchairFriendly}
              onCheckedChange={(checked) => handleFilterChange('wheelchairFriendly', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Low Walking Itinerary</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Cab/auto heavy, minimal walking required
                </div>
              </div>
            </div>
            <Switch
              checked={filters.lowWalking}
              onCheckedChange={(checked) => handleFilterChange('lowWalking', checked)}
            />
          </div>

          {/* Walking Distance Slider */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-sm">Max Walking Distance</span>
              </div>
              <Badge variant="secondary">
                {filters.maxWalkingDistance} km/day
              </Badge>
            </div>
            <Slider
              value={[filters.maxWalkingDistance]}
              onValueChange={(value) => handleFilterChange('maxWalkingDistance', value[0])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 km (Cab only)</span>
              <span>5 km (Moderate)</span>
              <span>10 km (Active)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family & Time Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Baby className="w-5 h-5 text-green-600" />
            Family & Time Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Baby className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">Family with Kids</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Parks, museums, kid-friendly attractions
                </div>
              </div>
            </div>
            <Switch
              checked={filters.familyWithKids}
              onCheckedChange={(checked) => handleFilterChange('familyWithKids', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-medium text-sm">Include Kid-Friendly Places</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Play areas, interactive exhibits, family restaurants
                </div>
              </div>
            </div>
            <Switch
              checked={filters.includeKidFriendly}
              onCheckedChange={(checked) => handleFilterChange('includeKidFriendly', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-medium text-sm">Prefer Daytime Activities</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  9 AM - 6 PM activities only
                </div>
              </div>
            </div>
            <Switch
              checked={filters.preferDaytime}
              onCheckedChange={(checked) => handleFilterChange('preferDaytime', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Avoid Late Night</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  No activities after 9 PM
                </div>
              </div>
            </div>
            <Switch
              checked={filters.avoidLateNight}
              onCheckedChange={(checked) => handleFilterChange('avoidLateNight', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">Avoid Early Morning</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Start activities after 9 AM
                </div>
              </div>
            </div>
            <Switch
              checked={filters.avoidEarlyMorning}
              onCheckedChange={(checked) => handleFilterChange('avoidEarlyMorning', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-200">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              Your itinerary will be customized based on these preferences
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-300">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• AI analyzes each destination for safety, accessibility, and suitability</li>
                <li>• Places are tagged with time-of-day recommendations and crowd levels</li>
                <li>• Itinerary is automatically adjusted to match your filters</li>
                <li>• Real-time safety alerts and alternative suggestions provided</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyAccessibilityFilters;
