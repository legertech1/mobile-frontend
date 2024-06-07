import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apis from "../services/api";
import { PriceOptions } from "../utils/constants";
export const initialAdState = {
  images: [],
  thumbnails: [],
  category: "",
  subCategory: "",
  title: "",
  description: "",
  stock: 1,
  price: "",
  term: PriceOptions[0],
  tags: [],
  extraFields: {},
  tax: "none",
};
// export const postAd = createAsyncThunk("post ad", async (payload) => {
//   const ad = (
//     await axios.post(apis.postAd, { ad: payload.ad, token: payload.token })
//   ).data;
//   return ad;
// });
export const editAd = createAsyncThunk("edit ad", async (payload) => {
  const ad = (await axios.put(apis.ads + "/" + payload._id, payload)).data;
  return ad;
});
export const relistAd = createAsyncThunk("relist ad", async (payload) => {
  const ad = (
    await axios.post(apis.relistAd, { id: payload.id, token: payload.token })
  ).data;
  return ad;
});

const adSlice = createSlice({
  name: "ad",
  initialState: initialAdState,
  reducers: {
    setFormData: (state, action) => {
      return { ...action.payload };
    },
    updateLocation: (state, action) => {
      return { ...state, location: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editAd.fulfilled, (state, action) => {
      return initialAdState;
    });
    builder.addCase(relistAd.fulfilled, (state, action) => {

      return initialAdState;
    });
  },
});

export default adSlice;
export const { setFormData, updateLocation } = adSlice.actions;
