import React, { useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ripple from "../../utils/ripple";
import {
  AddCircleOutlineRounded,
  AddCircleRounded,
  Person,
  PersonRounded,
} from "@mui/icons-material";

const routes = [
  {
    name: "Home",
    icon: <HomeRoundedIcon />,

    path: "/",
  },
  {
    name: "Chat",
    icon: <ChatBubbleRoundedIcon />,
    path: "/messages",
  },

  {
    name: "Post Ad",
    icon: <AddCircleOutlineRounded className="mid" />,
    path: "/post-ad",
  },
  {
    name: "My Ads",
    icon: <FavoriteRoundedIcon />,
    path: "/wishlist/ads",
  },
  {
    name: "Account",
    icon: <PersonRounded />,
    path: "/profile",
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (route) => {
    navigate(route.path);
  };

  return (
    <nav className="mobile_footer">
      {routes.map((route) => (
        <li
          key={route.name}
          className={`item_cont ${
            location.pathname === route.path ? "active" : ""
          }`}
          onClick={(e) => {
            ripple(e, 2);
            handleItemClick(route);
          }}
        >
          {route.icon}
        </li>
      ))}
    </nav>
  );
};

export default Footer;
