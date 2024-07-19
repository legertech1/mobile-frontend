import { useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { me } from "./store/authSlice";

import { fetchCategories } from "./store/categorySlice";
import Home from "./pages_mobile/Home";
import Login from "./pages_mobile/Login";
import Register from "./pages_mobile/Register";
import ForgotPassword from "./pages_mobile/ForgotPassword";
import ResetPassword from "./pages_mobile/ResetPassword";
import Chat from "./pages_mobile/Chat";
import PostAd from "./pages_mobile/PostAd";
import UserProfile from "./pages_mobile/Profile/UserProfile";
import InfoComp from "./components/InfoComp";

import SavedSearches from "./pages_mobile/Profile/SavedSearches";
import Ad from "./pages_mobile/Ad";
import Pricing from "./pages_mobile/Pricing";
import HelpDocs from "./pages_mobile/Help/HelpDocs";
import HelpDoc from "./pages_mobile/Help/HelpDoc";
import ContactUs from "./pages_mobile/ContactUs";
import { getNotifications, init, loadChats, socket } from "./socket";

import {
  fetchCurrentLocation,
  setSelectedLocation,
} from "./store/locationSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import "./MobileApp.css";
import Footer from "./components_mobile/Footer";
import Ads from "./pages_mobile/Ads";
import Account from "./components_mobile/Account";
import Modal from "./components_mobile/Modal";

function MobileApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const routeLocation = useLocation();

  const { selectedLocation } = useSelector((state) => state.location);

  const [recentLocations, setRecentLocations] = useLocalStorage(
    "recentLocations",
    null
  );

  useEffect(() => {
    if (country != "CA" && country != "US") getCountry();
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

  async function getCountry() {
    fetch("https://ipinfo.io/json")
      .then((response) => response.json())
      .then((data) => {
        if (data.country == "US") setCountry("US");
        else setCountry("CA");
      });
  }
  useEffect(() => {
    window.addEventListener("orientationchange", handleOrientationChange);

    try {
      handleOrientationChange();
    } catch (error) {}

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  const [country, setCountry] = useLocalStorage("country", null);

  function handleBack() {
    // e.preventDefault();

    const modals = Array.from(
      document.querySelectorAll("#portal .modal_overlay .modal_close")
    );

    if (!modals.length) return;
    modals[modals.length - 1].click();
  }
  useEffect(() => {
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
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
            <InfoComp>
              <h1>
                Please verify your account with the link sent to your email
                address.
              </h1>
            </InfoComp>
          }
        />
        <Route
          path="/verified"
          exact
          element={
            <InfoComp>
              <h1> Congratulations, your account has been verified!</h1>
            </InfoComp>
          }
        />
        <Route
          path="/verify-password-reset"
          exact
          element={
            <InfoComp>
              <h1>
                Please use the link sent to your email to reset your password
              </h1>
            </InfoComp>
          }
        />
        <Route
          path="/reset-password-successful"
          exact
          element={
            <InfoComp>
              <h1>
                Your password has been reset. You may log in with your new
                password now
              </h1>
            </InfoComp>
          }
        />
      </Routes>

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/messages" exact element={<Chat />} />
        <Route path="/messages/open" exact element={<Chat />} />
        <Route path="/ads" exact element={<Ads />} />
        <Route path="/help" exact element={<HelpDocs />} />
        <Route path="/help-doc/:id" exact element={<HelpDoc />} />
        <Route path="contact-us" exact element={<ContactUs />} />
        {/* 
        <Route element={<Ad />} path="/listing/:id" />
        <Route element={<Ad />} path="/preview-ad" /> */}
        <Route exact path="/post-ad" element={<PostAd />} />
        <Route exact path="/profile" element={<Account />} />
        <Route exact path="/profile/*" element={<Account />} />
        <Route exact path="/edit/:id" element={<PostAd edit={true} />} />

        <Route path="/user_profile" exact element={<UserProfile />} />
        <Route path="/saved_searches" exact element={<SavedSearches />} />

        <Route path="/pricing" exact element={<Pricing />} />
        <Route path="/listing/:id" exact element={<Ad />} />
        <Route path="/preview-ad" exact element={<Ad preview={true} />} />
      </Routes>
      {
        <Footer
          visible={
            ![
              "/login",
              "/register",
              "/messages/open",
              "/verify",
              "/post-ad",
            ].includes(routeLocation.pathname) &&
            !routeLocation.pathname.includes("/profile/") &&
            !routeLocation.pathname.includes("/listing/")
          }
        />
      }
    </div>
  );
}

export default MobileApp;
