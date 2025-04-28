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
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 380);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 380);
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
      border-b-2 border-black flex items-center justify-between 
      ${isSmallMobile ? 'px-2 py-2' : isMobileView ? 'px-3 py-3' : 'px-20 py-4'} bg-[#0A0A0A] relative
    `}>
      <div className="flex gap-2 md:gap-3 items-center">
        {isMobileView && (
          <button
            className="text-neutral-300 focus:border-none focus:outline-none hover:text-white transition-all duration-300"
            onClick={closeChat}
            aria-label="Back"
          >
            <ArrowLeft className={`${isSmallMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </button>
        )}
        <div className="flex gap-2 md:gap-3 items-center justify-center">
          <div className={`${isSmallMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'} relative flex items-center justify-center`}>
            {selectedChatType === "contact" ? (
              <Avatar className={`${isSmallMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'} rounded-full overflow-hidden`}>
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase ${isSmallMobile ? 'w-8 h-8 text-sm' : 'w-10 h-10 md:w-12 md:h-12 text-base md:text-lg'} border-[1px] ${getColor(
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
                className={`bg-[#ffffff22] ${isSmallMobile ? 'py-1.5 px-3 text-sm' : 'py-2 px-4 md:py-3 md:px-5'} flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
          </div>
          
          {/* Chat name with dropdown for group members */}
          <div 
            className={`${selectedChatType === "channel" ? "cursor-pointer" : ""} flex items-center gap-1 max-w-[180px] md:max-w-none`}
            onClick={selectedChatType === "channel" ? toggleGroupMembers : undefined}
          >
            <div className={`${isSmallMobile ? 'text-xs' : isMobileView ? 'text-sm' : 'text-base'} truncate text-white font-medium`}>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" &&
              selectedChatData.firstName &&
              selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
            
            {selectedChatType === "channel" && (
              loading ? (
                <div className={`${isSmallMobile ? 'w-3 h-3' : 'w-4 h-4'} border-2 border-t-transparent border-gray-400 rounded-full animate-spin ml-1`}></div>
              ) : (
                showGroupMembers ? 
                  <ChevronUp className={`${isSmallMobile ? 'h-3 w-3' : 'h-4 w-4'}`} /> : 
                  <ChevronDown className={`${isSmallMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Only show X button on desktop */}
      {!isMobileView && (
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-300 focus:border-none focus:outline-none hover:text-white transition-all duration-300"
            onClick={closeChat}
            aria-label="Close chat"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      )}
      
      {/* Group members dropdown */}
      {showGroupMembers && selectedChatType === "channel" && (
        <div className={`absolute top-full left-0 z-20 ${isSmallMobile ? 'w-full' : 'w-72 md:w-80'} bg-[#1f2c33] shadow-lg rounded-b-md max-h-80 overflow-y-auto`}>
          <div className="p-2 md:p-3 border-b border-[#394450] text-gray-300 flex items-center gap-2">
            <Users className={`${isSmallMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`${isSmallMobile ? 'text-xs' : 'text-sm'} font-medium`}>Group Members · {groupMembers.length}</span>
          </div>
          <div className="py-1 md:py-2">
            {groupMembers.length > 0 ? (
              groupMembers.map(member => (
                <div key={member._id} className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 hover:bg-[#263138]">
                  <div className={`${isSmallMobile ? 'w-7 h-7' : 'w-8 h-8 md:w-10 md:h-10'} relative`}>
                    <Avatar className={`${isSmallMobile ? 'w-7 h-7' : 'w-8 h-8 md:w-10 md:h-10'} rounded-full overflow-hidden`}>
                      {member.image ? (
                        <AvatarImage
                          src={`${HOST}/${member.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase ${isSmallMobile ? 'w-7 h-7 text-xs' : 'w-8 h-8 md:w-10 md:h-10 text-sm md:text-md'} border-[1px] ${getColor(
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
                  <div className="flex flex-col max-w-[180px] md:max-w-none">
                    <span className={`text-white ${isSmallMobile ? 'text-xs' : 'text-sm'} truncate`}>
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </span>
                    <span className={`text-gray-400 ${isSmallMobile ? 'text-[10px]' : 'text-xs'} truncate`}>{member.email}</span>
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
