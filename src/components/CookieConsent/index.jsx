import React from "react";

import LOGO from "../../assets/images/MainLogoBlack.svg";
import "./index.css";
import Cookie from "js-cookie";
function CookieConsent({ close }) {
  return (
    <div className="cookie_consent">
      <img src={LOGO} alt="" />
      <h2>
        Our website uses cookies. Please note that certain cookies are essential
        for the functionality of our website. Your experience may be enhanced by
        allowing all cookies.{" "}
      </h2>
      <button
        className="accept_all"
        onClick={() => {
          Cookie.set("cc", "all");
          close();
        }}
      >
        Accept All Cookies
      </button>
      <button
        className="accept_required"
        onClick={() => {
          Cookie.set("cc", "required");
          close();
        }}
      >
        Accept Required Cookies
      </button>
    </div>
  );
}

export default CookieConsent;
