import React, { useState } from "react";
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
  const [code2, setCode2] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeSent2, setCodeSent2] = useState(false);
  const notification = useNotification();

  const submit = async () => {
    if (!email) return notification.error("Current email is required");
    if (!newEmail) return notification.error("New email is required");
    if (!validateEmail(email) || !validateEmail(newEmail))
      return notification.error("please enter a valid email");
    if (!code)
      return notification.error(
        "Verification code from current email is required"
      );
    if (!code2)
      return notification.error("Verification code from new email is required");
    if (!password) return notification.error("Password is required");
    if (!validatePassword(password))
      return notification.error("Please enter a valid password");

    try {
      const res = await axios.post(apis.changeEmail, {
        code1: code,
        password,
        code2,
        email1: email,
        email2: newEmail,
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
        <AlternateEmailOutlinedIcon /> Change Email
      </h1>
      <div className="section">
        <div className="inp">
          <AlternateEmailOutlinedIcon />
          <input
            placeholder="Current email address"
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
                subject: "to change your email",
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
          <h2> Code from current email:</h2>
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
          <AlternateEmailOutlinedIcon />
          <input
            placeholder="New email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button
          className="btn_blue_m btn_sm"
          onClick={async () => {
            if (!newEmail) return notification.error("new email is required");
            if (!validateEmail(newEmail))
              return notification.error("Please enter a valid email");
            try {
              const res = await axios.post(apis.createVerificationCode, {
                subject: "to verify your new email",
                email: newEmail,
              });
              notification.success(res.data);
              setCodeSent2(true);
            } catch (err) {
              notification.error( err?.response?.data || err.message);;
            }
          }}
          disabled={!codeSent}
        >
          Send Code
        </button>
      </div>
      <div className="section">
        <div className="inp">
          <h2> Code from new email:</h2>
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
            value={code2}
            onChange={(e) => setCode2(e.target.value.slice(0, 6))}
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
        <button
          className="btn_blue_m btn_sm"
          //   disabled={!codeSent2}
          onClick={submit}
        >
          Change email
        </button>
      </div>
    </>
  );
}

export default CreatePassword;
