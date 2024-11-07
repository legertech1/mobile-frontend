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
import { useSelector } from "react-redux";

import { createPortal } from "react-dom";

const Footer = ({ visible }) => {
  const user = useSelector((state) => state.auth);
  const [scrollDirection, setScrollDirection] = useState("up");
  const routes = useMemo(
    () => [
      {
        name: "Home",
        icon: <House className="home" />,

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
        icon: user ? (
          <PersonCircle className="profile" />
        ) : (
          <MoreCircle className="profile" />
        ),
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
    setScrollDirection("up");
  };

  useEffect(() => {
    if (visible && scrollDirection == "up")
      ref.current.classList.add("visible");
    else ref.current.classList.remove("visible");
  }, [visible, scrollDirection]);

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

  useEffect(() => {
    let touchStartY = 0;

    // Desktop scroll handler
    const handleScroll = () => {
      const direction = window.scrollY > touchStartY ? "down" : "up";
      setScrollDirection(direction);
      touchStartY = window.scrollY;
    };

    // Mobile touch start handler
    const handleTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
    };

    // Mobile touch move handler
    const handleTouchMove = (event) => {
      const touchEndY = event.touches[0].clientY;
      const direction = touchEndY < touchStartY ? "down" : "up";
      setScrollDirection(direction);
      touchStartY = touchEndY;
    };
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        setScrollDirection("down");
      } else if (event.deltaY < 0) {
        setScrollDirection("up");
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel); // for wheel events on desktop
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  return createPortal(
    <nav className="mobile_footer" ref={ref}>
      <div
        className="indicator"
        style={
          position > 0
            ? { transform: `translateX(${position}px)` }
            : { display: "none" }
        }
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
