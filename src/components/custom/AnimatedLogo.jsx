import React from 'react';

const AnimatedLogo = ({ className = "w-8 h-8 sm:w-10 sm:h-10" }) => {
  return (
    <div className={`${className} relative`}>
      {/* Animated SVG Logo matching the provided image */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-float"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        
        {/* Globe Base Circle */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="#60A5FA"
          stroke="#1E40AF"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        
        {/* Continents - Green shapes */}
        <path
          d="M 35 35 Q 45 30 55 35 Q 60 40 55 50 Q 50 55 40 50 Q 30 45 35 35 Z"
          fill="url(#greenGradient)"
          className="animate-pulse"
          style={{ animationDuration: '3s', animationDelay: '0.5s' }}
        />
        
        <path
          d="M 60 45 Q 70 40 75 50 Q 70 60 65 55 Q 55 50 60 45 Z"
          fill="url(#greenGradient)"
          className="animate-pulse"
          style={{ animationDuration: '3s', animationDelay: '1s' }}
        />
        
        <path
          d="M 30 60 Q 40 65 45 70 Q 35 75 25 70 Q 25 65 30 60 Z"
          fill="url(#greenGradient)"
          className="animate-pulse"
          style={{ animationDuration: '3s', animationDelay: '1.5s' }}
        />
        
        {/* Globe outline */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#1E40AF"
          strokeWidth="2"
        />
        
        {/* Animated Orbital Path */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#374151"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.6"
          className="animate-spin"
          style={{ 
            transformOrigin: '50px 50px',
            animationDuration: '12s'
          }}
        />
        
        {/* Animated Airplane */}
        <g 
          className="animate-spin" 
          style={{ 
            transformOrigin: '50px 50px', 
            animationDuration: '6s'
          }}
        >
          {/* Airplane body */}
          <g transform="translate(90, 50)">
            <path
              d="M -8 0 L -2 -3 L 4 -1 L 6 0 L 4 1 L -2 3 Z"
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
            {/* Wings */}
            <path
              d="M -4 -1 L -1 -4 L 2 -2 L -1 0 Z"
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
            <path
              d="M -4 1 L -1 4 L 2 2 L -1 0 Z"
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
            {/* Tail */}
            <path
              d="M -6 0 L -8 -2 L -7 0 L -8 2 Z"
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
          </g>
        </g>
        
        {/* Travel trail dots */}
        <g 
          className="animate-spin" 
          style={{ 
            transformOrigin: '50px 50px', 
            animationDuration: '6s'
          }}
        >
          <circle cx="85" cy="45" r="1.5" fill="#F59E0B" className="animate-ping" style={{ animationDelay: '0s' }} />
          <circle cx="80" cy="40" r="1" fill="#F59E0B" opacity="0.7" />
          <circle cx="75" cy="35" r="0.8" fill="#F59E0B" opacity="0.5" />
        </g>
      </svg>
      
      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full animate-ping opacity-40"
          style={{ 
            top: '15%', 
            left: '85%', 
            animationDelay: '2s',
            animationDuration: '3s'
          }}
        ></div>
        <div 
          className="absolute w-0.5 h-0.5 bg-green-400 rounded-full animate-ping opacity-40"
          style={{ 
            top: '80%', 
            left: '20%', 
            animationDelay: '4s',
            animationDuration: '3s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedLogo;