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
  const {
    selectedChatData,
    userInfo,
    selectedChatType,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const socket = useSocket();

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
    <div className="min-h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 gap-6 my-5">
      <div className="flex-1 flex bg-[#2a2b33] h-full rounded-md items-center gap-5 pr-5">
        <textarea
          style={{
            resize: "none", // Disable resizing
            minHeight: "40px", // Minimum height
            borderRight: "1px solid #2f303b", // Border color
            maxHeight: "200px", // Maximum height
            // overflow: "hidden", // Hide overflow
            scrollbarWidth: "none", // For Fir
            WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
          }}
          type="text"
          cols={30}
          rows={1} // Initially, set to 1 row
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter message"
          value={message}
          onChange={handleMessageChange}
          onInput={(e) => {
            e.target.style.height = "auto"; // Reset the height
            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents newline in the input field
              handleSendMessage();
            }
          }}
        ></textarea>
        <button
          className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl " />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 gap-2 focus:border-none focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] transition-all duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default MessageBar;
