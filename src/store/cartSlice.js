import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { total: 0 },
  reducers: {
    updateCart: (state, action) => {
      return {
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {},
});

export default cartSlice;
export const { updateCart } = cartSlice.actions;
