import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import "../Login/index.css";
import Pass from "@mui/icons-material/Key";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import validatePassword from "../../utils/validatePassword";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import apis from "../../services/api";

function ResetPassword() {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const inputRefs = {
    pass1: useRef(),
    pass2: useRef(),
  };

  const passRef = useRef();
  const pass2Ref = useRef();

  const [passwordError, setPasswordError] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);

  const passwordInfo = useRef();
  const password2Info = useRef();

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  async function submit() {
    if (!validatePassword(password)) return setPasswordError(true);
    if (password != password2) return setPassword2Error(true);

    try {
      await axios.post(apis.resetPassword, {
        token,
        password,
      });
    } catch (err) {
      return setError(err.response.data.error);
    }
    navigate("/reset-password-successful");
  }

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "pass1") {
        if (!validatePassword(password)) {
          setPasswordError(true);
          inputRefs.pass1.current.scrollIntoView({ behavior: "smooth" });
        } else {
          inputRefs.pass2.current.focus();
        }
      } else if (field === "pass2") {
        if (password != password2) {
          setPassword2Error(true);
          inputRefs.pass2.current.scrollIntoView({ behavior: "smooth" });
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
          <h2>Set new Password</h2>
          {error && <div className="server_error">{error}</div>}

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
              placeholder="New password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
                setError(false);
              }}
              ref={inputRefs.pass1}
              onKeyPress={(e) => handleKeyPress(e, "pass1")}
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
                <div ref={passwordInfo}>
                  Password should contain at least one special character, one
                  number and be 8 characters long
                </div>{" "}
                <InfoIcon />
              </p>
            )}
          </div>
          <div
            className="inp"
            ref={pass2Ref}
            style={password2Error ? { borderColor: "var(--error)" } : {}}
          >
            <Pass></Pass>
            <input
              type={show ? "text" : "password"}
              name=""
              id=""
              placeholder="Confirm Password"
              onChange={(e) => {
                setPassword2(e.target.value);
                setPassword2Error(false);
                setError(false);
              }}
              ref={inputRefs.pass2}
              onKeyPress={(e) => handleKeyPress(e, "pass2")}
              value={password2}
            />

            {password2Error && (
              <p
                className="error"
                onMouseOver={() =>
                  password2Info.current.classList.toggle("show")
                }
                onMouseOut={() =>
                  password2Info.current.classList.toggle("show")
                }
              >
                <div ref={password2Info}>Passwords don't match</div>{" "}
                <InfoIcon />
              </p>
            )}
          </div>

          <button className="btn_classic" onClick={submit}>
            {" "}
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
