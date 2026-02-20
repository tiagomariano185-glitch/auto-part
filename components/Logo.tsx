
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", showText = true, lightText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0 group">
        {/* Gear and Shield Background */}
        <svg 
          viewBox="0 0 100 100" 
          className="h-full w-auto drop-shadow-xl transform transition-transform duration-500 group-hover:rotate-45"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Shield Hexagon */}
          <path 
            d="M50 5L88.9711 27.5V72.5L50 95L11.0289 72.5V27.5L50 5Z" 
            className="fill-slate-900 stroke-orange-600" 
            strokeWidth="4"
          />
          
          {/* Inner Gear */}
          <circle cx="50" cy="50" r="30" className="stroke-slate-700" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Stylized Piston / Wrench Icon */}
          <g className="fill-orange-600">
            <rect x="44" y="35" width="12" height="35" rx="2" />
            <circle cx="50" cy="35" r="12" />
            <circle cx="50" cy="35" r="5" className="fill-slate-900" />
            <rect x="42" y="70" width="16" height="6" rx="1" />
          </g>
          
          {/* Shine effect */}
          <path 
            d="M25 25L40 40" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="opacity-20"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-2xl font-black tracking-tighter uppercase ${lightText ? 'text-white' : 'text-slate-900'}`}>
            Autocar<span className="text-orange-600">Express</span>
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-[0.25em] ${lightText ? 'text-slate-400' : 'text-slate-500'}`}>
            Desmanche Especializado
          </span>
        </div>
      )}
    </div>
  );
};
