import LottieAnimation from "@/components/common/lottie-animation";
import { useState, useEffect } from "react";

const EmptyChatContainer = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className={`
      ${isMobileView ? 'hidden' : 'flex-1 md:bg-[#1c1d25] md:flex flex-col items-center justify-center overflow-hidden'} 
      duration-1000 transition-all
    `}>
      <div className="max-w-full px-4">
        <LottieAnimation />
        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-6 lg:text-3xl text-2xl transition-all duration-1000 text-center">
          <h3 className="poppins-medium">
            Hi
            <span className="text-purple-500">!</span> Welcome to
            &nbsp;
            <span style={{
              background: 'linear-gradient(to right,#f74271,#4a89fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}>
              Pizeonfly
            </span>
            &nbsp;
            Chat App<span className="text-purple-500">.</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
