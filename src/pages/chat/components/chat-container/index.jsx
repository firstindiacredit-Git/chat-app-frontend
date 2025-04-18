// import React from "react";

import { useEffect, useState } from "react";
import ChatHeader from "./components/chat-header/chatHeader";
import MessageBar from "./components/message-bar/messageBar";
import MessageContainer from "./components/message-container/messageContainer";
import { useAppStore } from "@/store";

const ChatContainer = () => {
  const { selectedChatType } = useAppStore();
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
      ${isMobileView ? 'fixed top-0 left-0 h-[100vh] w-[100vw] z-10' : 'md:static md:flex-1'}
      bg-[#1c1d25] flex flex-col
    `}>
      <ChatHeader />
      <MessageContainer />
      <div className="shadow border-t border-black bg-[#111b21]">
        <MessageBar />
      </div>
    </div>
  );
};

export default ChatContainer;
