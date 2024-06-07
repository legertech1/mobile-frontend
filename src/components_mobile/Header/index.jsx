import {
  ArrowRight,
  ArrowRightAlt,
  ArrowRightAltRounded,
  ArrowRightRounded,
  SearchRounded,
} from "@mui/icons-material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import React from "react";
import MobileLogo from "../../assets/images/MainLogo.svg";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ripple from "../../utils/ripple";
function Header() {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="_header">
      <div className="logo">
        <img src={MobileLogo} alt="" onClick={(e) => navigate("/")} />
      </div>
      {user && (
        <>
          <div className="notifications option" onClick={(e) => ripple(e, 2)}>
            <NotificationsNoneRoundedIcon
              sx={{ stroke: "#2196f3", strokeWidth: 0.6 }}
            />
          </div>

          <div className="user option" onClick={(e) => ripple(e, 2)}>
            <img src={user.image} alt="" style={{ pointerEvents: "none" }} />
          </div>
        </>
      )}
      {!user && (
        <div
          className="sign-in-btn"
          onClick={(e) => {
            ripple(e);
            navigate("/login");
          }}
        >
          Sign in <ArrowRightRounded />
        </div>
      )}
    </div>
  );
}

export default Header;
