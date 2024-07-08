import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, me } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { LogoutOutlined } from "@mui/icons-material";
import "./index.css";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();

  async function handleLogout() {
    dispatch(logout());
  }

  return (
    <div className="account">
      <div className="profile_card">
        <div className="main">
          <img src={user?.image} alt="" />
          <div className="profile_card_info">
            <h3>
              {user?.firstName} {user?.lastName}
            </h3>
            <p>{user?.email}</p>
            <button onClick={() => navigate("/view-profile")} id="btn_vaep_1">
              View and edit Profile
            </button>
          </div>
        </div>
        <div>
          <button onClick={() => navigate("/view-profile")} id="btn_vaep_2">
            View and edit Profile
          </button>
        </div>
      </div>
      <div className="account_menu">
        <div
          className="menu_option"
          onClick={() => navigate("/account_settings")}
        >
          <SettingsOutlinedIcon /> Account Settings
        </div>

        <div
          className="menu_option"
          onClick={() => navigate("/saved_searches")}
        >
          <BookmarkBorderOutlinedIcon /> Saved Searches
        </div>
        <hr />
        <div className="menu_option" onClick={() => navigate("/pricing")}>
          <PaidOutlinedIcon /> Pricing
        </div>
        <div className="menu_option">
          <LanguageOutlinedIcon /> Language
        </div>
        <div onClick={() => navigate("/contact-us")} className="menu_option">
          <EmailOutlinedIcon />
          Contact us
        </div>
        <div onClick={() => navigate("/help")} className="menu_option">
          <HelpOutlineIcon /> Help
        </div>

        <hr />
        <div className="menu_option" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </div>
      </div>
    </div>
  );
}
