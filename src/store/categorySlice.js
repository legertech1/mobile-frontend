import axios from "axios";
import apis from "../services/api";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const fetchCategories = createAsyncThunk(
  "fetch categories",
  async () => {
    return (await axios.get(apis.fetchCategories)).data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    patchUpdate: (state, action) => {
      return [
        ...state.map((category) =>
          category.name == action.payload.name ? action.payload : category
        ),
      ];
    },
  },
  extraReducers: (biulder) => {
    biulder.addCase(fetchCategories.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});
export default categorySlice;
export const { patchUpdate } = categorySlice.actions;
