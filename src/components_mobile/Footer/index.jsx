import React, { useEffect, useMemo, useRef, useState } from "react";
import { House } from "@styled-icons/fa-solid/House";
import { Chat } from "@styled-icons/fluentui-system-filled/Chat";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { AddCircle } from "@styled-icons/ionicons-outline/AddCircle";
import { PersonCircle } from "@styled-icons/ionicons-sharp/PersonCircle";
import { MoreCircle } from "@styled-icons/fluentui-system-filled/MoreCircle";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ripple from "../../utils/ripple";
import {
  AddCircleOutlineRounded,
  AddCircleRounded,
  Person,
  PersonRounded,
} from "@mui/icons-material";
import { createPortal } from "react-dom";

const Footer = ({ visible }) => {
  const user = useSelector((state) => state.auth);
  const routes = useMemo(
    () => [
      {
        name: "Home",
        icon: <House />,

        path: "/",
      },
      {
        name: "Chat",
        icon: <Chat />,
        path: "/messages",
      },

      {
        name: "Post Ad",
        icon: <AddCircle className="mid" />,
        path: "/post-ad",
      },
      {
        name: "My Ads",
        icon: <FavoriteRoundedIcon />,
        path: "/ads",
      },
      {
        name: "Account",
        icon: user ? <PersonCircle /> : <MoreCircle />,
        path: "/profile",
      },
    ],
    [user]
  );

  const [position, setPosition] = useState(6);

  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();

  const handleItemClick = (route) => {
    navigate(route.path);
  };

  useEffect(() => {
    if (visible) ref.current.classList.add("visible");
    else ref.current.classList.remove("visible");
  }, [visible]);

  function handleIndicator() {
    if (!visible) return;
    const items = Array.from(
      document.querySelectorAll(".mobile_footer .item_cont")
    );
    let notFound = true;
    items.forEach((i) => {
      if (Array.from(i.classList)?.includes("active")) {
        setPosition(i.offsetLeft);
        notFound = false;
      }
    });
    if (notFound) setPosition(-100);
  }
  useEffect(() => {
    handleIndicator();
  }, [location.pathname]);
  useEffect(() => {
    window.addEventListener("resize", handleIndicator);
    return () => window.removeEventListener("resize", handleIndicator);
  }, []);
  return createPortal(
    <nav className="mobile_footer" ref={ref}>
      <div
        className="indicator"
        style={{ transform: `translateX(${position}px)` }}
      ></div>
      {routes.map((route) => (
        <li
          key={route.name}
          className={`item_cont ${
            location.pathname === route.path ? "active" : ""
          }`}
          onClick={(e) => {
            handleItemClick(route);
          }}
        >
          {route.icon}
        </li>
      ))}
    </nav>,
    document.querySelector("#portal")
  );
};

export default Footer;
