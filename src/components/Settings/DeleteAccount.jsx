import React, { useState } from "react";
import PasswordIcon from "@mui/icons-material/Password";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyIcon from "@mui/icons-material/Key";
import axios from "axios";
import apis from "../../services/api";
import useNotification from "../../hooks/useNotification";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import ripple from "../../utils/ripple";
import {
  DeleteForeverOutlined,
  RemoveCircleOutline,
} from "@mui/icons-material";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
function CreatePassword({ close }) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const notification = useNotification();
  const confirm = useConfirmDialog();
  const submit = async () => {
    if (!code) return notification.error("Verification code is required");
    if (!password) return notification.error("Password is required");
    if (!validatePassword(password))
      return notification.error("Please enter a valid password");

    confirm.openDialog(
      "Are you sure you want to delete your account? All data including your Ads , Chats and Borrowbe Balance will be deleted with no way to restore back.",
      async () => {
        try {
          const res = await axios.post(apis.deleteAccount, {
            code,
            password,
            email,
          });

          notification.success(res.data);
          window.location.reload();
          close();
        } catch (err) {
          notification.error(err?.response?.data || err.message);
        }
      }
    );
  };
  return (
    <>
      <h1 className="delete">
        <RemoveCircleOutline /> Delete Account
      </h1>
      <div className="section">
        <p>
          Get a verification code on your registered email and enter it below.
        </p>
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
                subject: "to delete your account",
                email,
              });
              notification.success(res.data);
              setCodeSent(true);
            } catch (err) {
              notification.error(err?.response?.data || err.message);
            }
          }}
        >
          Send Code
        </button>

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
        <p>
          Confirm your password and click the button to remove your account.
        </p>
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
          className="btn_blue_m btn_sm delete"
          disabled={!codeSent}
          onClick ={e => ripple(e , {dur:2, cb: submit})}
        >
          <PersonOffOutlinedIcon /> Delete Account
        </button>
      </div>
    </>
  );
}

export default CreatePassword;
