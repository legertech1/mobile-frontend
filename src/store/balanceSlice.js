import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apis from "../services/api";
import axios from "axios";
export const getBalance = createAsyncThunk("get balance", async (payload) => {
  return (await axios.get(apis.getBalance)).data;
});

const balance = createSlice({
  name: "balance",
  initialState: null,
  reducers: {
    updateBalance: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBalance.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});
export default balance;
export const { updateBalance } = balance.actions;
