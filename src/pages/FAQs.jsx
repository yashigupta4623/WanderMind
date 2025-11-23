import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button on the homepage, enter your email and password, and follow the verification steps. You can also sign up with Google for faster registration.'
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'Is WanderMind free to use?',
      answer: 'Yes! WanderMind is completely free to use for creating and planning trips. We may offer premium features in the future, but basic trip planning will always be free.'
    },
    {
      id: 3,
      category: 'Trip Planning',
      question: 'How does the AI generate trip itineraries?',
      answer: 'Our AI analyzes your preferences, budget, travel style, and selected activities to create personalized itineraries. It considers factors like travel time, opening hours, and ratings to suggest the best experiences.'
    },
    {
      id: 4,
      category: 'Trip Planning',
      question: 'Can I customize the AI-generated itinerary?',
      answer: 'Absolutely! You can edit, add, or remove activities, change timings, swap hotels, and modify any aspect of your trip. The AI suggestions are just starting points.'
    },
    {
      id: 5,
      category: 'Trip Planning',
      question: 'How many days can I plan for?',
      answer: 'You can plan trips from 1 day to 30 days or more. Our AI works best with trips between 3-14 days, but you can create longer itineraries by combining multiple trips.'
    },
    {
      id: 6,
      category: 'Preferences & Learning',
      question: 'How does preference learning work?',
      answer: 'As you create trips and interact with recommendations, our AI learns your preferences. Over time, it understands your favorite activities, accommodation types, and travel style to provide better suggestions.'
    },
    {
      id: 7,
      category: 'Preferences & Learning',
      question: 'Can I delete my preferences?',
      answer: 'Yes, you can reset your learned preferences anytime in your account settings. This will remove all learning data and start fresh.'
    },
    {
      id: 8,
      category: 'Safety & Security',
      question: 'How is my data protected?',
      answer: 'We use industry-standard encryption, secure authentication, and regular security audits. Your personal information is never shared with third parties without consent.'
    },
    {
      id: 9,
      category: 'Safety & Security',
      question: 'What safety features are available?',
      answer: 'WanderMind offers safety filters for women travelers, accessibility needs, family-friendly options, and crowd preferences. These help generate itineraries that match your safety requirements.'
    },
    {
      id: 10,
      category: 'Bookings & Payments',
      question: 'Can I book hotels and flights through WanderMind?',
      answer: 'Currently, WanderMind helps you plan your trip. We provide recommendations and links to booking partners. Direct booking features are coming soon.'
    },
    {
      id: 11,
      category: 'Bookings & Payments',
      question: 'Do you charge for bookings?',
      answer: 'No, WanderMind doesn\'t charge for bookings. If you book through our partner links, you pay the same price as booking directly.'
    },
    {
      id: 12,
      category: 'Technical Support',
      question: 'What if the AI generates incorrect information?',
      answer: 'While our AI is highly accurate, mistakes can happen. Please report any errors through the feedback form, and our team will investigate and improve our data.'
    },
    {
      id: 13,
      category: 'Technical Support',
      question: 'Does WanderMind work offline?',
      answer: 'WanderMind requires an internet connection to generate itineraries and access real-time information. However, you can view saved trips offline.'
    },
    {
      id: 14,
      category: 'Technical Support',
      question: 'Which devices does WanderMind support?',
      answer: 'WanderMind works on all modern browsers (Chrome, Firefox, Safari, Edge) and is optimized for mobile devices. A native app is coming soon.'
    },
    {
      id: 15,
      category: 'Account Management',
      question: 'How do I delete my account?',
      answer: 'Go to Settings > Account > Delete Account. Your data will be permanently deleted within 30 days. You can request immediate deletion by contacting support.'
    },
  ];

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about WanderMind and how to use it.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-2xl mx-auto mb-12 flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-start justify-between gap-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{faq.question}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === faq.id && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No FAQs found. Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
