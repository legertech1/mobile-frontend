import React from "react";

import MobileLogo from "../../assets/images/MainLogo.svg";
function Login() {
  return (
    <div className="_login">
      
      <div className="header"></div>

      <div className="main">
        <img src={MobileLogo} alt="" className="logo" />
      </div>
    </div>
  );
}

export default Login;
