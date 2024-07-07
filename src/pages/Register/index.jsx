import React, { useRef, useState } from "react";

import Navbar from "../../components/Navbar";
import "../Login/index.css";
import Email from "@mui/icons-material/AlternateEmail";
import Pass from "@mui/icons-material/Key";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import apis from "../../services/api";
import Checkbox from "../../components/Shared/Checkbox";
import useNotification from "../../hooks/useNotification";
import { BASE_URL } from "../../utils/constants";

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
    if (!name) return setNameError(true);
    if (!validateEmail(email)) return setEmailError(true);
    if (!validatePassword(password)) return setPasswordError(true);

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
    <div className="login">
      <Navbar white={true}></Navbar>
      <div className="main">
        <div className="fields">
          <h2>Sign Up to BorrowBe</h2>
          {error && <div className="server_error">{error}</div>}

        
          <div className="terms_and_condition">
            <Checkbox checked={termsChecked} setChecked={setTermsChecked} />
            <p>
              I agree to the{" "}
              <span>
                <Link target="_blank" to={`/help-doc/terms-of-use`}>
                  Terms of Service
                </Link>
              </span>{" "}
              and{" "}
              <span>
                <Link target="_blank" to={`/help-doc/privacy-policy`}>
                  Privacy Policy.
                </Link>
              </span>
            </p>
          </div>

          <button className="btn_classic" onClick ={e => ripple(e , {dur:2, cb: submit})}>
            {" "}
            Sign Up
          </button>
          <div className="links">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                <span>Sign In</span>
              </Link>
            </p>
            <span></span>
          </div>
        </div>
        <p>
          {" "}
          <hr />
          or <hr />
        </p>
        <div className="sign_in_options">
          <h3>Sign Up with</h3>
          <div>
            <button
              onClick={
                (e) =>
                  (window.location.href =
                    process.env.REACT_APP_BASE_URL + apis.googleOAuth)
                // console.log(BASE_URL)
              }
            >
              <GoogleIcon></GoogleIcon>
              Google
            </button>
            <button
              onClick={
                (e) =>
                  (window.location.href =
                    process.env.REACT_APP_BASE_URL + apis.facebookOAuth)
                // console.log(process.env)
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
