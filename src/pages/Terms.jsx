import React from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Zap } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: '1. Acceptance of Terms',
      content: `By accessing and using WanderMind, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: '2. Use License',
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on WanderMind for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      • Modify or copy the materials
      • Use the materials for any commercial purpose
      • Attempt to decompile or reverse engineer any software
      • Remove any copyright or proprietary notations
      • Transfer the materials to another person or "mirror" the materials on any other server`
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: '3. Disclaimer',
      content: `The materials on WanderMind are provided on an 'as is' basis. WanderMind makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      title: '4. Limitations',
      content: `In no event shall WanderMind or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WanderMind, even if WanderMind or an authorized representative has been notified orally or in writing of the possibility of such damage.`
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: '5. Accuracy of Materials',
      content: `The materials appearing on WanderMind could include technical, typographical, or photographic errors. WanderMind does not warrant that any of the materials on its website are accurate, complete, or current. WanderMind may make changes to the materials contained on its website at any time without notice.`
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '6. Links',
      content: `WanderMind has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by WanderMind of the site. Use of any such linked website is at the user's own risk.`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please read these terms carefully before using WanderMind.
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Modifications</h2>
            <p className="text-gray-600 dark:text-gray-300">
              WanderMind may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-300">
              These terms and conditions are governed by and construed in accordance with the laws of California, and you irrevocably submit to the exclusive jurisdiction of the courts located in San Francisco, California.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you create an account with WanderMind, you must provide accurate and complete information. You are responsible for:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Maintaining the confidentiality of your password</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>All activities that occur under your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Notifying us of unauthorized access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Complying with all applicable laws</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Prohibited Activities</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Harass, threaten, or abuse other users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Engage in any form of fraud or deception</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Violate any applicable laws or regulations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Attempt to gain unauthorized access to systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Post spam, malware, or harmful content</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><strong>Email:</strong> legal@wandermind.com</p>
              <p><strong>Address:</strong> San Francisco, CA 94105, USA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
