import React from 'react';

const Loader = () => {
  // We define a custom keyframe animation for a pulsing, glowing effect.
  // This is embedded directly in the component for a self-contained unit.
  const styleSheet = `
    @keyframes pulse-glow {
      0% {
        transform: scale(1);
        opacity: 0.5;
        box-shadow: 0 0 0px #3b82f6;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 0 20px #2563eb, 0 0 40px #2563eb;
      }
      100% {
        transform: scale(1);
        opacity: 0.5;
        box-shadow: 0 0 0px #3b82f6;
      }
    }

    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes spin-slow-reverse {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }

    .spinner-glow {
      animation: pulse-glow 2s infinite ease-in-out;
    }

    .spinner-spin {
      animation: spin-slow 3s linear infinite;
    }

    .spinner-spin-reverse {
      animation: spin-slow-reverse 4s linear infinite;
    }
  `;

  return (
    // The min-h-screen ensures the loader is centered in the viewport.
    // The background is now set to a semi-transparent black using Tailwind's rgba class.
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent font-sans text-white">
      {/* The main container for the loader's rings */}
      <div className="relative w-24 h-24">
        {/* The innermost pulsing element with a glowing effect */}
        <div className="
          absolute inset-4
          w-auto h-auto
          rounded-full
          bg-blue-600
          opacity-50
          spinner-glow
          transform
          transition-all duration-300
        "></div>
        
        {/* The middle ring that spins */}
        <div className="
          absolute inset-0
          w-full h-full
          rounded-full
          border-[6px] border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent
          spinner-spin
          transform
          transition-all duration-300
        "></div>
        
        {/* The outermost ring that also spins, but at a different rate */}
        <div className="
          absolute inset-0
          w-full h-full
          rounded-full
          border-[6px] border-t-transparent border-b-transparent border-l-cyan-400 border-r-cyan-400
          spinner-spin-reverse
          transform
          transition-all duration-300
        "></div>
      </div>
      
      {/* A loading message for better user feedback */}
      <div className="mt-8 text-lg font-light text-gray-400">
        Loading...
      </div>
      
      {/* Injecting the custom keyframes and animations */}
      <style>{styleSheet}</style>
    </div>
  );
};

export default Loader;
