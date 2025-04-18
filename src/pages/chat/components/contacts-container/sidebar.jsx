import { useState, useEffect, useRef } from "react";
import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info/profile";
import apiClient from "@/lib/api-client";
import './index.css';
import './modal.css';
import {
  GET_CONTACTS_WITH_MESSAGES_ROUTE,
  GET_USER_CHANNELS,
} from "@/lib/constants";
import { useAppStore } from "@/store";
import NewDM from "./components/new-dm/new-dm";
import CreateChannel from "./components/create-channel/create-channel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, MessageSquarePlus, Users } from "lucide-react";

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    userInfo,
    selectedChatType,
    setSelectedChatType,
    showRegistrationForm,
    setShowRegistrationForm
  } = useAppStore();

  const [activeSection, setActiveSection] = useState('directMessages');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const newDMRef = useRef(null);
  const createChannelRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      
      // On mobile, hide sidebar when chat is selected
      if (mobile && (selectedChatType || showRegistrationForm)) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChatType, showRegistrationForm]);

  // Hide sidebar when chat is selected on mobile
  useEffect(() => {
    if (isMobileView && (selectedChatType || showRegistrationForm)) {
      setSidebarVisible(false);
    }
  }, [selectedChatType, isMobileView, showRegistrationForm]);

  useEffect(() => {
    const getContactsWithMessages = async () => {
      const response = await apiClient.get(GET_CONTACTS_WITH_MESSAGES_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    getContactsWithMessages();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getChannels();
  }, [setChannels]);

  const openRegistrationForm = () => {
    setSelectedChatType(undefined); // Close any open chat
    setShowRegistrationForm(true);
  };
  
  // Back button for mobile view
  const handleBackToSidebar = () => {
    setSidebarVisible(true);
    if (isMobileView) {
      setSelectedChatType(undefined);
      setShowRegistrationForm(false);
    }
  };

  // Show back button on mobile when sidebar is hidden
  if (isMobileView && !sidebarVisible) {
    return (
      <div className="fixed z-30 top-3 left-3">
        <Button 
          onClick={handleBackToSidebar} 
          className="rounded-full h-10 w-10 p-0 bg-[#111b21] hover:bg-[#2a3942] text-white"
        >
          <ArrowLeft size={20} />
        </Button>
      </div>
    );
  }

  // Main sidebar component
  return (
    <div className={`
      ${isMobileView ? 'fixed top-0 left-0 h-full z-20' : 'relative'} 
      ${isMobileView && !sidebarVisible ? 'hidden' : 'block'} 
      md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full 
      max-h-screen overflow-hidden flex flex-col bg-[#111b21] border-r border-black
      transition-all duration-300
    `}>
      {/* Header */}
      <div className="pt-0 shrink-0">
        <Logo />
        <div className="w-full h-[1px] bg-[#111b21] -mt-1.9"></div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-col px-2 shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className={`relative cursor-pointer flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                activeSection === 'directMessages' 
                  ? 'text-white bg-[#2a3942]' 
                  : 'text-gray-400 hover:bg-[#2a3942]'
              }`}
              onClick={() => setActiveSection('directMessages')}
            >
              <Title text="Messages" active={activeSection === 'directMessages'} />
              <div ref={newDMRef}>
                <NewDM />
              </div>
            </div>
            <div 
              className={`relative cursor-pointer flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                activeSection === 'groups' 
                  ? 'text-white bg-[#2a3942]' 
                  : 'text-gray-400 hover:bg-[#2a3942]'
              }`}
              onClick={() => setActiveSection('groups')}
            >
              <Title text="Groups" active={activeSection === 'groups'} />
              <div ref={createChannelRef}>
                <CreateChannel />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {activeSection === 'directMessages' && (
            <div className="mt-2 w-full">
              <NewDM 
                buttonClass="w-full bg-[#2a3942] text-[#e9edef] hover:bg-[#374b57] border-none h-10 flex gap-2 items-center justify-center rounded-md"
                buttonText={
                  <>
                    <MessageSquarePlus size={16} />
                    <span>Add New Message</span>
                  </>
                } 
              />
            </div>
          )}
          {activeSection === 'groups' && (
            <div className="mt-2 w-full">
              <CreateChannel 
                buttonClass="w-full bg-[#2a3942] text-[#e9edef] hover:bg-[#374b57] border-none h-10 flex gap-2 items-center justify-center rounded-md"
                buttonText={
                  <>
                    <Users size={16} />
                    <span>Create New Group</span>
                  </>
                }
              />
            </div>
          )}
        </div>

        {/* Contact List - Make this flex-grow to push footer to bottom */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-2 pb-2">
          {activeSection === 'directMessages' && (
            <div className="h-full">
              <ContactList contacts={directMessagesContacts} />
            </div>
          )}
          {activeSection === 'groups' && (
            <div className="h-full">
              <ContactList contacts={channels} isChannel />
            </div>
          )}
        </div>

        {/* Admin Register Button - Before Profile */}
        {userInfo.role === "admin" && (
          <div className="px-4 py-2 border-t border-[#2a3942] flex justify-center shrink-0">
            <Button 
              onClick={openRegistrationForm} 
              variant="outline"
              className="w-full bg-[#2a3942] text-[#e9edef] hover:bg-[#374b57] border-none h-10 flex gap-2 items-center justify-center rounded-md"
            >
              <UserPlus size={16} />
              <span>Register User</span>
            </Button>
          </div>
        )}

        {/* Footer Section - Always at bottom */}
        <div className="shrink-0 border-t border-[#2a3942] w-full bg-[#111b21]">
          <ProfileInfo />
        </div>
      </div>
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text, active }) => {
  return (
    <h6 className={`uppercase tracking-widest font-medium text-sm ${
      active ? 'text-blue-500' : 'text-gray-400'
    }`}>
      {text}
    </h6>
  );
};
