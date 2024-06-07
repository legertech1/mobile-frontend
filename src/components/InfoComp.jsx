import React from "react";
import LOGO from "../assets/images/MainLogoBlack.svg";
import "./InfoComp.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
function Verify({ children }) {
  return (
    <>
      <div className="info_page">
        <Navbar white={true} topOnly={true} />
        <div className="main">
          <div className="logo">
            <img src={LOGO} alt="" />
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Verify;
