import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FileIcon, ImageIcon, FolderIcon } from "lucide-react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    markAsRead,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
    
    // Mark as read when selecting a chat
    if (contact.unread) {
      markAsRead(contact._id);
    }
  };

  // Check if a file path is an image
  const checkIfImage = (filePath) => {
    if (!filePath) return false;
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // Helper to render the last message with appropriate icon and text
  const renderLastMessage = (contact) => {
    if (!contact.lastMessage && !contact.lastMessageType) {
      return null;
    }
    
    // Default values
    let icon = null;
    let messageText = contact.lastMessage;
    
    // Handle different message types
    if (contact.lastMessageType === "file") {
      // Check if it's an image file
      if (contact.fileUrl && checkIfImage(contact.fileUrl)) {
        icon = <ImageIcon size={12} className="mr-1" />;
        messageText = "Photo";
      } else {
        icon = <FileIcon size={12} className="mr-1" />;
        messageText = "File";
      }
    } else if (contact.lastMessageType === "folder") {
      icon = <FolderIcon size={12} className="mr-1" />;
      messageText = "Folder";
    }
    
    return (
      <div className={`ml-16 mt-1 text-sm ${contact.unread ? "text-gray-200 font-bold" : "text-gray-400"} truncate pr-10 flex items-center`}>
        {icon}
        {messageText}
      </div>
    );
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#f1f1f122] hover:bg-[#f1f1f111]"
              : "hover:bg-[#f1f1f111] "
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 ">
                {contact.image && (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="rounded-full bg-cover h-full w-full"
                  />
                )}

                <AvatarFallback
                  className={`uppercase ${
                    selectedChatData && selectedChatData._id === contact._id
                      ? "bg-[#ffffff22] border border-white/50"
                      : getColor(contact.color)
                  } h-10 w-10 flex items-center justify-center rounded-full`}
                >
                  {contact.firstName.split("").shift()}
                </AvatarFallback>
              </Avatar>
            )}
            {isChannel && (
              <div
                className={` bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
            {isChannel ? (
              <span className={contact.unread ? "font-bold" : ""}>{contact.name}</span>
            ) : (
              <span className={contact.unread ? "font-bold" : ""}>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
            {contact.unread && (
              <div className="ml-auto mr-10 w-2 h-2 rounded-full bg-blue-500"></div>
            )}
          </div>
          {renderLastMessage(contact)}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
