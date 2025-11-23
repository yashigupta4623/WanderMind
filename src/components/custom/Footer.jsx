import React from "react";
import { Link } from "react-router-dom";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillMail,
  AiFillTwitterCircle,
} from "react-icons/ai";

function Footer() {
  const socialIcons = [
    { name: "GitHub", icon: <AiFillGithub />, link: "https://github.com/yashigupta4623" },
    { name: "Linkedin", icon: <AiFillLinkedin />, link: "https://www.linkedin.com/in/yashi-gupta-a65218232/" },
    { name: "Instagram", icon: <AiFillInstagram />, link: "https://www.instagram.com/probablyashi/" },
    { name: "Mail", icon: <AiFillMail />, link: "mailto:yashig406@gmail.com" },
    { name: "Twitter", icon: <AiFillTwitterCircle />, link: "https://twitter.com/yashig406" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Press", path: "/press" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "FAQs", path: "/faqs" },
      ]
    },
    {
      title: "More",
      links: [
        { name: "Airline Fees", path: "/airline-fees" },
        { name: "Airlines", path: "/airlines" },
        { name: "Low Fare Tips", path: "/tips" },
        { name: "Badges & Certificates", path: "/badges" },
      ]
    }
  ];

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 pt-10 pb-6 mt-10">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WanderMind
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Your AI-powered travel companion. Discover new destinations, plan your perfect trip, and create memories that last a lifetime.
            </p>
            <div className="flex items-center gap-3">
              {socialIcons.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform hover:scale-110"
                  aria-label={item.name}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} WanderMind. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Made with <span className="text-red-500 animate-pulse">❤</span> by Flux
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
