import React, { useState, useEffect } from 'react';
import Logo from './assets/icons/Logo';


const AnimatedLoading: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingText, setLoadingText] = useState('Loading');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent overlay - you can adjust opacity or remove entirely */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Loading content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      {/* Main loading container */}
      <div className="relative flex flex-col items-center space-y-8">
        
        {/* Outer spinning ring */}
        <div className="relative">
          <div className="absolute inset-0 w-32 h-32 border-4 border-white/30 rounded-full animate-spin border-t-white"></div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 w-28 h-28 border-2 border-white/40 rounded-full animate-pulse"></div>
          
          {/* Logo container with floating animation */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="animate-bounce">
              <div className="animate-pulse">
                <Logo 
                  size={60} 
                  color="white" 
                  fillColor="white"
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Animated dots around logo */}
        <div className="absolute inset-0 w-32 h-32 mx-auto">
          <div className="absolute w-3 h-3 bg-white rounded-full animate-ping top-0 left-1/2 transform -translate-x-1/2 opacity-75"></div>
          <div className="absolute w-2 h-2 bg-white/80 rounded-full animate-ping top-4 right-4 animation-delay-200 opacity-60"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full animate-ping bottom-4 left-4 animation-delay-400 opacity-60"></div>
          <div className="absolute w-3 h-3 bg-white/80 rounded-full animate-ping bottom-0 right-1/2 transform translate-x-1/2 animation-delay-600 opacity-75"></div>
        </div>



        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-sm">
          <div className="h-full bg-white rounded-full animate-progress opacity-80"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-1 h-1 bg-white/60 rounded-full animate-float-1 top-16 left-8"></div>
          <div className="absolute w-1 h-1 bg-white/70 rounded-full animate-float-2 top-24 right-12"></div>
          <div className="absolute w-1 h-1 bg-white/50 rounded-full animate-float-3 bottom-20 left-16"></div>
          <div className="absolute w-1 h-1 bg-white/60 rounded-full animate-float-4 bottom-32 right-8"></div>
        </div>
      </div>
      </div>
    </div>

    <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-5px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(15px) translateX(8px); }
          75% { transform: translateY(-10px) translateX(-12px); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          40% { transform: translateY(-25px) translateX(5px); }
          80% { transform: translateY(5px) translateX(-10px); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 3s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
        
        .animate-float-4 {
          animation: float-4 3.5s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 2s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
    
  );
};

export default AnimatedLoading;