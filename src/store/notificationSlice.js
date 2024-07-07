import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ping from "../assets/audio/ping.mp3";
let notif = new Audio(ping);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: null,
  reducers: {
    notificationRecieved: function (state, action) {
      if (JSON.parse(localStorage.sound || "{}").notification)
        notif
          .play()
          .then()
          .catch((err) => console.error(err));

      return [...(state || []), action.payload];
    },
    loadNotifications: function (state, action) {
      return [...action.payload];
    },
    notificationUpdate: function (state, action) {
      return [
        ...state.map((n) =>
          n?._id == action.payload?._id ? action.payload : n
        ),
      ];
    },
    notificationDeleted: function (state, action) {
      return [...state.filter((n) => n?._id != action.payload)];
    },
    clearNotifications: function (state, action) {
      return [];
    },
  },
  extraReducers: (builder) => {},
});

export const {
  notificationRecieved,
  loadNotifications,
  notificationUpdate,
  notificationDeleted,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice;
