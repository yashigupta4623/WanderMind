import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Accessibility, 
  Baby, 
  Users, 
  Sun, 
  Moon,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Footprints
} from 'lucide-react';

const SafetyTagsBadge = ({ tags, compact = false }) => {
  if (!tags) return null;

  const badges = [];

  // Safety badges
  if (tags.safeForWomen) {
    badges.push({
      icon: ShieldCheck,
      label: 'Women Safe',
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
      priority: 1
    });
  }

  if (tags.safeForSolo) {
    badges.push({
      icon: Users,
      label: 'Solo Friendly',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      priority: 2
    });
  }

  // Accessibility badges
  if (tags.wheelchairAccessible) {
    badges.push({
      icon: Accessibility,
      label: 'Wheelchair OK',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      priority: 1
    });
  }

  if (tags.kidFriendly) {
    badges.push({
      icon: Baby,
      label: 'Kid Friendly',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      priority: 2
    });
  }

  // Crowd level
  if (tags.crowdLevel === 'high') {
    badges.push({
      icon: MapPin,
      label: 'Popular',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      priority: 3
    });
  }

  // Walking requirement
  if (tags.walkingRequired === 'low') {
    badges.push({
      icon: Footprints,
      label: 'Low Walking',
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200',
      priority: 3
    });
  }

  // Time of day
  const timeIcons = {
    earlyMorning: Sun,
    morning: Sun,
    afternoon: Sun,
    evening: Moon,
    night: Moon
  };

  const timeLabels = {
    earlyMorning: 'Early AM',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night'
  };

  if (tags.bestTimeOfDay) {
    const TimeIcon = timeIcons[tags.bestTimeOfDay] || Sun;
    badges.push({
      icon: TimeIcon,
      label: timeLabels[tags.bestTimeOfDay] || 'Daytime',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      priority: 4
    });
  }

  // Warnings
  if (tags.isolationLevel === 'high') {
    badges.push({
      icon: AlertTriangle,
      label: 'Isolated',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      priority: 0
    });
  }

  // Sort by priority
  badges.sort((a, b) => a.priority - b.priority);

  // Limit badges in compact mode
  const displayBadges = compact ? badges.slice(0, 3) : badges;

  if (displayBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayBadges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <Badge
            key={index}
            variant="secondary"
            className={`${badge.color} text-xs flex items-center gap-1 px-2 py-0.5`}
          >
            <Icon className="w-3 h-3" />
            <span>{badge.label}</span>
          </Badge>
        );
      })}
      {compact && badges.length > 3 && (
        <Badge
          variant="outline"
          className="text-xs px-2 py-0.5"
        >
          +{badges.length - 3}
        </Badge>
      )}
    </div>
  );
};

export default SafetyTagsBadge;
