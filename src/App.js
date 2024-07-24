import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { me } from "./store/authSlice";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PostAd from "./pages/PostAd";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import { fetchCategories } from "./store/categorySlice";
import ViewListing from "./pages/ViewListing";
import { socket, init, loadChats, getNotifications } from "./socket";
import Messages from "./pages/Messages";
import IconPlayer from "./components/IconPlayer";
import blackAnimatedLOGO from "./assets/animatedIcons/animated_black_LOGO.json";
import {
  fetchCurrentLocation,
  setSelectedLocation,
} from "./store/locationSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import Help from "./pages/Help/index";
import HelpDoc from "./pages/Help/HelpDoc";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import NotFound from "./components/NotFound";
import Cookies from "js-cookie";
import CookieConsent from "./components/CookieConsent";
import ManageAds from "./pages/ManageAds";
import { getBalance } from "./store/balanceSlice";
import InfoComp from "./components/InfoComp";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { selectedLocation, currentLocation } = useSelector(
    (state) => state.location
  );



  const [country, setCountry] = useLocalStorage("country", null);

  const [recentLocations, setRecentLocations] = useLocalStorage(
    "recentLocations",
    []
  );

  async function getCountry() {
    fetch("https://ipinfo.io/json")
      .then((response) => response.json())
      .then((data) => {
        if (data.country == "US") setCountry("US");
        else setCountry("CA");
      });
  }
  const [showCc, setShowCc] = useState(!Cookies.get("cc"));

  useEffect(() => {
    if (recentLocations[0]) dispatch(setSelectedLocation(recentLocations[0]));
    if (country != "CA" && country != "US") getCountry();

    dispatch(fetchCategories());

    dispatch(fetchCurrentLocation());
    dispatch(me());
    dispatch(getBalance());
    init(socket, dispatch);
    document.body.click();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    user && loadChats(socket);
    user && getNotifications(socket);
   
  }, [user]);

  return (
    <div className="__app">


      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/search" exact element={<Search />} />
        <Route
          path="/profile"
          exact
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          exact
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          exact
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          exact
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          exact
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/post-ad"
          exact
          element={
            <PrivateRoute>
              <PostAd />
            </PrivateRoute>
          }
        />
        <Route
          path="/ads"
          exact
          element={
            <PrivateRoute>
              <ManageAds />
            </PrivateRoute>
          }
        />
        <Route
          path="/preview-ad"
          exact
          element={
            <PrivateRoute>
              <ViewListing preview={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          exact
          element={
            <PrivateRoute>
              <PostAd edit={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/preview/:id"
          exact
          element={
            <PrivateRoute>
              <ViewListing edit={true} preview={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/settings"
          exact
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          exact
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          exact
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />
        <Route path="contact-us" exact element={<ContactUs />} />
        <Route path="faq" exact element={<Faq />} />
        <Route path="help" exact element={<Help />} />
        <Route path="help-doc/:id" exact element={<HelpDoc />} />
        <Route path="/listing/:id" exact element={<ViewListing />} />
        <Route path="/user/:id" exact element={<Profile />} />

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
        <Route
          path="*"
          element={
            <NotFound title={"The page you are looking for does not exist"} />
          }
        />
      </Routes>
      {showCc && <CookieConsent close={() => setShowCc(false)} />}
    </div>
  );
}

// PrivateRoute
// if user is logged in, allow access to the route
// wrap the routes that should only be accessed by logged in users in this component
function PrivateRoute({ children }) {
  let navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    } else {
    }
  }, [user]);

  return user === false || user === null ? (
    <div className="logo_loader">
      <IconPlayer icon={blackAnimatedLOGO} />
    </div>
  ) : (
    children
  );
}

// PublicRoute
// if user is logged in and tries to access login or register page, redirect to home
// wrap the login and register routes in this component and any other routes that should not be accessed by logged in users
function PublicRoute({ children }) {
  let navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return user === false ? (
    <div className="logo_loader">
      <IconPlayer icon={blackAnimatedLOGO} />
    </div>
  ) : (
    children
  );
}

export default App;
