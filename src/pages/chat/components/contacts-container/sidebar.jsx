import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button"; // Import Button from your UI library
import Modal from "react-modal"; // Import react-modal
import AdminUserForm from "@/pages/auth/AdminRegistration";

Modal.setAppElement("#root"); // Set the app root for accessibility

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    userInfo,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal open/close
  const [activeSection, setActiveSection] = useState('directMessages'); // Add state for active section

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

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative md:w-[35vw] mb-28 lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full max-h-screen overflow-y-auto scrollbar-hidden ">
      {" "}
      {/* Apply overflow-y-auto here */}
      <div className="pt-0">
        <Logo />
        <div className="w-full h-[2px] bg-[#2f303b] -mt-1.5"></div>
      </div>
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex flex-col px-5">
          <div className="flex items-center gap-4 ">
            <div 
              className={`relative cursor-pointer flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                activeSection === 'directMessages' 
                ? 'text-primary bg-primary/10 font-semibold' 
                : 'text-gray-400 hover:bg-gray-700/30'
              }`}
              onClick={() => setActiveSection('directMessages')}
            >
              <Title text="Messages" active={activeSection === 'directMessages'} />
              <NewDM />
              {activeSection === 'directMessages' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
              )}
            </div>
            <div 
              className={`relative cursor-pointer flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                activeSection === 'groups' 
                ? 'text-primary bg-primary/10 font-semibold' 
                : 'text-gray-400 hover:bg-gray-700/30'
              }`}
              onClick={() => setActiveSection('groups')}
            >
              <Title text="Groups" active={activeSection === 'groups'} />
              <CreateChannel />
              {activeSection === 'groups' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden px-5">
          {activeSection === 'directMessages' && (
            <div className="h-full overflow-y-auto scrollbar-hidden">
              <ContactList contacts={directMessagesContacts} />
            </div>
          )}
          
          {activeSection === 'groups' && (
            <div className="h-full overflow-y-auto scrollbar-hidden">
              <ContactList contacts={channels} isChannel />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]">
        {userInfo.role === "admin" && (
          <div className="my-5 flex justify-center">
            <Button onClick={openModal} className="rounded-full p-4">
              Register User
            </Button>
          </div>
        )}
        <ProfileInfo />
      </div>
      {/* Modal for Register User */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Register User"
        className="modal-content" // Custom styling for modal content
        overlayClassName="modal-overlay" // Custom styling for overlay
      >
        <div className="p-6 bg-white text-black">
          <button
            onClick={closeModal}
            className="float-right text-black text-2xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">Register New User</h2>
          <AdminUserForm />
        </div>
      </Modal>
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
