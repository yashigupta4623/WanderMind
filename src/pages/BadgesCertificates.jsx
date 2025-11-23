import React, { useState } from 'react';
import { Award, Star, Trophy, Zap, Globe, Heart, Shield, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BadgesCertificates() {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = [
    {
      id: 1,
      name: 'Explorer',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600',
      requirement: 'Create your first trip',
      description: 'Welcome to WanderMind! You\'ve taken your first step into the world of AI-powered travel planning.',
      unlocked: true
    },
    {
      id: 2,
      name: 'Adventurer',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-orange-400 to-orange-600',
      requirement: 'Plan 5 trips',
      description: 'You\'ve planned 5 amazing trips! You\'re becoming a travel planning expert.',
      unlocked: true
    },
    {
      id: 3,
      name: 'Globetrotter',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-purple-400 to-purple-600',
      requirement: 'Visit 10 different destinations',
      description: 'You\'ve explored 10 different destinations! The world is your playground.',
      unlocked: false
    },
    {
      id: 4,
      name: 'Budget Master',
      icon: <Flame className="w-8 h-8" />,
      color: 'from-green-400 to-green-600',
      requirement: 'Plan 3 budget trips',
      description: 'You\'ve mastered the art of budget travel! You know how to travel smart.',
      unlocked: true
    },
    {
      id: 5,
      name: 'Luxury Traveler',
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-400 to-yellow-600',
      requirement: 'Plan 3 luxury trips',
      description: 'You appreciate the finer things in travel. Luxury is your style!',
      unlocked: false
    },
    {
      id: 6,
      name: 'Social Butterfly',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-pink-400 to-pink-600',
      requirement: 'Share 5 trips with friends',
      description: 'You love sharing your travel experiences! You\'re a true social traveler.',
      unlocked: false
    },
    {
      id: 7,
      name: 'Safety Champion',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-400 to-red-600',
      requirement: 'Use safety filters on 3 trips',
      description: 'You prioritize safety! You\'re a responsible and conscious traveler.',
      unlocked: true
    },
    {
      id: 8,
      name: 'Sustainability Hero',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-teal-400 to-teal-600',
      requirement: 'Choose eco-friendly options',
      description: 'You care about the planet! You\'re making travel more sustainable.',
      unlocked: false
    },
    {
      id: 9,
      name: 'Early Bird',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-indigo-400 to-indigo-600',
      requirement: 'Book flights 60+ days in advance',
      description: 'You plan ahead! You always get the best flight deals.',
      unlocked: true
    },
    {
      id: 10,
      name: 'Foodie Explorer',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-orange-400 to-red-600',
      requirement: 'Select food tours on 3 trips',
      description: 'You\'re a culinary adventurer! Food is your travel destination.',
      unlocked: false
    },
  ];

  const certificates = [
    {
      id: 1,
      title: 'Certified Travel Planner',
      issuer: 'WanderMind Academy',
      description: 'Demonstrates proficiency in using WanderMind to plan comprehensive travel itineraries.',
      requirements: [
        'Complete 10 trips',
        'Use all major features',
        'Achieve 4.5+ rating',
        'Maintain active account for 3 months'
      ],
      earned: true,
      earnedDate: 'October 15, 2024'
    },
    {
      id: 2,
      title: 'Budget Travel Expert',
      issuer: 'WanderMind Academy',
      description: 'Recognized for expertise in planning affordable, high-quality travel experiences.',
      requirements: [
        'Plan 5 budget trips',
        'Average budget: $50/day or less',
        'Maintain 4.0+ rating',
        'Share budget tips with community'
      ],
      earned: false,
      earnedDate: null
    },
    {
      id: 3,
      title: 'Luxury Travel Connoisseur',
      issuer: 'WanderMind Academy',
      description: 'Awarded to travelers who consistently plan premium, high-end travel experiences.',
      requirements: [
        'Plan 5 luxury trips',
        'Average budget: $200+/day',
        'Maintain 4.5+ rating',
        'Explore premium destinations'
      ],
      earned: false,
      earnedDate: null
    },
    {
      id: 4,
      title: 'Sustainable Travel Champion',
      issuer: 'WanderMind Academy',
      description: 'Recognizes commitment to environmentally responsible and ethical travel practices.',
      requirements: [
        'Choose eco-friendly options on 5 trips',
        'Support local communities',
        'Minimize carbon footprint',
        'Share sustainability tips'
      ],
      earned: false,
      earnedDate: null
    },
    {
      id: 5,
      title: 'Safety-Conscious Traveler',
      issuer: 'WanderMind Academy',
      description: 'Demonstrates commitment to safe, responsible travel practices.',
      requirements: [
        'Use safety filters on 5 trips',
        'Complete safety training',
        'Share safety tips',
        'Maintain clean travel record'
      ],
      earned: true,
      earnedDate: 'September 20, 2024'
    },
    {
      id: 6,
      title: 'Community Ambassador',
      issuer: 'WanderMind Academy',
      description: 'Awarded to active community members who help and inspire other travelers.',
      requirements: [
        'Share 10 trips with community',
        'Help 5 new travelers',
        'Maintain 4.5+ rating',
        'Participate in community events'
      ],
      earned: false,
      earnedDate: null
    },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Badges & Certificates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Earn badges and certificates as you explore, plan, and share your travel experiences with WanderMind.
          </p>
        </div>

        {/* Badges Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Achievement Badges</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Unlock badges by completing travel milestones and achievements.
          </p>

          {/* Unlocked Badges */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Unlocked ({unlockedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {unlockedBadges.map(badge => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${badge.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-3`}>
                    <div className="flex justify-center mb-3">
                      {badge.icon}
                    </div>
                    <p className="font-bold text-sm text-center">{badge.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Locked ({lockedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {lockedBadges.map(badge => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-3">
                    <div className="flex justify-center mb-3 text-gray-600 dark:text-gray-400">
                      {badge.icon}
                    </div>
                    <p className="font-bold text-sm text-center text-gray-700 dark:text-gray-300">{badge.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badge Details */}
        {selectedBadge && (
          <div className="max-w-2xl mx-auto mb-20 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className={`bg-gradient-to-br ${selectedBadge.color} rounded-lg p-4 text-white w-fit mb-4`}>
                  {selectedBadge.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBadge.name}</h3>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedBadge.description}</p>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirement:</p>
              <p className="text-gray-700 dark:text-gray-300">{selectedBadge.requirement}</p>
            </div>
            {selectedBadge.unlocked && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-700 dark:text-green-300 font-semibold">✓ Badge Unlocked!</p>
              </div>
            )}
          </div>
        )}

        {/* Certificates Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Professional Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className={`rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow ${
                  cert.earned
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className={`w-5 h-5 ${cert.earned ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        cert.earned
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {cert.earned ? 'Earned' : 'Locked'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{cert.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements:</p>
                  <ul className="space-y-1">
                    {cert.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {cert.earned && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                      ✓ Earned on {cert.earnedDate}
                    </p>
                  </div>
                )}

                {!cert.earned && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Progress
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">How to Earn Badges & Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">✈️</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Plan Trips</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create and complete trips to unlock travel-related badges and achievements.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Maintain Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Keep high ratings and positive feedback to earn professional certificates.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Share & Engage</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Share your trips, help others, and participate in the community to earn badges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
