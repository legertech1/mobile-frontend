import React, { useCallback, useRef, useState } from "react";

import Navbar from "../../components/Navbar";
import "../Login/index.css";
import Email from "@mui/icons-material/AlternateEmail";
import Pass from "@mui/icons-material/Key";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import validateEmail from "../../utils/validateEmail";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { useDispatch } from "react-redux";
import { me } from "../../store/authSlice";
import apis from "../../services/api";
import useNotification from "../../hooks/useNotification";

function Login() {
  let notification = useNotification();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passRef = useRef();
  const emailRef = useRef();
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const emailInfo = useRef();
  const passwordInfo = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const inputRefs = {
    email: useRef(),
    password: useRef(),
  };

  const submit = useCallback(async () => {
    if (!validateEmail(email)) return setEmailError(true);
    if (!password.length) return setPasswordError(true);

    try {
      await axios.post(apis.login, {
        email: email.toLowerCase(),
        password,
      });

      // dispatch(me());
      navigate("/");
      window.location.reload();
    } catch (err) {
      notification.error(err?.response?.data?.error || err?.response?.data || err?.message);
      return setError(err?.response?.data?.error  || err?.response?.data?.error
      );
    }
  }, [email, password]);

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "email") {
        if (!validateEmail(email)) {
          setEmailError(true);
          inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
        } else {
          inputRefs.password.current.focus();
        }
      } else if (field === "password") {
        if (!password.length) {
          setPasswordError(true);
          inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
        } else {
          submit();
        }
      }
    }
  }

  return (
    <div className="login">
      <Navbar white={true}></Navbar>
      <div className="main">
        <div className="fields">
          <h2>Sign in to BorrowBe</h2>

          {error && <div className="server_error">{error}</div>}

          <div
            className="inp"
            ref={emailRef}
            style={emailError ? { borderColor: "var(--error)" } : {}}
          >
            <Email></Email>
            <input
              type="email"
              name=""
              id=""
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
                setError(false);
              }}
              onKeyPress={(e) => handleKeyPress(e, "email")}
              ref={inputRefs.email}
              value={email}
            />
            {emailError && (
              <p
                className="error"
                onMouseOver={() => emailInfo.current.classList.toggle("show")}
                onMouseOut={() => emailInfo.current.classList.toggle("show")}
              >
                <div ref={emailInfo}>Please enter a valid email</div>{" "}
                <InfoIcon />
              </p>
            )}
          </div>

          <div
            className="inp"
            ref={passRef}
            style={passwordError ? { borderColor: "var(--error)" } : {}}
          >
            <Pass></Pass>
            <input
              type={show ? "text" : "password"}
              name=""
              id=""
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
                setError(false);
              }}
              ref={inputRefs.password}
              onKeyPress={(e) => handleKeyPress(e, "password")}
              value={password}
            />

            {!show ? (
              <VisibilityOffIcon onClick={() => setShow(!show)} />
            ) : (
              <VisibilityIcon onClick={() => setShow(!show)} />
            )}
            {passwordError && (
              <p
                className="error"
                onMouseOver={() =>
                  passwordInfo.current.classList.toggle("show")
                }
                onMouseOut={() => passwordInfo.current.classList.toggle("show")}
              >
                <div ref={passwordInfo}>Please enter your password</div>{" "}
                <InfoIcon />
              </p>
            )}
          </div>
          <button className="btn_classic" onClick={submit}>
            {" "}
            Sign In
          </button>
          <div className="links">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                <span>Sign Up</span>
              </Link>
            </p>
            <Link to="/forgot-password">
              {" "}
              <span>Forgot Password?</span>
            </Link>
          </div>
        </div>
        <p>
          {" "}
          <hr />
          or <hr />
        </p>
        <div className="sign_in_options">
          <h3>Sign in with</h3>
          <div>
            <button
              onClick={(e) =>
                (window.location.href =
                  process.env.REACT_APP_BASE_URL + apis.googleOAuth)
              }
            >
              <GoogleIcon></GoogleIcon>
              Google
            </button>
            <button
              onClick={(e) =>
                (window.location.href =
                  process.env.REACT_APP_BASE_URL + apis.facebookOAuth)
              }
            >
              <FacebookIcon></FacebookIcon>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
