import { createSlice } from "@reduxjs/toolkit";
export const initialAdState = {
  ads: [],
};

const adsSlice = createSlice({
  name: "ads",
  initialState: initialAdState,
  reducers: {
    setAds: (state, action) => {
      return { ...action.payload };
    },
  },
});

export default adsSlice;
export const { setAds } = adsSlice.actions;
