import React from "react";
import "../Login/index.css";
import MobileLogo from "../../assets/images/MainLogo.svg";
import {
  AlternateEmailRounded,
  Facebook,
  Google,
  KeyRounded,
  PersonRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="_login">
      {/* <Header /> */}

      <div className="bg"></div>

      <div className="main">
        <img src={MobileLogo} alt="" className="logo" />
        <h1>Hello again!</h1>
        <div className="inp">
          <AlternateEmailRounded />
          <input placeholder="Email Address" />
        </div>
        <div className="inp">
          <KeyRounded /> <input placeholder="Password" />
        </div>
        <button className="sign-in btn_classic">Sign in</button>
        <p className="alt">
          <span>
            <Link to={"/signup"}>Forgot Password?</Link>
          </span>
        </p>
        <div className="alt-methods">
          <p>
            <hr /> or sign in with <hr />
          </p>
          <div className="buttons">
            <button>
              <Google /> Google
            </button>
            <button>
              <Facebook /> Facebook
            </button>
          </div>
        </div>
        <p className="footer">
          Don't have an account yet? <Link>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
