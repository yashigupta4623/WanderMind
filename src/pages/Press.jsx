import React from 'react';
import { Newspaper, Download, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Press() {
  const pressReleases = [
    {
      id: 1,
      title: 'WanderMind Launches AI-Powered Travel Planning Platform',
      date: 'November 2024',
      excerpt: 'Revolutionary platform uses artificial intelligence to create personalized travel itineraries in seconds.',
      link: '#'
    },
    {
      id: 2,
      title: 'WanderMind Reaches 50,000 Active Users Milestone',
      date: 'October 2024',
      excerpt: 'Community-driven travel platform celebrates rapid growth and user satisfaction.',
      link: '#'
    },
    {
      id: 3,
      title: 'New Safety Features Empower Solo Travelers',
      date: 'September 2024',
      excerpt: 'WanderMind introduces comprehensive safety filters for women and solo travelers.',
      link: '#'
    },
  ];

  const mediaKit = [
    { name: 'Logo - Full Color', file: 'wandermind-logo-color.zip' },
    { name: 'Logo - Black & White', file: 'wandermind-logo-bw.zip' },
    { name: 'Brand Guidelines', file: 'brand-guidelines.pdf' },
    { name: 'Product Screenshots', file: 'product-screenshots.zip' },
  ];

  const inTheNews = [
    {
      publication: 'Tech Crunch',
      title: 'WanderMind: The AI Travel Planner That Actually Works',
      date: 'Nov 15, 2024'
    },
    {
      publication: 'Travel Weekly',
      title: 'How AI is Changing Travel Planning for Millennials',
      date: 'Nov 10, 2024'
    },
    {
      publication: 'Forbes',
      title: '5 Startups Revolutionizing the Travel Industry',
      date: 'Nov 5, 2024'
    },
    {
      publication: 'The Verge',
      title: 'WanderMind Uses Machine Learning to Plan Your Perfect Trip',
      date: 'Oct 28, 2024'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Press & Media
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Latest news, press releases, and media resources about WanderMind.
          </p>
        </div>

        {/* Press Releases */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map(release => (
              <div key={release.id} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {release.excerpt}
                    </p>
                  </div>
                  <Newspaper className="w-6 h-6 text-blue-600 flex-shrink-0" />
                </div>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Read Full Release <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* In the News */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">In the News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inTheNews.map((news, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {news.publication}
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {news.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Media Kit</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Download our brand assets, logos, and guidelines for media coverage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaKit.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
          <p className="mb-6">Have a question for our press team? We'd love to hear from you.</p>
          <a
            href="mailto:press@wandermind.com"
            className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            press@wandermind.com
          </a>
        </div>
      </div>
    </div>
  );
}
