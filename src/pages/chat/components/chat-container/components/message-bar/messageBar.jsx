import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useSocket } from "@/contexts/SocketContext";
import { MESSAGE_TYPES, UPLOAD_FILE } from "@/lib/constants";
import apiClient from "@/lib/api-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const textareaRef = useRef(null);
  const {
    selectedChatData,
    userInfo,
    selectedChatType,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 380);
  const socket = useSocket();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 380);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust textarea height when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }, 0);
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message field required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 md:static
      bg-[#0A0A0A] flex justify-center items-center 
      ${isSmallMobile ? 'px-1' : isMobileView ? 'px-2' : 'px-4 lg:px-8'} 
      ${isSmallMobile ? 'gap-1' : 'gap-2 md:gap-4'} 
      py-2 md:py-3 lg:py-4
      border-t border-[#1a1a1a]
      z-10
    `}>
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-1 md:gap-3 pr-1 md:pr-3">
        <textarea
          ref={textareaRef}
          style={{
            resize: "none",
            minHeight: "40px",
            borderRight: "1px solid #2f303b",
            maxHeight: isSmallMobile ? "80px" : isMobileView ? "120px" : "200px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
          }}
          cols={isSmallMobile ? 20 : 30}
          rows={1}
          className={`flex-1 ${isSmallMobile ? 'p-2 text-sm' : isMobileView ? 'p-2 text-base' : 'p-3 md:p-4'} bg-transparent rounded-md focus:border-none focus:outline-none text-white`}
          placeholder="Enter message"
          value={message}
          onChange={handleMessageChange}
          onInput={(e) => {
            e.target.style.height = "auto";
            const newHeight = Math.min(e.target.scrollHeight, isSmallMobile ? 80 : isMobileView ? 120 : 200);
            e.target.style.height = `${newHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        ></textarea>
        <button
          className="text-neutral-300 focus:border-none focus:outline-none hover:text-white transition-all duration-300 p-1 md:p-2"
          onClick={handleAttachmentClick}
          aria-label="Attach file"
        >
          <GrAttachment className={`${isSmallMobile ? 'text-base' : isMobileView ? 'text-lg' : 'text-xl'}`} />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-300 focus:border-none focus:outline-none hover:text-white transition-all duration-300 p-1 md:p-2"
            onClick={() => setEmojiPickerOpen(true)}
            aria-label="Open emoji picker"
          >
            <RiEmojiStickerLine className={`${isSmallMobile ? 'text-base' : isMobileView ? 'text-lg' : 'text-xl'}`} />
          </button>
          <div 
            className={`absolute ${
              isSmallMobile 
                ? 'bottom-10 right-0 transform scale-[0.65] origin-bottom-right' 
                : isMobileView 
                  ? 'bottom-12 right-0 transform scale-75 origin-bottom-right' 
                  : 'bottom-16 right-0'
            }`} 
            ref={emojiRef}
          >
            {emojiPickerOpen && (
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
                width={isMobileView ? 280 : 320}
                height={isMobileView ? 350 : 400}
              />
            )}
          </div>
        </div>
      </div>
      <button
        className={`
          bg-purple-700 rounded-md flex items-center justify-center 
          ${isSmallMobile ? 'p-2' : isMobileView ? 'p-3' : 'p-3 md:p-4'} 
          focus:border-none focus:outline-none hover:bg-purple-800 transition-all duration-300
        `}
        onClick={handleSendMessage}
        aria-label="Send message"
      >
        <IoSend className={`${isSmallMobile ? 'text-base' : isMobileView ? 'text-lg' : 'text-xl'} text-white`} />
      </button>
      <ToastContainer />
    </div>
  );
};

export default MessageBar;
