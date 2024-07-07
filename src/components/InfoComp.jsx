import React from "react";
import LOGO from "../assets/images/MainLogoBlack.svg";
import "./InfoComp.css";
import Header from "../components_mobile/Header";
import { useNavigate } from "react-router-dom";

function Verify({ children }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="info_page">
        <div className="main">
          <div className="logo">
            <img src={LOGO} alt="" onClick={(e) => navigate("/")} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

export default Verify;
