import React, { useRef, useState } from "react";
import "../Login/index.css";
import MobileLogo from "../../assets/images/MainLogo.svg";
import ripple from "../../utils/ripple";
import {
  AlternateEmailRounded,
  Facebook,
  Google,
  KeyRounded,
  PersonRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "../../components_mobile/shared/Checkbox";
import useNotification from "../../hooks/useNotification";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import axios from "axios";
import apis from "../../services/api";
function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const passRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const emailInfo = useRef();
  const passwordInfo = useRef();
  const nameInfo = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const inputRefs = {
    name: useRef(),
    email: useRef(),
    password: useRef(),
  };
  const [termsChecked, setTermsChecked] = useState(false);
  let notification = useNotification();

  async function submit() {
    console.log("..");
    if (!name) return notification.error("Please enter full name.");
    if (!validateEmail(email))
      return notification.error("Please enter a valid email.");
    if (!validatePassword(password))
      return notification.error(
        "  Password should contain at least one special character, one number and be 8 characters long"
      );

    if (!termsChecked)
      return notification.error("Please accept terms and conditions");

    let names = name.trim().split(" ");
    let firstName = names[0][0].toUpperCase() + names[0].slice(1);
    let lastName = "";
    for (let i = 1; i < names.length; i++) {
      lastName += names[i][0].toUpperCase() + names[i].slice(1) + " ";
    }
    lastName = lastName.trim();
    try {
      await axios.post(apis.register, {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
      });
    } catch (err) {
      notification.error(err.response.data.error);
      return setError(err.response.data.error);
    }
    navigate("/verify");
  }

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "name") {
        if (!name) {
          setNameError(true);
          inputRefs.name.current.scrollIntoView({ behavior: "smooth" });
        } else {
          inputRefs.email.current.focus();
        }
      } else if (field === "email") {
        if (!validateEmail(email)) {
          setEmailError(true);
          inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
        } else {
          inputRefs.password.current.focus();
        }
      } else if (field === "password") {
        if (!validatePassword(password)) {
          setPasswordError(true);
          inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
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
        <img src={MobileLogo} alt="" className="logo" />
        <h1 className="sm">Let's get started!</h1>

        <div className="inp" ref={nameRef}>
          <PersonRounded />
          <input
            type="text"
            name=""
            id=""
            placeholder="Full Name"
            onChange={(e) => {
              setName(e.target.value);
              setNameError(false);
              setError(false);
            }}
            onKeyPress={(e) => handleKeyPress(e, "name")}
            ref={inputRefs.name}
            value={name}
          />
        </div>

        <div className="inp" ref={emailRef}>
          <AlternateEmailRounded />
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
        </div>

        <div className="inp" ref={passRef}>
          <KeyRounded />
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
            onKeyPress={(e) => handleKeyPress(e, "password")}
            ref={inputRefs.password}
            value={password}
          />

          {!show ? (
            <span onClick={() => setShow(!show)}>
              {" "}
              <VisibilityOff />
            </span>
          ) : (
            <span onClick={() => setShow(!show)}>
              {" "}
              <Visibility />
            </span>
          )}
        </div>
        <button className="sign-in btn_classic" onClick ={e => ripple(e , {dur:2, cb: submit})}>
          Sign Up
        </button>
        <p className="agreement">
          <Checkbox checked={termsChecked} setChecked={setTermsChecked} />
          <span>
            I agree to the <Link>Terms of Service</Link> and{" "}
            <Link>Privacy Policy</Link>.
          </span>
        </p>
        <div className="alt-methods">
          <p>
            <hr /> or sign up with <hr />
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
          Already have an account? <Link to={"/login"}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
