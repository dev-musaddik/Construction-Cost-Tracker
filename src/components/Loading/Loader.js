import React from 'react';

const Loader = () => {
  return (
    // We use "fixed inset-0" to make the loader a full-screen overlay.
    // The z-50 ensures it's on top of all other content.
    // backdrop-blur-sm creates a subtle blur effect on the content underneath.
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="relative w-24 h-24">
        {/* The innermost pulsing element */}
        <div className="absolute inset-4 w-auto h-auto rounded-full bg-blue-600 opacity-50 animate-pulse-glow transition-all duration-300"></div>
        
        {/* The middle ring that spins */}
        <div className="absolute inset-0 w-full h-full rounded-full border-[6px] border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin-slow transition-all duration-300"></div>
        
        {/* The outermost ring that also spins, but at a different rate */}
        <div className="absolute inset-0 w-full h-full rounded-full border-[6px] border-t-transparent border-b-transparent border-l-cyan-400 border-r-cyan-400 animate-spin-slow-reverse transition-all duration-300"></div>
      </div>
      
      <div className="mt-8 text-lg font-light text-gray-400">
        Loading...
      </div>

      {/* Tailwind CSS doesn't support custom keyframes directly, so we use a style tag. */}
      {/* For a real project, these could be moved to a CSS file. */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
            box-shadow: 0 0 0px #3b82f6;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
            box-shadow: 0 0 20px #2563eb, 0 0 40px #2563eb;
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
    
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }
    
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
    
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 4s linear infinite;
        }
      `}</style>
    </div>
  );
};


export default Loader;
