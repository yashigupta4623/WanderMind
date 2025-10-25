import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Users, MapPin, Star } from 'lucide-react';
import { feedbackService } from '@/service/FeedbackService';
import FeedbackWidget from './FeedbackWidget';

const DynamicStats = ({ className = "" }) => {
  const [stats, setStats] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load initial stats
    const initialStats = feedbackService.getStats();
    setStats(initialStats);

    // Listen for stats updates
    const handleStatsUpdate = (event) => {
      setStats(event.detail);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);
    
    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFeedbackSubmit = (feedback) => {
    // Trigger a small celebration animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  if (!stats) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 sm:mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 sm:mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 sm:mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className={`transition-all duration-500 ${isAnimating ? 'scale-110' : ''}`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(stats.tripsPlanned)}+
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Trips Planned</div>
          </div>
          
          <div className={`transition-all duration-500 ${isAnimating ? 'scale-110' : ''}`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.destinations}+
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Destinations</div>
          </div>
          
          <div className={`transition-all duration-500 ${isAnimating ? 'scale-110' : ''}`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.userRating}★
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">User Rating</div>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFeedback(true)}
            className="w-full flex items-center gap-1 sm:gap-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 py-1 sm:py-2"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Share Your Feedback</span>
            <span className="sm:hidden">Feedback</span>
          </Button>
        </div>

        {/* Live Update Indicator */}
        <div className="mt-1 sm:mt-2 flex items-center justify-center gap-1 sm:gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="hidden sm:inline">Live Stats • Updated {new Date(stats.lastUpdated).toLocaleTimeString()}</span>
          <span className="sm:hidden">Live • {new Date(stats.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      {/* Feedback Widget */}
      <FeedbackWidget
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </>
  );
};

export default DynamicStats;