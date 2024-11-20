import React, { useState, useEffect } from "react";
import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info";
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
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full max-h-screen overflow-y-auto"> {/* Apply overflow-y-auto here */}
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto"> {/* Scrollable section for Direct Messages */}
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[37vh] overflow-y-auto pb-5"> {/* Scrollable section for Channels */}
          <ContactList contacts={channels} isChannel />
        </div>
      </div>
      {userInfo.role === "admin" && (
        <div className="my-5 flex justify-center">
          <Button onClick={openModal} className="rounded-full p-4">
            Register User
          </Button>
        </div>
      )}
      <ProfileInfo />

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

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
