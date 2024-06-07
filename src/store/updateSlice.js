import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const updateSlice = createSlice({
  name: "updates",
  initialState: [],
  reducers: {
    pushUpdate: (state, action) => {
      return [action.payload, ...state];
    },
  },
});
export default updateSlice;
export const { pushUpdate } = updateSlice.actions;
