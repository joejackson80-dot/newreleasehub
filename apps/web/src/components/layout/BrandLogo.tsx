import React from 'react';

export default function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-[#F1F5F9]/20 blur-xl rounded-full opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500" />
      
      <img 
        src="/images/nrh-logo.png" 
        alt="NRH Logo" 
        className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(241,245,249,0.3)]"
      />
    </div>
  );
}


