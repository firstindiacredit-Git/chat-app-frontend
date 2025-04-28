import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/lib/api-client";
import {
  FETCH_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
  MESSAGE_TYPES,
} from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";
import backgroundImage from "@/assets/background.jpg";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 380);
  const {
    selectedChatData,
    setSelectedChatMessages,
    selectedChatMessages,
    selectedChatType,
    userInfo,
    setDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const messageEndRef = useRef(null);
  const containerRef = useRef(null);

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
    const getMessages = async () => {
      const response = await apiClient.post(
        FETCH_ALL_MESSAGES_ROUTE,
        {
          id: selectedChatData._id,
        },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };
    const getChannelMessages = async () => {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );
      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop()); // Optional: Specify a file name for the download
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob); // Clean up the URL object
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} className="w-full">
          {showDate && (
            <div className="text-center w-full text-gray-200 my-3 md:my-4">
              <hr className="border-1 border-zinc-800" />
              <div className="-translate-y-3 px-3 py-1 bg-[#000000] w-fit m-auto rounded-full border border-zinc-700 text-xs md:text-sm">
                {moment(message.timestamp).format("LL")}
              </div>
            </div>
          )}
          {selectedChatType === "contact" && renderPersonalMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderPersonalMessages = (message) => {
    return (
      <div
        className={`message px-2 md:px-4 ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#005C4B] text-white border-[#005C4B]"
                : "bg-[#202C33] text-white border-[#202C33]"
            } border inline-block px-3 py-2 text-left my-1 ${isMobileView ? 'max-w-[80%]' : 'max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]'} break-words text-sm md:text-base`}
            style={{
              borderRadius:
                message.sender !== selectedChatData._id
                  ? "12px 12px 0px 12px"
                  : "12px 12px 12px 0px"
            }}
          >
            {message.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#005C4B] text-white border-[#005C4B]"
                : "bg-[#202C33] text-white border-[#202C33]"
            } border inline-block p-1 my-1 ${isMobileView ? 'max-w-[85%]' : 'max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]'} break-words`}
            style={{
              borderRadius:
                message.sender !== selectedChatData._id
                  ? "12px 12px 0px 12px"
                  : "12px 12px 12px 0px"
            }}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="Image attachment"
                  className="rounded-lg w-full max-w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className={`flex ${isSmallMobile ? 'flex-col p-2 gap-2' : isMobileView ? 'items-center p-2 gap-3' : 'items-center justify-between p-3 gap-4'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-white/80 ${isSmallMobile ? 'text-xl p-2' : 'text-2xl p-3'} bg-black/20 rounded-full`}>
                    <MdFolderZip />
                  </span>
                  <span className={`${isSmallMobile ? 'text-xs' : 'text-sm'} break-all`}>
                    {message.fileUrl.split("/").pop().length > 20 
                      ? `${message.fileUrl.split("/").pop().substring(0, 20)}...` 
                      : message.fileUrl.split("/").pop()}
                  </span>
                </div>
                <span
                  className="bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 shrink-0"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 mr-1 ml-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-4 px-2 md:px-4 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
          className={`${
            message.sender._id === userInfo.id
              ? "bg-[#005C4B] border-[#005C4B]"
              : "bg-[#202C33] border-[#202C33]"
          } text-white border inline-block px-2 py-1 -my-1 ${isMobileView ? 'max-w-[80%]' : 'max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]'} break-words ${message.sender._id !== userInfo.id ? 'ml-9' : ''} text-sm md:text-base`}
          style={{
            borderRadius:
              message.sender._id === userInfo.id
                ? "12px 12px 0px 12px"
                : "12px 12px 12px 0px"
          }}
          >
            {message.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
          className={`${
            message.sender._id === userInfo.id
              ? "bg-[#005C4B] border-[#005C4B]"
              : "bg-[#202C33] border-[#202C33]"
          } text-white border inline-block px-2 py-1 -my-1 ${isMobileView ? 'max-w-[85%]' : 'max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]'} break-words ${message.sender._id !== userInfo.id ? 'ml-9' : ''}`}
          style={{
            borderRadius:
              message.sender._id === userInfo.id
                ? "12px 12px 0px 12px"
                : "12px 12px 12px 0px"
          }}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="Image attachment"
                  className="rounded-lg w-full max-w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className={`flex ${isSmallMobile ? 'flex-col p-2 gap-2' : isMobileView ? 'items-center p-2 gap-3' : 'items-center justify-between p-3 gap-4'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-white/80 ${isSmallMobile ? 'text-xl p-2' : 'text-2xl p-3'} bg-black/20 rounded-full`}>
                    <MdFolderZip />
                  </span>
                  <span className={`${isSmallMobile ? 'text-xs' : 'text-sm'} break-all`}>
                    {message.fileUrl.split("/").pop().length > 20 
                      ? `${message.fileUrl.split("/").pop().substring(0, 20)}...` 
                      : message.fileUrl.split("/").pop()}
                  </span>
                </div>
                <span
                  className="bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 shrink-0"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 flex ${getColor(
                  message.sender.color
                )} items-center justify-center rounded-full`}
              >
                {message.sender.firstName.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

            <div className="text-xs text-white/30">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/30 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto scrollbar-hidden w-full relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="p-2 md:p-4 bg-black/20">
        <div className="relative z-10 pb-4">
          {renderMessages()}
          <div ref={messageEndRef} />
        </div>
      </div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-lg flex-col bg-black/60">
          <img
            src={`${HOST}/${imageURL}`}
            className={`${isMobileView ? 'max-h-[80vh] max-w-[90vw]' : 'max-h-[85vh] max-w-[80vw]'} object-contain`}
            alt="Full size"
          />
          <div className="flex gap-4 mt-4">
            <button
              className="bg-black/40 p-3 text-2xl rounded-full hover:bg-black/60 cursor-pointer transition-all duration-300 text-white"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/40 p-3 text-2xl rounded-full hover:bg-black/60 cursor-pointer transition-all duration-300 text-white"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
