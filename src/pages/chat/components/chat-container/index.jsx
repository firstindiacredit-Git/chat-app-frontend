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
    <div 
      className={`
        flex-1 flex flex-col h-full overflow-hidden
        ${isMobileView ? 'w-full' : 'md:w-auto'}
        duration-1000 transition-all
      `}
    >
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
