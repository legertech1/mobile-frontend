import React, { useRef, useState } from "react";

import Navbar from "../../components/Navbar";
import "../Login/index.css";
import Email from "@mui/icons-material/AlternateEmail";

import { Link, useNavigate } from "react-router-dom";
import validateEmail from "../../utils/validateEmail";

import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import apis from "../../services/api";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const emailRef = useRef();
  const [emailError, setEmailError] = useState(false);
  const emailInfo = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const inputRefs = {
    email: useRef(),
  };

  async function submit() {
    if (!validateEmail(email)) return setEmailError(true);
    try {
      await axios.get(apis.forgotPassword + "/" + email);
    } catch (err) {
      return setError(err.response.data.error);
    }
    navigate("/verify-password-reset");
  }

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "email") {
        if (!validateEmail(email)) {
          setEmailError(true);
          inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
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
          <h2>Reset your password</h2>
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

          <button className="btn_classic" onClick ={e => ripple(e , {dur:2, cb: submit})}>
            {" "}
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
