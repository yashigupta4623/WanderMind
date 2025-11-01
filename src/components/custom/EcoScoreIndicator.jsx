import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, TreePine, Car, Utensils, Home, Award } from 'lucide-react';

const EcoScoreIndicator = ({ tripData, ecoScore = 0 }) => {
  const getEcoScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEcoScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const ecoFactors = [
    {
      category: 'Transportation',
      icon: <Car className="w-4 h-4" />,
      score: 7,
      description: 'Public transport and shared rides recommended',
      tips: ['Use local buses and trains', 'Share cabs with other travelers', 'Consider cycling for short distances']
    },
    {
      category: 'Accommodation',
      icon: <Home className="w-4 h-4" />,
      score: 6,
      description: 'Eco-friendly hotels and homestays available',
      tips: ['Choose certified green hotels', 'Opt for homestays', 'Look for solar-powered accommodations']
    },
    {
      category: 'Food & Dining',
      icon: <Utensils className="w-4 h-4" />,
      score: 8,
      description: 'Local cuisine and organic options',
      tips: ['Try local vegetarian dishes', 'Visit farm-to-table restaurants', 'Avoid single-use plastics']
    },
    {
      category: 'Activities',
      icon: <TreePine className="w-4 h-4" />,
      score: 9,
      description: 'Nature-based and low-impact activities',
      tips: ['Choose hiking over motorized tours', 'Support local communities', 'Respect wildlife and nature']
    }
  ];

  const carbonFootprint = {
    transport: '2.5 kg CO2',
    accommodation: '1.8 kg CO2',
    activities: '0.7 kg CO2',
    food: '1.2 kg CO2',
    total: '6.2 kg CO2'
  };

  const ecoAlternatives = [
    {
      title: 'Use Public Transport',
      impact: 'Reduces CO2 by 40%',
      description: 'Take buses and trains instead of private cabs'
    },
    {
      title: 'Choose Eco Hotels',
      impact: 'Saves 30% energy',
      description: 'Stay at certified green accommodations'
    },
    {
      title: 'Eat Local Cuisine',
      impact: 'Reduces food miles',
      description: 'Support local farmers and reduce transportation emissions'
    },
    {
      title: 'Digital Tickets',
      impact: 'Zero paper waste',
      description: 'Use mobile tickets and digital maps'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Eco Score */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Trip Eco-Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-green-600">{ecoScore}/10</div>
                <div>
                  <Badge className={getEcoScoreColor(ecoScore)}>
                    {getEcoScoreLabel(ecoScore)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Your trip has a {getEcoScoreLabel(ecoScore).toLowerCase()} environmental impact
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl">🌱</div>
              <p className="text-xs text-gray-500">Eco-Friendly Trip</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Footprint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-green-600" />
            Carbon Footprint Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(carbonFootprint).map(([category, emission]) => (
              category !== 'total' && (
                <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="capitalize font-medium">{category}</span>
                  <span className="text-sm text-gray-600">{emission}</span>
                </div>
              )
            ))}
            <div className="border-t pt-2 flex justify-between items-center font-semibold">
              <span>Total Carbon Footprint</span>
              <span className="text-green-600">{carbonFootprint.total}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              💡 <strong>Good news!</strong> Your trip's carbon footprint is 25% lower than average similar trips.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eco Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ecoFactors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {factor.icon}
                    <span className="font-medium">{factor.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{factor.score}/10</div>
                    <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${factor.score * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                <div className="space-y-1">
                  {factor.tips.map((tip, tipIndex) => (
                    <p key={tipIndex} className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eco Alternatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Eco-Friendly Alternatives
          </CardTitle>
          <p className="text-sm text-gray-600">
            Make your trip even more sustainable with these suggestions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {ecoAlternatives.map((alternative, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-green-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{alternative.title}</h4>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {alternative.impact}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{alternative.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eco Achievements */}
      <Card className="bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-900/20 dark:to-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-green-800">Eco-Warrior Badge Earned! 🏆</h4>
              <p className="text-sm text-green-700">
                Your sustainable travel choices help protect the environment. Keep it up!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcoScoreIndicator;