import React, { useState } from "react";
import PasswordIcon from "@mui/icons-material/Password";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyIcon from "@mui/icons-material/Key";
import axios from "axios";
import apis from "../../services/api";
import useNotification from "../../hooks/useNotification";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
function CreatePassword({ close }) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const notification = useNotification();
  const [confirmPass, setConfirmPass] = useState("");

  const submit = async () => {
    if (!code) return notification.error("Verification code is required");
    if (!password) return notification.error("Password is required");
    if (!validatePassword(password))
      return notification.error(
        "Password should contain at least one special character, one number and be 8 characters long"
      );
    if (password != confirmPass)
      return notification.error("Passwords do not match");
    try {
      const res = await axios.post(apis.createPassword, {
        subject: "to create your password",
        code,
        password,
        email,
      });

      notification.success(res.data);
      window.location.reload();
      close();
    } catch (err) {
      notification.error( err?.response?.data || err.message);;
    }
  };
  return (
    <>
      <h1>
        <PasswordIcon /> Create Password
      </h1>
      <div className="section">
        <div className="inp">
          <AlternateEmailOutlinedIcon />
          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="btn_blue_m btn_sm"
          onClick={async () => {
            if (!email) return notification.error("Email is required");
            if (!validateEmail(email))
              return notification.error("Please enter a valid email");
            try {
              const res = await axios.post(apis.createVerificationCode, {
                subject: "to create your password",
                email,
              });
              notification.success(res.data);
              setCodeSent(true);
            } catch (err) {
              notification.error( err?.response?.data || err.message);;
            }
          }}
        >
          Send Code
        </button>
      </div>
      <div className="section">
        <div className="inp">
          <h2> Verification Code:</h2>
          <input
            placeholder=""
            type="number"
            style={{
              fontSize: "28px",
              letterSpacing: "2px",
              fontWeight: "600",
              fontFamily: "var(--font1)",
              width: "200px",
              color: "var(--blue)",
            }}
            min="0"
            max="999999"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.slice(0, 6))}
          />
        </div>
      </div>
      <div className="section">
        <div className="inp">
          <KeyIcon />
          <input
            placeholder="Password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!show ? (
            <VisibilityOffIcon onClick={() => setShow(!show)} />
          ) : (
            <VisibilityIcon onClick={() => setShow(!show)} />
          )}
        </div>
      </div>
      <div className="section">
        <div className="inp">
          <KeyIcon />
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        <button
          className="btn_blue_m btn_sm"
          disabled={!codeSent}
          onClick={submit}
        >
          Create Password
        </button>
      </div>
    </>
  );
}

export default CreatePassword;
