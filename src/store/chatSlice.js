import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ping from "../assets/audio/ping.mp3";
import { removeDuplicates } from "../utils/helpers";
let notif = new Audio(ping);

const chatSlice = createSlice({
  name: "chats",
  initialState: null,
  reducers: {
    setChats: (state, action) => {
      return [...action.payload];
    },
    addChat: (state, action) => {
      return [action.payload, ...state];
    },
    receiveMessage: (state, action) => {
      if (!state) return state;

      let chats = state.map((conv) => {
        if (conv._id == action.payload._id) {
          if (
            conv.info._id == action.payload.message.from &&
            JSON.parse(localStorage.sound ||"{}").message
          ) {
            notif
              .play()
              .then()
              .catch((err) => console.error(err));
          }

          return {
            ...conv,
            messages: [...conv.messages, { ...action.payload.message }],
            new: true,
            updatedAt: action.payload.updatedAt,
          };
        } else return conv;
      });

      chats.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return chats;
    },
    setUserOnline: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat.participants.includes(action.payload.id)
            ? {
                ...chat,
                online: [
                  ...chat.online.filter((i) => i != action.payload.id),
                  action.payload.id,
                ],
              }
            : chat
        ),
      ];
    },
    setUserOffline: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat.participants.includes(action.payload.id)
            ? {
                ...chat,
                online: [...chat.online.filter((i) => i != action.payload.id)],
              }
            : chat
        ),
      ];
    },
    userTyping: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat._id == action.payload.chatId
            ? {
                ...chat,
                typing: [
                  ...(chat?.typing?.filter((t) => t != action.payload.userId) ||
                    []),
                  action.payload.userId,
                ],
              }
            : chat
        ),
      ];
    },
    userStoppedTyping: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat._id == action.payload.chatId
            ? {
                ...chat,
                typing: [
                  ...(chat?.typing?.filter((t) => t != action.payload.userId) ||
                    []),
                ],
              }
            : chat
        ),
      ];
    },
    updateChat: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat._id == action.payload._id
            ? {
                ...action.payload,
                info: chat.info,
                messages: action.payload.messagesRead
                  ? chat.messages.map((m) => {
                      return { ...m, read: true };
                    })
                  : chat.messages,
              }
            : chat
        ),
      ];
    },
    chatDeleted: (state, action) => {
      if (!state) return state;
      return [...state.filter((chat) => chat._id != action.payload)];
    },
    updateMessage: (state, action) => {
      return [
        ...state.map((c) => {
          if (c._id != action.payload.chatId) return c;
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m._id != action.payload.message._id) return m;
              return action.payload.message;
            }),
          };
        }),
      ];
    },

    loadMessages: (state, action) => {
      if (!state) return state;
      return [
        ...state.map((chat) =>
          chat._id == action.payload._id
            ? {
                ...chat,
                messages: removeDuplicates(
                  [...action.payload.messages, ...chat.messages],
                  "_id"
                ),
              }
            : chat
        ),
      ];
    },
    resetNew: (state, action) => {
      return state.map((conv) => {
        if (conv._id == action.payload._id) {
          return {
            ...conv,
            new: false,
          };
        } else return conv;
      });
    },
  },

  extraReducers: (builder) => {}, //
});

export const {
  setChats,
  receiveMessage,
  setUserOnline,
  setUserOffline,
  userTyping,
  userStoppedTyping,
  updateChat,
  chatDeleted,
  loadMessages,
  updateMessage,
  resetNew,
  addChat,
} = chatSlice.actions;
export default chatSlice;
