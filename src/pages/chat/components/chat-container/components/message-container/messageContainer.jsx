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

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
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
        <div key={index} className="w-full ">
          {showDate && (
            <div className="text-center  w-full  text-gray-400 my-2 ">
              <hr className="boder-1 border-zinc-800" />
              <div className="-translate-y-3 px-4w bg-black w-fit m-auto">
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
        className={`message  ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#005C4B] text-white border-[#005C4B]"
                : "bg-[#202C33] text-white border-[#202C33]"
            } border inline-block px-3 py-2 text-left rounded-xl my-1 md:max-w-[50%] max-w-[75%] break-words`}
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
            } border inline-block p-1 rounded-2xl my-1 md:max-w-[50%] max-w-[75%] break-words`}
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
                  alt=""
                  className="w-full max-w-[300px] max-h-[300px] md:w-[300px] md:h-[300px] object-contain"
                  style={{ borderRadius: "13px" }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center md:gap-5 gap-2 flex-wrap md:flex-nowrap">
                <span className="text-white/80 md:text-3xl text-2xl bg-black/20 rounded-full md:p-3 p-2">
                  <MdFolderZip />
                </span>
                <span className="md:text-base text-sm max-w-[120px] md:max-w-none truncate">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 md:p-3 p-2 md:text-2xl text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-4  ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#005C4B] text-white border-[#005C4B]"
                : "bg-[#202C33] text-white border-[#202C33]"
            } border inline-block px-2 py-1 rounded-xl -my-1 md:max-w-[50%] max-w-[75%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender._id === userInfo.id
                 ? "bg-[#005C4B] text-white border-[#005C4B]"
                : "bg-[#202C33] text-white border-[#202C33]"
            } border inline-block px-2 py-1 rounded-xl -my-1 md:max-w-[50%] max-w-[75%] break-words ml-9`}
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
                  alt=""
                  className="w-full max-w-[300px] max-h-[300px] md:w-[300px] md:h-[300px] object-contain"
                  style={{ borderRadius: "13px" }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center md:gap-5 gap-2 flex-wrap md:flex-nowrap">
                <span className="text-white/80 md:text-3xl text-2xl bg-black/20 rounded-full md:p-3 p-2">
                  <MdFolderZip />
                </span>
                <span className="md:text-base text-sm max-w-[120px] md:max-w-none truncate">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 md:p-3 p-2 md:text-2xl text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
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
            <span className="text-sm text-white/60 truncate max-w-[100px] md:max-w-full">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#1c1d25]">
      {showImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={() => setShowImage(false)}
          >
            <IoCloseSharp />
          </div>
          <img
            src={`${HOST}/${imageURL}`}
            alt=""
            className="max-w-[90%] max-h-[90%] object-contain"
          />
        </div>
      )}
      <div className="p-2 md:p-4 pb-16 md:pb-20 flex flex-col overflow-y-auto scrollbar-hidden w-full h-full">
        {selectedChatMessages.length > 0 ? (
          renderMessages()
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm my-4">
            No messages yet
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
