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

  return (
    <>
      {/* Full-width horizontal line */}
      <div className="w-full">
        <hr className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>

      {/* Footer Content */}
      <div className="w-full flex flex-col items-center justify-center py-4">
        <p className="font-semibold text-lg text-gray-600">Made by Flux ⚡</p>
        <div className="flex items-center justify-center gap-5 mt-2">
          {socialIcons.map((item, index) => (
            <Link 
              key={index} 
              to={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 dark:text-gray-400 hover:text-[#2196f3] dark:hover:text-[#42a5f5] transition-colors transform hover:scale-110"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Footer;
