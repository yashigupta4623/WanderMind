import React from "react";
import { Link } from "react-router-dom";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillMail,
  AiFillTwitterCircle,
} from "react-icons/ai";

const footerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 0',
  backgroundColor: '#fff',
  borderTop: '1px solid #d1d1d1',
};

const socialIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.25rem',
  marginTop: '0.5rem',
};

const mainContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '2vh',
};

const Footer = () => {
  const socialIcons = [
    { name: "GitHub", icon: <AiFillGithub />, link: "https://github.com/yashigupta4623" },
    { name: "Linkedin", icon: <AiFillLinkedin />, link: "https://www.linkedin.com/in/yashi-gupta-a65218232/" },
    { name: "Instagram", icon: <AiFillInstagram />, link: "https://www.instagram.com/probablyashi/" },
    { name: "Mail", icon: <AiFillMail />, link: "mailto:yashig406@gmail.com" },
    { name: "Twitter", icon: <AiFillTwitterCircle />, link: "https://twitter.com/yashig406" },
  ];

  return (
    <div style={mainContainerStyle} className="p-8">
      {/* Other components */}
      <div style={{ marginTop: 'auto' }}>
        <hr style={{ width: '100%', borderTop: '1px solid #d1d1d1' }} />
        <div style={footerStyle}>
          <p style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#4a4a4a' }}>
            Made by Yashi Gupta🪽
          </p>
          <div style={socialIconStyle}>
            {socialIcons.map((item, index) => (
              <Link key={index} to={item.link} target="_blank" rel="noopener noreferrer">
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
