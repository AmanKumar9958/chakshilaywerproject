import React from 'react';
import { Loader2, Scale, Gavel, Shield } from 'lucide-react';

const LoadingOverlay = ({ message = "Processing...", type = "default" }) => {
  const getLoadingIcon = () => {
    switch (type) {
      case 'legal':
        return <Scale className="w-8 h-8 text-[#b69d74] animate-pulse" />;
      case 'processing':
        return <Gavel className="w-8 h-8 text-[#b69d74] animate-bounce" />;
      case 'security':
        return <Shield className="w-8 h-8 text-[#b69d74] animate-pulse" />;
      default:
        return <Loader2 className="w-8 h-8 text-[#b69d74] animate-spin" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Enhanced Background with Professional Cream & Gold Theme */}
      <div className="absolute inset-0 bg-[#f5f5ef]/95 backdrop-blur-sm">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-r from-[#b69d74]/20 to-[#b69d74]/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-r from-[#b69d74]/10 to-[#b69d74]/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-r from-[#b69d74]/15 to-[#b69d74]/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#b69d7410_1px,transparent_1px),linear-gradient(to_bottom,#b69d7410_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-[#b69d74]/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 6}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Loading Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="bg-white/80 backdrop-blur-sm border border-[#b69d7440] rounded-2xl p-6 md:p-12 flex flex-col items-center max-w-sm md:max-w-md w-full mx-auto shadow-lg hover:shadow-xl hover:border-[#b69d7460] transition-all duration-300">
          {/* Loading Icon Container */}
          <div className="relative mb-6 md:mb-8 hover:scale-105 transition-transform duration-300">
            {/* Outer Ring */}
            <div className="w-16 md:w-24 h-16 md:h-24 border-2 md:border-4 border-[#b69d7440] rounded-full animate-pulse hover:border-[#b69d7460] transition-colors duration-300"></div>
            {/* Inner Ring */}
            <div className="absolute inset-1 md:inset-2 w-14 md:w-20 h-14 md:h-20 border-2 md:border-4 border-t-[#b69d74] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="scale-75 md:scale-100">
                {getLoadingIcon()}
              </div>
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-[#b69d74]/20 to-[#b69d74]/10 rounded-full blur-lg animate-pulse"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center px-2">
            <h3 className="text-base md:text-xl font-semibold text-[#1f2839] mb-2 animate-pulse">
              {message}
            </h3>
            <p className="text-[#6b7280] text-xs md:text-sm leading-relaxed">
              Please wait while we process your request
            </p>
          </div>
          
          {/* Progress Dots */}
          <div className="flex space-x-2 mt-4 md:mt-6">
            <div className="w-2 h-2 bg-[#b69d74] rounded-full animate-bounce hover:bg-[#b69d74]/80 transition-colors duration-200" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#b69d74] rounded-full animate-bounce hover:bg-[#b69d74]/80 transition-colors duration-200" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#b69d74] rounded-full animate-bounce hover:bg-[#b69d74]/80 transition-colors duration-200" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          {/* Professional Loading Bar */}
          <div className="w-full mt-6 md:mt-8 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-full bg-[#b69d7420] rounded-full h-1 overflow-hidden hover:bg-[#b69d7430] transition-colors duration-300">
              <div className="h-full bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Legal Branding */}
          <div className="mt-6 md:mt-8 flex items-center gap-2 px-4 py-2 bg-white/60 border border-[#b69d7440] rounded-full">
            <div className="w-6 h-6 bg-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB) rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="text-xs font-medium text-[#1f2839]">Chakshi Legal AI Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;