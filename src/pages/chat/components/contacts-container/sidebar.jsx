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
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import AdminUserForm from "@/pages/auth/AdminRegistration";
import { UserCircle } from "lucide-react"; // 🔥 NEW icon

Modal.setAppElement("#root");

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    userInfo,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('directMessages');
  const [isProfileVisible, setIsProfileVisible] = useState(false); // 🔥 NEW STATE

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleProfileSection = () => {
    setIsProfileVisible(prev => !prev); // 🔥 TOGGLE
  };

  return (
    <div className="relative md:w-[35vw] mb-28 lg:w-[30vw] xl:w-[20vw] w-full max-h-screen overflow-y-auto bg-[#111b21] border-r border-black">
      {/* Header */}
      <div className="pt-0">
        <Logo />
        <div className="w-full h-[1px] bg-[#111b21] -mt-1.9"></div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex flex-col px-2">
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
              <NewDM />
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
              <CreateChannel />
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-hidden px-2">
          {activeSection === 'directMessages' && (
            <div className="h-full overflow-y-auto">
              <ContactList contacts={directMessagesContacts} />
            </div>
          )}
          {activeSection === 'groups' && (
            <div className="h-full overflow-y-auto">
              <ContactList contacts={channels} isChannel />
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button Bottom Left */}
      <div className="absolute bottom-4 left-4 z-50">
        <button onClick={toggleProfileSection} className="text-white hover:text-blue-400">
          <UserCircle size={32} />
        </button>
      </div>

      {/* Footer Section */}
      <div className="fixed bottom-0 left-0 md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#111b21] border-r border-[#202c33] pb-4 min-h-[100px] transition-all duration-300 overflow-hidden">
       {isProfileVisible ? (
        <>
      <div className="my-5 flex justify-center">
        {userInfo.role === "admin" ? (
          <Button onClick={openModal} className="rounded-full p-4">
            Register User
          </Button>
        ) : (
          <div className="h-[56px] w-full" />
        )}
      </div>
      <ProfileInfo />
    </>
  ) : null}
</div>


      {/* Modal for Register User */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Register User"
        className="fixed inset-0 z-50 bg-white overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="min-h-screen w-full flex">
          <div className="hidden md:block md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#111b21] border-r border-[#202c33]">
            <div className="h-full p-6">
              <Logo />
              <div className="w-full h-[2px] bg-[#202c33] mt-4 mb-6"></div>
              <ProfileInfo />
            </div>
          </div>

          <div className="flex-1 from-purple-100 bg-gray-900 p-8 relative overflow-auto border-t border-r border-b border-purple-600">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-600 text-3xl font-bold hover:text-black"
            >
              &times;
            </button>
            <div className="max-w-4xl mx-auto mt-12">
              <AdminUserForm />
            </div>
          </div>
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
