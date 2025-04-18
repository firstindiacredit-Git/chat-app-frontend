import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST, GET_CHANNEL_MEMBERS } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { ArrowLeft, ChevronDown, ChevronUp, Users } from "lucide-react";
import apiClient from "@/lib/api-client";

const ChatHeader = () => {
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeChat();
      }
    };

    // Add keydown event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeChat]);

  // Close group members dropdown when changing chats
  useEffect(() => {
    setShowGroupMembers(false);
    setGroupMembers([]);
  }, [selectedChatData]);

  const toggleGroupMembers = async () => {
    if (selectedChatType !== "channel") return;
    
    if (!showGroupMembers && groupMembers.length === 0) {
      try {
        setLoading(true);
        // Fetch group members if we don't have them yet
        const response = await apiClient.get(`${GET_CHANNEL_MEMBERS}/${selectedChatData._id}`, {
          withCredentials: true
        });
        
        if (response.data.members) {
          setGroupMembers(response.data.members);
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
      } finally {
        setLoading(false);
      }
    }
    
    setShowGroupMembers(!showGroupMembers);
  };

  return (
    <div className={`
      h-[10vh] border-b-2 border-black flex items-center justify-between 
      ${isMobileView ? 'px-4' : 'px-20'} bg-[#111b21] relative
    `}>
      <div className="flex gap-3 items-center">
        {isMobileView && (
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300 mr-1"
            onClick={closeChat}
          >
            <ArrowLeft className="text-xl" />
          </button>
        )}
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative flex items-center justify-center">
            {selectedChatType === "contact" ? (
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-12 h-12 text-lg border-[1px] ${getColor(
                      selectedChatData.color
                    )} flex items-center justify-center rounded-full`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div
                className={`bg-[#ffffff22] py-3 px-5 flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
          </div>
          
          {/* Chat name with dropdown for group members */}
          <div 
            className={`${selectedChatType === "channel" ? "cursor-pointer" : ""} flex items-center gap-1`}
            onClick={selectedChatType === "channel" ? toggleGroupMembers : undefined}
          >
            <div className={`${isMobileView ? 'text-sm' : ''} truncate`}>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" &&
              selectedChatData.firstName &&
              selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
            
            {selectedChatType === "channel" && (
              loading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin ml-1"></div>
              ) : (
                showGroupMembers ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Only show X button on desktop */}
      {!isMobileView && (
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      )}
      
      {/* Group members dropdown */}
      {showGroupMembers && selectedChatType === "channel" && (
        <div className="absolute top-full left-0 z-20 w-80 bg-[#1f2c33] shadow-lg rounded-b-md max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-[#394450] text-gray-300 flex items-center gap-2">
            <Users size={16} />
            <span className="text-sm font-medium">Group Members · {groupMembers.length}</span>
          </div>
          <div className="py-2">
            {groupMembers.length > 0 ? (
              groupMembers.map(member => (
                <div key={member._id} className="flex items-center gap-3 px-4 py-2 hover:bg-[#263138]">
                  <div className="w-10 h-10 relative">
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                      {member.image ? (
                        <AvatarImage
                          src={`${HOST}/${member.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase w-10 h-10 text-md border-[1px] ${getColor(
                            member.color
                          )} flex items-center justify-center rounded-full`}
                        >
                          {member.firstName
                            ? member.firstName.split("").shift()
                            : member.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </span>
                    <span className="text-gray-400 text-xs">{member.email}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-400 text-sm">
                No members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
