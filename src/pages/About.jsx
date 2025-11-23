import React from 'react';
import { Globe, Users, Zap, Heart, Award, TrendingUp } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, label: 'Active Users', value: '50K+' },
    { icon: <Globe className="w-8 h-8" />, label: 'Destinations', value: '195' },
    { icon: <TrendingUp className="w-8 h-8" />, label: 'Trips Planned', value: '100K+' },
    { icon: <Award className="w-8 h-8" />, label: 'Satisfaction', value: '98%' },
  ];

  const values = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to revolutionize travel planning'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Passion',
      description: 'We love travel and it shows in every feature we build'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community',
      description: 'We believe in building a global community of adventurous travelers'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Sustainability',
      description: 'We promote responsible and eco-friendly travel practices'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About WanderMind
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We're on a mission to transform how people plan and experience travel. By combining artificial intelligence with human creativity, we help travelers discover their perfect journey.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-center text-blue-600 dark:text-blue-400 mb-3">
                {stat.icon}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Story</h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              WanderMind was born from a simple observation: travel planning is overwhelming. With countless options, conflicting reviews, and endless decisions, many people give up before they even start their journey.
            </p>
            <p>
              In 2024, our founding team decided to change this. We combined our passion for travel with expertise in artificial intelligence to create a platform that understands your preferences, learns from your choices, and suggests trips that are perfectly tailored to you.
            </p>
            <p>
              Today, WanderMind helps thousands of travelers discover amazing destinations, plan detailed itineraries, and create unforgettable memories. We're just getting started.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Team</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're a diverse team of travel enthusiasts, AI engineers, and designers united by a single goal: making travel planning effortless and enjoyable.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Every day, we work to improve WanderMind and bring the joy of discovery to travelers around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
