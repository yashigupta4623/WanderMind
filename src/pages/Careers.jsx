import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Users, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Senior AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120K - $160K',
      description: 'Build and improve our AI recommendation engine. Work with cutting-edge machine learning technologies.',
      requirements: ['5+ years ML experience', 'Python expertise', 'NLP knowledge', 'Team leadership']
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100K - $140K',
      description: 'Develop our web and mobile platforms. Create beautiful, performant user experiences.',
      requirements: ['React/Vue expertise', 'Node.js knowledge', 'Database design', 'API development']
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$130K - $170K',
      description: 'Lead product strategy and roadmap. Work with engineering and design teams.',
      requirements: ['5+ years PM experience', 'Travel industry knowledge', 'Data analysis', 'Leadership']
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90K - $130K',
      description: 'Design beautiful interfaces for our travel platform. Create delightful user experiences.',
      requirements: ['Figma expertise', 'Design systems', 'User research', 'Prototyping']
    },
    {
      id: 5,
      title: 'Content Writer',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$60K - $90K',
      description: 'Create engaging content about travel, tips, and destinations.',
      requirements: ['Excellent writing skills', 'SEO knowledge', 'Travel passion', 'Social media']
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70K - $100K',
      description: 'Help our users succeed. Build relationships and gather feedback.',
      requirements: ['Customer service experience', 'Communication skills', 'Problem solving', 'Empathy']
    },
  ];

  const benefits = [
    'Competitive salary & equity',
    'Health insurance',
    'Unlimited PTO',
    'Remote-first culture',
    'Learning budget',
    'Team travel experiences',
    'Flexible hours',
    'Career growth'
  ];

  const handleApply = () => {
    toast.success('Application submitted! We\'ll review and get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Join Our Team
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help us revolutionize travel planning. We're looking for passionate people who love travel and technology.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Why Join WanderMind?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Open Positions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job List */}
            <div className="lg:col-span-1 space-y-4">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedJob?.id === job.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:shadow-md'
                  }`}
                >
                  <h3 className="font-bold mb-2">{job.title}</h3>
                  <p className={`text-sm ${selectedJob?.id === job.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {job.location}
                  </p>
                </button>
              ))}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4" />
                        {selectedJob.type}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        {selectedJob.salary}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">About the Role</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedJob.description}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <span className="text-blue-600 font-bold">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm text-center">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Select a position to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Don't see your role?</h2>
          <p className="mb-6">We're always looking for talented people. Send us your resume and tell us what you'd like to do.</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100">
            Send Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
