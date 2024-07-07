import React, { useCallback, useRef, useState } from "react";
import "./index.css";
import MobileLogo from "../../assets/images/MainLogo.svg";
import {
  AlternateEmailRounded,
  Facebook,
  Google,
  KeyRounded,
  PersonRounded,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import validateEmail from "../../utils/validateEmail";
import useNotification from "../../hooks/useNotification";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import apis from "../../services/api";
import ripple from "../../utils/ripple";
function Login() {
  let notification = useNotification();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ref = useRef();

  const navigate = useNavigate();
  const submit = useCallback(async () => {
    if (!validateEmail(email))
      return notification.error("Please enter a valid email");
    if (!password.length)
      return notification.error("Please enter your password");

    try {
      await axios.post(apis.login, {
        email: email.toLowerCase(),
        password,
      });

      // dispatch(me());
      navigate("/");
      window.location.reload();
    } catch (err) {
      return notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
    }
  }, [email, password]);

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "email") {
        if (!validateEmail(email)) {
          return notification.error("Please enter a valid email");
        } else {
          ref.current.focus();
        }
      } else if (field === "password") {
        if (!password.length) {
          return notification.error("Please enter your password");
        } else {
          submit();
        }
      }
    }
  }
  return (
    <div className="_login">
      {/* <Header /> */}

      <div className="bg"></div>

      <div className="main">
        <img
          src={MobileLogo}
          alt=""
          className="logo"
          onClick={(e) => navigate("/")}
        />
        <h1>Hello again!</h1>
        <div className="inp">
          <AlternateEmailRounded />
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyPress={(e) => handleKeyPress(e, "email")}
          />
        </div>
        <div className="inp">
          <KeyRounded />{" "}
          <input
            placeholder="Password"
            type={show ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            ref={ref}
          />
          {!show ? (
            <span onClick={() => setShow(!show)}>
              <VisibilityOffIcon />
            </span>
          ) : (
            <span onClick={() => setShow(!show)}>
              <VisibilityIcon />
            </span>
          )}
        </div>
        <button
          className="sign-in btn_classic"
          onClick={(e) => ripple(e, { dur: 2, cb: submit })}
        >
          Sign In
        </button>
        <p className="alt">
          <span>
            <Link to={"/forgot-password"}>Forgot Password?</Link>
          </span>
        </p>
        <div className="alt-methods">
          <p>
            <hr /> or sign in with <hr />
          </p>
          <div className="buttons">
            <button
              onClick={(e) =>
                (window.location.href =
                  process.env.REACT_APP_BASE_URL + apis.googleOAuth)
              }
            >
              <Google />
              Google
            </button>
            <button
              onClick={(e) =>
                (window.location.href =
                  process.env.REACT_APP_BASE_URL + apis.facebookOAuth)
              }
            >
              <Facebook />
              Facebook
            </button>
          </div>
        </div>
        <p className="footer">
          Don't have an account yet? <Link to={"/register"}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
