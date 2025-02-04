import React from "react";
import { Button } from "../ui/button";
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
    {
      name: "GitHub",
      icon: <AiFillGithub />,
      link: "https://github.com/yashigupta4623",
    },
    {
      name: "Linkedin",
      icon: <AiFillLinkedin />,
      link: "https://www.linkedin.com/in/yashi-gupta-a65218232/",
    },
    {
      name: "Instagram",
      icon: <AiFillInstagram />,
      link: "https://www.instagram.com/probablyashi/",
    },
    {
      name: "Mail",
      icon: <AiFillMail />,
      link: "mailto:yashig406@gmail.com",
    },
    {
      name: "Twitter",
      icon: <AiFillTwitterCircle />,
      link: "https://twitter.com/yashig406",
    },
  ];

  return (
    <div className="footer w-full flex flex-col text-muted-foreground items-center justify-center md:p-4 py-2 border-t">
      <p className="sm:font-semibold sm:text-lg bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Made by WanderMind ♥️
      </p>
      <div className="logos flex items-center justify-center gap-5 w-full">
        {socialIcons.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Footer;
