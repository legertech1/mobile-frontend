import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import searchSlice from "./searchSlice";
import categorySlice from "./categorySlice";
import adSlice from "./adSlice";
import adsSlice from "./adsSlice";
import chatSlice from "./chatSlice";
import notificationSlice from "./notificationSlice";
import locationSlice from "./locationSlice";
import placesSlice from "./placesSlice";
import cartSlice from "./cartSlice";
import balanceSlice from "./balanceSlice";
import updateSlice from "./updateSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ad: adSlice.reducer,
    ads: adsSlice.reducer,
    search: searchSlice.reducer,
    categories: categorySlice.reducer,
    chats: chatSlice.reducer,
    notifications: notificationSlice.reducer,
    location: locationSlice.reducer,
    places: placesSlice.reducer,
    cart: cartSlice.reducer,
    balance: balanceSlice.reducer,
    updates: updateSlice.reducer,
  },
});

export default store;
