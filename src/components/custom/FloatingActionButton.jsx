import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Camera, Users, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: 'AI Plan',
      action: () => navigate('/create-trip?tab=persona'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: <Camera className="w-4 h-4" />,
      label: 'Inspire Me',
      action: () => navigate('/create-trip?tab=inspire'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Group Trip',
      action: () => navigate('/create-trip?tab=group'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <Calculator className="w-4 h-4" />,
      label: 'Budget Plan',
      action: () => navigate('/create-trip?tab=budget'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-20 z-50">
      {/* Quick Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-in slide-in-from-right-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg border">
                {action.label}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  action.action();
                  setIsExpanded(false);
                }}
                className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white`}
              >
                {action.icon}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`rounded-full p-4 shadow-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;