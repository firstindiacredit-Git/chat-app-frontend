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
      flex flex-col relative
    `}>
      <div></div>
      <img src="./assets/background.png" alt="" />
      <ChatHeader />
      <div className={`flex-1 overflow-y-auto ${isMobileView ? 'pb-16' : ''}`}>
        <MessageContainer />
      </div>
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
