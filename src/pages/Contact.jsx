import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      description: 'Send us an email anytime',
      value: 'support@wandermind.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      description: 'Call us during business hours',
      value: '+1 (555) 123-4567'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Address',
      description: 'Visit our office',
      value: 'San Francisco, CA 94105'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Hours',
      description: 'Monday - Friday',
      value: '9:00 AM - 6:00 PM PST'
    },
  ];

  const faqs = [
    {
      question: 'How quickly will I get a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.'
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! Call us at +1 (555) 123-4567 during business hours (9 AM - 6 PM PST).'
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Absolutely! Contact our sales team and we\'ll set up a personalized demo for you.'
    },
    {
      question: 'Do you have a support chat?',
      answer: 'Yes, our live chat is available on the website during business hours.'
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center">
              <div className="flex justify-center text-blue-600 dark:text-blue-400 mb-4">
                {method.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{method.description}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{method.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Info */}
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Contact Us?</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Get help with your account or trips</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Report bugs or technical issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Share feature requests and feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Discuss partnerships and collaborations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Join our team or inquire about careers</span>
                </li>
              </ul>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Answers</h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 cursor-pointer group">
                    <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                      {faq.question}
                      <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
