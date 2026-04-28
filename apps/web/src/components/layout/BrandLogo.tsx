import React from 'react';

export default function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-[#00D2FF]/20 blur-xl rounded-full opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full text-[#00D2FF] relative z-10 filter drop-shadow-[0_0_5px_rgba(0,210,255,0.6)]">
        {/* Outer Ring with breaks */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="60 4 15 4" className="opacity-40" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 1" className="opacity-60" />
        
        {/* Inner Compass Ring */}
        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Cardinal Markers - More stylized like the logo */}
        <text x="50" y="14" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="900" className="font-sans italic select-none">R</text>
        <text x="10" y="55" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="900" className="font-sans italic select-none">N</text>
        <text x="90" y="55" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="900" className="font-sans italic select-none">H</text>
        
        {/* Bottom Pointer / Upward Triangle */}
        <path 
          d="M50 90 L58 80 L50 82 L42 80 Z" 
          fill="currentColor"
        />

        {/* The 8-Pointed Star / Compass Rose */}
        {/* Main large points */}
        <path 
          d="M50 18 L58 42 L82 50 L58 58 L50 82 L42 58 L18 50 L42 42 Z" 
          fill="currentColor"
          className="drop-shadow-[0_0_10px_rgba(0,210,255,0.9)]"
        />
        {/* Small diagonal points */}
        <path 
          d="M50 50 L65 35 M50 50 L65 65 M50 50 L35 65 M50 50 L35 35" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        
        {/* Center Compass Needle Detail */}
        <path 
          d="M50 35 L54 50 L50 65 L46 50 Z" 
          fill="#010A14" 
          stroke="currentColor" 
          strokeWidth="1"
        />
        
        {/* Waveform Element (Bottom Right) */}
        <path 
          d="M62 78 L66 78 L68 72 L72 84 L76 72 L78 78 L82 78" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-90"
        />
        
        {/* Center Point */}
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}
