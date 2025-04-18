// import React from "react";

import { useEffect, useState } from "react";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container/sidebar";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyChatContainer from "./components/empty-chat-container";
import RegistrationFormContainer from "./components/registration-form-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    fileUploadProgress,
    isDownloading,
    downloadProgress,
    showRegistrationForm
  } = useAppStore();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Add overflow hidden to body to prevent double scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Restore body overflow when component unmounts
      document.body.style.overflow = '';
    };
  }, []);
  
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen w-screen text-white overflow-hidden bg-[#111b21] fixed inset-0">
      {/* Overlays for file operations */}
      {isUploading && (
        <div className="h-full w-full fixed top-0 z-50 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-full w-full fixed top-0 z-50 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {downloadProgress}%
        </div>
      )}
      
      {/* Chat components */}
      <ContactsContainer />
      
      {showRegistrationForm ? (
        <RegistrationFormContainer />
      ) : selectedChatType ? (
        <ChatContainer />
      ) : (
        <EmptyChatContainer />
      )}
    </div>
  );
};

export default Chat;
