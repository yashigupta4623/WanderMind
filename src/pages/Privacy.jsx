import React from 'react';
import { Shield, Lock, Eye, Database, Users, Clock } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Information We Collect',
      content: `We collect information you provide directly, such as when you create an account, plan a trip, or contact us. This includes:
      • Name, email address, and password
      • Travel preferences and trip details
      • Payment information (processed securely)
      • Communication preferences
      • Device and usage information`
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'How We Use Your Information',
      content: `We use your information to:
      • Provide and improve our services
      • Personalize your experience
      • Send you updates and marketing communications
      • Process payments and prevent fraud
      • Comply with legal obligations
      • Analyze usage patterns and trends`
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your data:
      • Encryption of data in transit and at rest
      • Secure authentication mechanisms
      • Regular security audits
      • Limited access to personal information
      • Compliance with GDPR and CCPA regulations`
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Third-Party Sharing',
      content: `We do not sell your personal information. We may share data with:
      • Service providers (payment processors, analytics)
      • Legal authorities (when required by law)
      • Business partners (with your consent)
      • Aggregate, anonymized data for research`
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Data Retention',
      content: `We retain your information for as long as necessary to provide services:
      • Account data: Until you delete your account
      • Trip information: For 7 years (for records)
      • Marketing data: Until you unsubscribe
      • You can request deletion anytime`
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Your Rights',
      content: `You have the right to:
      • Access your personal information
      • Correct inaccurate data
      • Delete your account and data
      • Opt-out of marketing communications
      • Data portability
      • Lodge complaints with authorities`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: November 2024
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Essential Cookies:</strong> Required for site functionality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Analytics Cookies:</strong> Help us understand usage patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Marketing Cookies:</strong> Used for personalized ads</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              WanderMind is not intended for users under 13. We do not knowingly collect information from children under 13. If we become aware of such collection, we will delete the information promptly.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this policy from time to time. We will notify you of significant changes via email or through our website. Your continued use of WanderMind constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have questions about this privacy policy or our practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><strong>Email:</strong> privacy@wandermind.com</p>
              <p><strong>Address:</strong> San Francisco, CA 94105, USA</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
