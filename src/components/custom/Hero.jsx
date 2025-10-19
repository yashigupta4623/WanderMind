import React, { useState } from "react";
import { Lightbulb, ArrowRight, Sparkles, Users, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FeatureModal from "./FeatureModal";
import AnimatedHeroImage from "./AnimatedHeroImage";
import FeedbackWidget from "./FeedbackWidget";
import Footer from "./Footer.jsx";


function Hero() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeatureClick = (feature) => {
    // Show modal for main features, direct navigation for others
    const modalFeatures = ['ai-planning', 'realtime', 'multilingual', 'booking'];

    if (modalFeatures.includes(feature)) {
      setSelectedFeature(feature);
      setIsModalOpen(true);
      return;
    }

    // Direct navigation to specific tabs
    switch (feature) {
      case 'ai-planning':
        navigate('/create-trip?tab=persona');
        break;
      case 'realtime':
        navigate('/create-trip?tab=realtime');
        break;
      case 'booking':
        navigate('/create-trip?tab=advanced');
        break;
      case 'multilingual':
        navigate('/create-trip?tab=multilingual');
        break;
      case 'personas':
        navigate('/create-trip?tab=persona');
        break;
      case 'budget':
        navigate('/create-trip?tab=budget');
        break;
      case 'group':
        navigate('/create-trip?tab=group');
        break;
      case 'weather':
        navigate('/create-trip?tab=advanced');
        break;
      case 'eco':
        navigate('/create-trip?tab=advanced');
        break;
      case 'story':
        navigate('/create-trip?tab=advanced');
        break;
      case 'offline':
        navigate('/create-trip?tab=advanced');
        break;
      case 'inspire':
        navigate('/create-trip?tab=inspire');
        break;
      default:
        navigate('/create-trip');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <hr className="border-gray-200 dark:border-gray-700" />
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row h-full justify-center items-center mx-10 my-20">
        <article className="flex-1 p-4">
          <h1 className="font-bold lg:text-7xl md:text-6xl text-4xl text-left w-full text-gray-900 dark:text-white">
            Uncover the <br />
            <span className="text-blue-500 dark:text-blue-400">AI</span> Travel{" "}
            <span className="text-blue-500 dark:text-blue-400">Plan</span>
          </h1>

          <div className="mt-5 lg:mt-10 text-left lg:text-lg md:text-md text-base">
            <div className="flex items-center">
              <Lightbulb className="mr-2 text-yellow-600 dark:text-yellow-400 h-[50px] w-[50px]" />
              <span className="text-3xl md:text-2xl text-gray-800 dark:text-gray-200">
                Imagine telling your travel planner,
              </span>
            </div>
            <p className="text-blue-500 dark:text-blue-400 font-bold tracking-wide lg:text-2xl md:text-base text-sm mt-2">
              'Weekend escape to a vibrant city, with mid-range budget in summer.'
            </p>
            <p className="mt-5 text-gray-600 dark:text-gray-300 font-medium md:max-w-xl">
              Our AI not only understands but crafts a personalized adventure. Discover local secrets, savor culinary delights, and explore iconic landmarks with an itinerary designed just for you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/create-trip')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeatureClick('inspire')}
                className="px-8 py-3 text-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Get Inspired
              </Button>
            </div>


          </div>
        </article>

        {/* Animated Hero Image */}
        <div className="flex-1 p-4 pb-32">
          <AnimatedHeroImage />
        </div>

      </div>

      {/* How It Works Section */}
      <div className="my-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent mb-6">
              ✨ How The Magic Happens ✨
            </h2>
            <p className="text-2xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto font-medium leading-relaxed">
              From <span className="text-blue-600 font-bold">dream</span> to <span className="text-purple-600 font-bold">destination</span> - Watch AI transform your wanderlust into the perfect adventure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1: Sign Up & Personalize */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 h-[420px] relative overflow-hidden animate-slide-in-left hover:scale-105 group" style={{ animationDelay: '0.2s' }}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 dark:bg-blue-700/30 rounded-full animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-indigo-200/30 dark:bg-indigo-700/30 rounded-lg rotate-12 animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
                  <div className="absolute top-1/2 left-4 w-12 h-12 bg-blue-300/40 dark:bg-blue-600/40 rounded-full animate-ping" style={{animationDuration: '5s', animationDelay: '0.5s'}}></div>
                  {/* Floating particles */}
                  <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{animationDuration: '2s', animationDelay: '3s'}}></div>
                  <div className="absolute bottom-12 right-12 w-3 h-3 bg-indigo-400/60 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '1.5s'}}></div>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                    1
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="relative">
                      <img src="/login.png" alt="Sign Up Icon" className="h-16 w-16 filter brightness-0 invert" />
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      🎯 Sign Up & Personalize
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Create your unique travel profile with preferences, budget, and dream destinations. Our AI learns what makes you tick!
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    ⚡ Takes just 2 minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Describe Your Dream Trip */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 h-[420px] relative overflow-hidden animate-fade-in-up hover:scale-105 group" style={{ animationDelay: '0.4s' }}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20"></div>
                  <div className="absolute top-6 left-6 w-24 h-16 bg-orange-200/40 dark:bg-orange-700/40 rounded-2xl transform -rotate-12 animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.8s'}}></div>
                  <div className="absolute top-4 right-4 w-18 h-18 bg-yellow-200/40 dark:bg-yellow-700/40 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1.2s'}}></div>
                  <div className="absolute bottom-8 left-8 w-20 h-12 bg-orange-300/30 dark:bg-orange-600/30 rounded-lg rotate-6 animate-pulse" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
                  <div className="absolute bottom-4 right-6 w-14 h-14 bg-yellow-300/40 dark:bg-yellow-600/40 rounded-full animate-ping" style={{animationDuration: '4.5s', animationDelay: '0.3s'}}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-orange-100/50 dark:bg-orange-800/30 rounded-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1.8s'}}></div>
                  {/* Floating idea particles */}
                  <div className="absolute top-12 right-8 w-2 h-2 bg-yellow-500/70 rounded-full animate-bounce" style={{animationDuration: '2.2s', animationDelay: '2.5s'}}></div>
                  <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-orange-500/70 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                  <div className="absolute top-20 left-20 w-2.5 h-2.5 bg-yellow-400/60 rounded-full animate-pulse" style={{animationDuration: '2.8s', animationDelay: '3.2s'}}></div>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                    2
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="relative">
                      <img src="/bulb.png" alt="Idea Icon" className="h-16 w-16 filter brightness-0 invert" />
                      <div className="absolute -top-1 -right-1 text-yellow-300">💡</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      💭 Describe Your Dream Trip
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Share your vision - "Beach vibes in Bali" or "Mountain adventure in Nepal". Our AI understands natural language!
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-orange-600 dark:text-orange-400 font-semibold">
                    🗣️ Just speak naturally
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Get Your AI-Crafted Itinerary */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 h-[420px] relative overflow-hidden animate-slide-in-right hover:scale-105 group" style={{ animationDelay: '0.6s' }}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"></div>
                  <div className="absolute top-4 left-4 w-16 h-20 bg-green-200/40 dark:bg-green-700/40 rounded-lg animate-pulse" style={{animationDuration: '3.2s', animationDelay: '1.5s'}}></div>
                  <div className="absolute top-6 right-6 w-20 h-12 bg-emerald-200/40 dark:bg-emerald-700/40 rounded-2xl rotate-12 animate-bounce" style={{animationDuration: '3.8s', animationDelay: '0.7s'}}></div>
                  <div className="absolute bottom-8 left-6 w-24 h-16 bg-green-300/30 dark:bg-green-600/30 rounded-xl animate-pulse" style={{animationDuration: '4.2s', animationDelay: '2.3s'}}></div>
                  <div className="absolute bottom-4 right-4 w-18 h-18 bg-emerald-300/40 dark:bg-emerald-600/40 rounded-lg rotate-45 animate-ping" style={{animationDuration: '4.8s', animationDelay: '0.9s'}}></div>
                  <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-green-400/50 dark:bg-green-500/50 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '3.1s'}}></div>
                  <div className="absolute bottom-1/3 left-1/4 w-6 h-10 bg-emerald-400/50 dark:bg-emerald-500/50 rounded-full animate-pulse" style={{animationDuration: '3.5s', animationDelay: '1.8s'}}></div>
                  {/* Success particles */}
                  <div className="absolute top-10 right-10 w-2 h-2 bg-green-500/80 rounded-full animate-ping" style={{animationDuration: '2s', animationDelay: '2.8s'}}></div>
                  <div className="absolute bottom-12 left-10 w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-bounce" style={{animationDuration: '2.3s', animationDelay: '1.2s'}}></div>
                  <div className="absolute top-16 left-16 w-3 h-3 bg-green-400/70 rounded-full animate-pulse" style={{animationDuration: '2.7s', animationDelay: '3.5s'}}></div>
                  <div className="absolute bottom-20 right-16 w-2.5 h-2.5 bg-emerald-400/70 rounded-full animate-ping" style={{animationDuration: '3.1s', animationDelay: '0.4s'}}></div>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                    3
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="relative">
                      <img src="/plane.png" alt="AI Plan Icon" className="h-16 w-16 filter brightness-0 invert" />
                      <div className="absolute -top-2 -left-2 text-white">✈️</div>
                      <div className="absolute -bottom-1 -right-1 text-white">🎒</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      🚀 Get Your AI-Crafted Itinerary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Receive a detailed, personalized travel plan with bookings, hidden gems, and real-time adaptations. Magic delivered!
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold">
                    🎉 Ready in seconds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/create-trip')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Planning Your Trip
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* EaseMyTrip Integration Showcase */}
      <div className="my-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-10 rounded-2xl mx-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            AI-Powered Trip Planning with EaseMyTrip Integration
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience seamless end-to-end trip planning with real-time adaptations, multilingual support,
            and one-click booking through EaseMyTrip's comprehensive inventory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => handleFeatureClick('ai-planning')}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">AI-Powered Planning</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Dynamic itineraries that adapt to your budget, interests, and real-time conditions
            </p>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
            >
              Try AI Planning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => handleFeatureClick('realtime')}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Real-Time Adaptation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Smart adjustments for weather, traffic, and last-minute changes with live updates
            </p>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-yellow-600 group-hover:text-white transition-colors"
            >
              See Live Updates
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => handleFeatureClick('booking')}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">One-Click Booking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Seamless booking through EaseMyTrip inventory with instant confirmation
            </p>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-green-600 group-hover:text-white transition-colors"
            >
              Start Booking
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="my-20 mx-10">
        <h2 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-12">
          Advanced Travel Planning Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🌍',
              title: 'Multilingual Support',
              desc: '12+ Indian languages with voice assistance',
              action: 'multilingual',
              color: 'hover:bg-blue-600'
            },
            {
              icon: '🎯',
              title: 'Personalized Personas',
              desc: 'Heritage, Adventure, Luxury travel styles',
              action: 'personas',
              color: 'hover:bg-purple-600'
            },
            {
              icon: '💰',
              title: 'Smart Budget Planning',
              desc: 'AI-powered cost optimization and predictions',
              action: 'budget',
              color: 'hover:bg-green-600'
            },
            {
              icon: '🤝',
              title: 'Group Travel Mode',
              desc: 'Collaborative planning for group trips',
              action: 'group',
              color: 'hover:bg-orange-600'
            },
            {
              icon: '🌦️',
              title: 'Weather Adaptation',
              desc: 'Real-time weather-based recommendations',
              action: 'weather',
              color: 'hover:bg-cyan-600'
            },
            {
              icon: '🌱',
              title: 'Eco-Friendly Options',
              desc: 'Sustainability scoring and green alternatives',
              action: 'eco',
              color: 'hover:bg-emerald-600'
            },
            {
              icon: '📖',
              title: 'Trip Story Generator',
              desc: 'AI-generated shareable travel stories',
              action: 'story',
              color: 'hover:bg-pink-600'
            },
            {
              icon: '📱',
              title: 'Offline Mode',
              desc: 'Access your itinerary without internet',
              action: 'offline',
              color: 'hover:bg-gray-600'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleFeatureClick(feature.action)}
            >
              <div className="text-3xl text-center mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h4 className="font-semibold text-center text-gray-800 dark:text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">{feature.desc}</p>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-xs group-hover:text-white transition-colors ${feature.color}`}
                >
                  Try Feature
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="my-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              ✨ Trending Destinations ✨
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Discover <span className="text-emerald-600 font-bold">incredible destinations</span> across World with
              <span className="text-blue-600 font-bold"> AI-powered recommendations</span> 
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✨ Curated by AI</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🎯 Personalized</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⚡ Real-time</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Vrindavan",
                location: "Uttar Pradesh",
                img: "/vrin.png",
                category: "Spiritual",
                rating: "4.8",
                highlights: ["Krishna Temples", "Spiritual Journey"]
              },
              {
                name: "Ooty",
                location: "Tamil Nadu",
                img: "/ooty.png",
                category: "Hill Station",
                rating: "4.6",
                highlights: ["Tea Gardens", "Cool Climate"]
              },
              {
                name: "Santorini",
                location: "Greece",
                img: "/greece.png",
                category: "International",
                rating: "4.9",
                highlights: ["Sunset Views", "Blue Domes"]
              },
              {
                name: "Haridwar",
                location: "Uttarakhand",
                img: "/haridwar.png",
                category: "Spiritual",
                rating: "4.7",
                highlights: ["Ganga Aarti", "Holy Ghats"]
              },
              {
                name: "London",
                location: "United Kingdom",
                img: "/london.png",
                category: "International",
                rating: "4.8",
                highlights: ["Historic Sites", "Museums"]
              },
              {
                name: "Delhi",
                location: "National Capital",
                img: "/India-Gate.png",
                category: "Heritage",
                rating: "4.5",
                highlights: ["India Gate", "Red Fort"]
              },
              {
                name: "Everest Base",
                location: "Nepal Border",
                img: "/mt_everest.jpg",
                category: "Adventure",
                rating: "4.9",
                highlights: ["Trekking", "Mountain Views"]
              },
              {
                name: "Paris",
                location: "France",
                img: "/paris.png",
                category: "International",
                rating: "4.8",
                highlights: ["Eiffel Tower", "Art & Culture"]
              }
            ].map((destination, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${destination.category === 'Spiritual' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      destination.category === 'Hill Station' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        destination.category === 'International' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          destination.category === 'Heritage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                    {destination.category}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{destination.rating}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={destination.img}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span>📍</span> {destination.location}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate('/create-trip')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform group-hover:scale-105"
                  >
                    Plan Trip Here
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/create-trip')}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Globe className="w-5 h-5 mr-2" />
              Explore More Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />

      {/* Feature Modal */}
      <FeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feature={selectedFeature}
      />

      {/* Feedback Widget */}
      <FeedbackWidget
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onFeedbackSubmit={(feedback) => {
          console.log('Feedback submitted:', feedback);
          // The stats will update automatically via the feedback service
        }}
      />
    </div>


  );
}

export default Hero;
