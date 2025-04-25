export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  channels: [],
  isUploading: false,
  fileUploadProgress: 0,
  isDownloading: false,
  downloadProgress: 0,
  showRegistrationForm: false,
  setIsUploading: (isUploading) => set({ isUploading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setChannels: (channels) => set({ channels }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  setShowRegistrationForm: (showRegistrationForm) => 
    set({ showRegistrationForm }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  markAsRead: (contactId) => {
    // Mark a contact's messages as read
    const directMessagesContacts = [...get().directMessagesContacts];
    const channels = [...get().channels];
    
    // Check if it's a direct message contact
    const dmIndex = directMessagesContacts.findIndex(contact => contact._id === contactId);
    if (dmIndex !== -1) {
      directMessagesContacts[dmIndex] = {
        ...directMessagesContacts[dmIndex],
        unread: false
      };
      set({ directMessagesContacts });
    }
    
    // Check if it's a channel
    const channelIndex = channels.findIndex(channel => channel._id === contactId);
    if (channelIndex !== -1) {
      channels[channelIndex] = {
        ...channels[channelIndex],
        unread: false
      };
      set({ channels });
    }
  },
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    const selectedChatData = get().selectedChatData;
    const userInfo = get().userInfo;
    
    // Add the message to chat
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipent
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
    
    // If the message is from someone else and we're not currently in that chat, mark it as unread
    const isFromSomeoneElse = message.sender._id !== userInfo.id;
    const isNotInCurrentChat = !selectedChatData || 
      (selectedChatType === "contact" && selectedChatData._id !== (message.sender._id === userInfo.id ? message.recipient._id : message.sender._id)) ||
      (selectedChatType === "channel" && selectedChatData._id !== message.channelId);
    
    if (isFromSomeoneElse && isNotInCurrentChat) {
      // Mark as unread depending on chat type
      if (message.channelId) {
        // It's a channel message
        const channels = [...get().channels];
        const channelIndex = channels.findIndex(channel => channel._id === message.channelId);
        
        if (channelIndex !== -1) {
          channels[channelIndex] = {
            ...channels[channelIndex],
            unread: true,
            lastMessage: message.content,
            lastMessageType: message.messageType,
            fileUrl: message.fileUrl
          };
          set({ channels });
        }
      } else {
        // It's a direct message
        const dmContacts = [...get().directMessagesContacts];
        const senderId = message.sender._id;
        const contactIndex = dmContacts.findIndex(contact => contact._id === senderId);
        
        if (contactIndex !== -1) {
          dmContacts[contactIndex] = {
            ...dmContacts[contactIndex],
            unread: true,
            lastMessage: message.content,
            lastMessageType: message.messageType,
            fileUrl: message.fileUrl
          };
          set({ directMessagesContacts: dmContacts });
        }
      }
    }
  },
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  addContactInDMContacts: (message) => {
    console.log({ message });
    const userId = get().userInfo.id;
    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);
    console.log({ data, index, dmContacts, userId, message, fromData });
    
    // Check if this is a new message from someone else (not the current user)
    const isNewMessageFromOther = message.sender._id !== userId;
    const selectedChatData = get().selectedChatData;
    const isNotCurrentChat = !selectedChatData || selectedChatData._id !== fromId;
    
    // Mark as unread if it's a new message from someone else and not in the current chat
    const unread = isNewMessageFromOther && isNotCurrentChat;
    
    if (index !== -1 && index !== undefined) {
      console.log("in if condition");
      const updatedContact = {
        ...data,
        unread: data.unread || unread,
        lastMessage: message.content,
        lastMessageType: message.messageType,
        fileUrl: message.fileUrl
      };
      dmContacts.splice(index, 1);
      dmContacts.unshift(updatedContact);
    } else {
      console.log("in else condition");
      const newContact = {
        ...fromData,
        unread,
        lastMessage: message.content,
        lastMessageType: message.messageType,
        fileUrl: message.fileUrl
      };
      dmContacts.unshift(newContact);
    }
    set({ directMessagesContacts: dmContacts });
  },
  addChannelInChannelLists: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    
    // Check if this is a new message from someone else
    const userId = get().userInfo.id;
    const isNewMessageFromOther = message.sender._id !== userId;
    const selectedChatData = get().selectedChatData;
    const isNotCurrentChat = !selectedChatData || selectedChatData._id !== message.channelId;
    
    // Mark as unread if it's a new message from someone else and not in the current chat
    const unread = isNewMessageFromOther && isNotCurrentChat;
    
    if (index !== -1 && index !== undefined) {
      const updatedChannel = {
        ...data,
        unread: data.unread || unread,
        lastMessage: message.content,
        lastMessageType: message.messageType,
        fileUrl: message.fileUrl
      };
      channels.splice(index, 1);
      channels.unshift(updatedChannel);
      set({ channels });
    }
  },
});
