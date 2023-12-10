import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export const appChatSlice = createSlice({
  name: "appchat",
  initialState: {
    openProfile: false,
    openinfo: false,
    condense: true,
    activechat: true,
    searchContact: "",
    mobileChatSidebar: false,
    profileinfo: {},
    messFeed: [],
    user: {},
    contacts: [
      {
        id: 1,
        fullName: "Kathryn Murphy",
        role: "Frontend Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        avatar: "/assets/images/users/user-2.jpg",
        status: "offline",
      },
    ],
    chats: [
      {
        id: 1,
        userId: 1,
        messages: [
          {
            img: "/assets/images/users/user-2.jpg",
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
        ],
      },
    ],
  },
  reducers: {
    openChat: (state, action) => {
      state.activechat = action.payload.activechat;
      state.mobileChatSidebar = !state.mobileChatSidebar;
      state.user = action.payload.contact;
      // state.chats.map((item) => {
      //   if (item.userId === action.payload.contact.id) {
      //     state.messFeed = item.messages;
      //   }
      // });
    },
    // toggole mobile chat sidebar
    toggleMobileChatSidebar: (state, action) => {
      state.mobileChatSidebar = action.payload;
    },
    infoToggle: (state, action) => {
      state.openinfo = action.payload;
    },
    condenseToggle: (state, action) => {
      state.condense = action.payload;
    },
    sendMessage: (state, action) => {
      state.messFeed.push(action.payload);
    },
    toggleProfile: (state, action) => {
      state.openProfile = action.payload;
    },
    setContactSearch: (state, action) => {
      state.searchContact = action.payload;
    },
    toggleActiveChat: (state, action) => {
      state.activechat = action.payload;
    },
  },
});

export const {
  openChat,
  toggleMobileChatSidebar,
  infoToggle,
  condenseToggle,
  sendMessage,
  toggleProfile,
  setContactSearch,
  toggleActiveChat,
} = appChatSlice.actions;
export default appChatSlice.reducer;
