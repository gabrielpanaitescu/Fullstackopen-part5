import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
  },
});
