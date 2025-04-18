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
          } border inline-block px-3 py-2 text-left rounded-xl my-1 max-w-[50%] md:max-w-[50%] max-w-[80%] break-words`}
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
          } border inline-block p-1 rounded-2xl my-1 max-w-[50%] md:max-w-[50%] max-w-[80%] break-words`}
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
                className="w-full max-w-[300px] md:max-w-[300px] max-w-[200px] h-auto object-contain"
                style={{ borderRadius: "13px" }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 md:gap-5 p-1 md:p-2 flex-wrap md:flex-nowrap">
              <span className="text-white/80 text-2xl md:text-3xl bg-black/20 rounded-full p-2 md:p-3">
                <MdFolderZip />
              </span>
              <span className="text-sm md:text-base max-w-[150px] md:max-w-full truncate">{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-2 md:p-3 text-xl md:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
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
          } border inline-block px-2 py-1 rounded-xl -my-1 max-w-[50%] md:max-w-[50%] max-w-[80%] break-words ml-9`}
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
          } border inline-block px-2 py-1 rounded-xl -my-1 max-w-[50%] md:max-w-[50%] max-w-[80%] break-words ml-9`}
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
                className="w-full max-w-[300px] md:max-w-[300px] max-w-[200px] h-auto object-contain"
                style={{ borderRadius: "13px" }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 md:gap-5 p-1 md:p-2 flex-wrap md:flex-nowrap">
              <span className="text-white/80 text-2xl md:text-3xl bg-black/20 rounded-full p-2 md:p-3">
                <MdFolderZip />
              </span>
              <span className="text-sm md:text-base max-w-[150px] md:max-w-full truncate">{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-2 md:p-3 text-xl md:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
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
          <span className="text-sm text-white/60 truncate max-w-[120px] md:max-w-full">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

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
          className="max-w-[90%] md:max-w-[80%] max-h-[90%] md:max-h-[80%] object-contain"
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