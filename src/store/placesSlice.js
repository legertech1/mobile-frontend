import { createSlice } from "@reduxjs/toolkit";

const placesSlice = createSlice({
  name: "places",
  initialState: [],
  reducers: {
    updatePlaces(state, action) {
      return [...action.payload];
    },
  },
});

export default placesSlice;
export const { updatePlaces } = placesSlice.actions;
