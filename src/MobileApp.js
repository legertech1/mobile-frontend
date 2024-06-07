import { useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { me } from "./store/authSlice";

import { fetchCategories } from "./store/categorySlice";
import Home from "./pages_mobile/Home";
import Register from "./pages_mobile/Register/Index";
import Login from "./pages_mobile/Login/Index";
import ForgotPassword from "./pages_mobile/ForgotPassword/Index";
import ResetPassword from "./pages_mobile/ResetPassword/Index";
import Chat from "./pages_mobile/Chat/Index";
import PostAd from "./pages_mobile/PostAd/Index";
import UserProfile from "./pages_mobile/Profile/UserProfile";

import SavedSearches from "./pages_mobile/Profile/SavedSearches";
import Ad from "./pages_mobile/Ad";
import Pricing from "./pages_mobile/Pricing";
import HelpDocs from "./pages_mobile/Help/HelpDocs";
import HelpDoc from "./pages_mobile/Help/HelpDoc";
import ContactUs from "./pages_mobile/ContactUs";
import { getNotifications, init, loadChats, socket } from "./socket";
import SingleChat from "./pages_mobile/Chat/SingleChat";
import {
  fetchCurrentLocation,
  setSelectedLocation,
} from "./store/locationSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import "./MobileApp.css";
import ChangeEmail from "./pages_mobile/Profile/ChangeEmail";
import Footer from "./components_mobile/Footer";

function MobileApp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const routeLocation = useLocation();

  const { selectedLocation } = useSelector((state) => state.location);

  const [recentLocations, setRecentLocations] = useLocalStorage(
    "recentLocations",
    null
  );

  let p = routeLocation.pathname;
  p = p.replace(/\/[a-f\d]{24}/gi, "");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(me());
    dispatch(fetchCurrentLocation());

    init(socket, dispatch);
    document.body.click();
    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    user && loadChats(socket);
    user && getNotifications(socket);
  }, [user]);

  useEffect(() => {
    if (!selectedLocation && recentLocations?.length && recentLocations[0])
      dispatch(setSelectedLocation(recentLocations[0]));
  }, []);

  const handleOrientationChange = () => {
    if (window.orientation !== 0) {
      if (window.screen.orientation) {
        window.screen.orientation.lock("portrait").catch((error) => {});
      }
    }
  };

  useEffect(() => {
    window.addEventListener("orientationchange", handleOrientationChange);

    try {
      handleOrientationChange();
    } catch (error) {}

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return (
    <div className="___app">
      <Routes>
        <Route path="/register" exact element={<Register />} />

        <Route path="/login" exact element={<Login />} />
        <Route path="/forgot-password" exact element={<ForgotPassword />} />
        <Route path="/reset-password" exact element={<ResetPassword />} />
        <Route
          path="/verify"
          exact
          element={
            <h1>
              {" "}
              Please verify your account using the link sent to your email
            </h1>
          }
        />
        <Route
          path="/verified"
          exact
          element={<h1> Congratulations, your account has been verified!</h1>}
        />

        <Route
          path="/verify-password-reset"
          exact
          element={
            <h1>
              Please use the link sent to your email to reset your password
            </h1>
          }
        />
        <Route
          path="/reset-password-successful"
          exact
          element={
            <h1>
              Your password has been reset. You may log in with your new
              password now
            </h1>
          }
        />
      </Routes>

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/messages" exact element={<Chat />} />
        <Route path="/single-chat/:id" exact element={<SingleChat />} />

        <Route path="/help" exact element={<HelpDocs />} />
        <Route path="/help-doc/:id" exact element={<HelpDoc />} />
        <Route path="contact-us" exact element={<ContactUs />} />

        <Route element={<Ad />} path="/listing/:id" />
        <Route element={<Ad />} path="/preview-ad" />
        <Route exact path="/post-ad" element={<PostAd />} />

        <Route exact path="/edit/:id" element={<PostAd edit={true} />} />

        <Route path="/user_profile" exact element={<UserProfile />} />
        <Route path="/saved_searches" exact element={<SavedSearches />} />

        <Route path="/pricing" exact element={<Pricing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default MobileApp;
