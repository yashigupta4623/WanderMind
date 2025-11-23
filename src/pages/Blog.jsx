import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const posts = [
    {
      id: 1,
      title: '10 Hidden Gems in Southeast Asia You Must Visit',
      excerpt: 'Discover the best-kept secrets of Southeast Asia that most tourists miss. From hidden beaches to local markets...',
      category: 'Destinations',
      author: 'Sarah Chen',
      date: 'Nov 20, 2024',
      image: '🏝️',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'How AI is Revolutionizing Travel Planning',
      excerpt: 'Learn how artificial intelligence is changing the way we plan trips and discover new destinations...',
      category: 'Technology',
      author: 'Alex Kumar',
      date: 'Nov 18, 2024',
      image: '🤖',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Budget Travel Tips: Explore Europe on $50/Day',
      excerpt: 'Practical tips and tricks to travel across Europe without breaking the bank. Hostels, street food, and more...',
      category: 'Budget Travel',
      author: 'Emma Wilson',
      date: 'Nov 15, 2024',
      image: '💰',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Sustainable Tourism: Travel Responsibly',
      excerpt: 'How to minimize your environmental impact while traveling and support local communities...',
      category: 'Sustainability',
      author: 'Marcus Green',
      date: 'Nov 12, 2024',
      image: '🌍',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'The Best Time to Visit Popular Destinations',
      excerpt: 'Avoid crowds and get the best experience by visiting destinations during their ideal seasons...',
      category: 'Travel Tips',
      author: 'Lisa Anderson',
      date: 'Nov 10, 2024',
      image: '📅',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Food Tourism: Culinary Adventures Around the World',
      excerpt: 'Explore the world through its cuisine. Street food, fine dining, and cooking classes...',
      category: 'Food & Culture',
      author: 'Chef Marco',
      date: 'Nov 8, 2024',
      image: '🍜',
      readTime: '6 min read'
    },
  ];

  const categories = ['all', 'Destinations', 'Technology', 'Budget Travel', 'Sustainability', 'Travel Tips', 'Food & Culture'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Travel Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover travel tips, destination guides, and stories from around the world.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-6xl">
                {post.image}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{post.category}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Read <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Get the latest travel tips and destination guides delivered to your inbox.</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-white text-gray-900"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
