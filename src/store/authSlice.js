import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apis from "../services/api";
import { socket, disconnect } from "../socket";

export const me = createAsyncThunk("authorize user", async () => {
  let data = (await axios.get(apis.me,)).data;
  return { ...data };
});

export const logout = createAsyncThunk("logout user", async () => {
  localStorage.setItem("logout", "true");
  // disconnect2(socket);
  return await axios.get(apis.logout);
});

export const addToWishlist = createAsyncThunk("add to wishlist", async (id) => {
  return (await axios.get(apis.addToWishlist + "/" + id)).data;
});
export const removeFromWishlist = createAsyncThunk(
  "remove from wishlist",
  async (id) => {
    return (await axios.get(apis.removeFromWishlist + "/" + id)).data;
  }
);

export const saveSearch = createAsyncThunk("save search", async (search) => {
  return { ...(await axios.post(apis.saveSearch, search)).data };
});

export const deleteSearch = createAsyncThunk(
  "delete search",
  async (search) => {
    return { ...(await axios.post(apis.deleteSearch, search)).data };
  }
);
export const deleteAllSearches = createAsyncThunk(
  "delete All searches",
  async (search) => {
    return { ...(await axios.post(apis.deleteAllSearches, search)).data };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: false,
  reducers: {
    editUserData: function (state, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      return null;
    });
    builder.addCase(logout.fulfilled, () => {
      return null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      return { ...state, data: { ...state.data, wishlist: action.payload } };
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      return { ...state, data: { ...state.data, wishlist: action.payload } };
    });
    builder.addCase(saveSearch.fulfilled, (state, action) => {
      return { ...state, data: action.payload };
    });
    builder.addCase(deleteSearch.fulfilled, (state, action) => {
      return { ...state, data: action.payload };
    });
    builder.addCase(deleteAllSearches.fulfilled, (state, action) => {
      return { ...state, data: action.payload };
    });
  },
});

export const { editUserData } = authSlice.actions;
export default authSlice;
