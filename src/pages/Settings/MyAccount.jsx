import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Shared/Input";
import Button from "../../components/Shared/Button";
import FieldError from "../../components/FieldError";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, me } from "../../store/authSlice";
import useNotification from "../../hooks/useNotification";
import apis from "../../services/api";
import "./MyAccount.css";

export default function MyAccount() {
  const [loading, setLoading] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [OldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // error states
  const [oldPassError, setOldPassError] = useState(false);
  const [newPassError, setNewPassError] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [newEmailError, setNewEmailError] = useState(false);
  const [oldEmailError, setOldEmailError] = useState(false);

  const notification = useNotification();
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOldPassChange = (e) => {
    setOldPass(e.target.value);
  };
  const handleNewPassChange = (e) => {
    setNewPass(e.target.value);
  };
  const handleConfirmPassChange = (e) => {
    setConfirmPass(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const showAlert = (message) => {
    notification.error(message);
  };

  const changeUserPassword = async (payload) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.post(apis.changePassword, payload);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setLoading(false);
      showAlert(response.data.info);
    } catch (error) {
      showAlert(error.response.data.error);
      setLoading(false);
    }
  };

  const deleteUserAccount = async (payload) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.post(apis.deleteAccount, payload);
      setLoading(false);
      setEmail("");
      setPassword("");
      showAlert(response.data.info);
      dispatch(logout());
      dispatch(me());
      navigate("/");
    } catch (error) {
      showAlert(error.response.data.error);
      setLoading(false);
    }
  };

  const validateChangePassword = useCallback(() => {
    let allErrors = [
      oldPass.length === 0,
      newPass.length === 0,
      confirmPass.length === 0,
    ];
    if (!oldPass) {
      setOldPassError(true);
    } else {
      setOldPassError(false);
    }
    if (!newPass) {
      setNewPassError(true);
    } else {
      setNewPassError(false);
    }
    if (!confirmPass) {
      setConfirmPassError(true);
    } else {
      setConfirmPassError(false);
    }

    if (allErrors.includes(true)) return;

    if (newPass !== confirmPass) {
      showAlert("Passwords do not match");
      return;
    }

    if (!validatePassword(newPass)) {
      showAlert(
        "Password should contain at least one special character, one number and be 8 characters long"
      );
      return;
    }

    // if both passwords are same
    if (oldPass === newPass) {
      showAlert("New password cannot be same as old password");
      return;
    }

    const payload = {
      oldPassword: oldPass,
      newPassword: newPass,
    };

    changeUserPassword(payload);
  }, [oldPass, newPass, confirmPass]);

  const validateDeleteAccount = useCallback(() => {
    let allErrors = [email.length === 0, password.length === 0];
    if (!email) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (!password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (allErrors.includes(true)) return;

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email");
      return;
    }

    if (!validatePassword(password)) {
      showAlert(
        "Password should contain at least one special character, one number and be 8 characters long"
      );
      return;
    }

    const payload = {
      email,
      password,
    };

    deleteUserAccount(payload);
  }, [email, password]);

  const validateChangeEmail = async () => {
    // validate
    let allErrors = [OldEmail.length === 0, newEmail.length === 0];
    if (!OldEmail) {
      setOldEmailError(true);
    } else {
      setOldEmailError(false);
    }
    if (!newEmail) {
      setNewEmailError(true);
    } else {
      setNewEmailError(false);
    }

    if (allErrors.includes(true)) return;

    // validate emails
    if (!validateEmail(newEmail) || !validateEmail(OldEmail)) {
      notification.error("Invalid email format");
      return;
    }

    // old email should be equal to user.email
    if (user.email !== OldEmail) {
      notification.error("Old email is not same as user email");
      return;
    }

    try {
      await axios.post(apis.changeEmail, {
        oldEmail: OldEmail,
        newEmail: newEmail,
      });

      notification.success(
        "A verification email has been sent to your new email address. Please verify your new email address to complete the process."
      );
      setOldEmail("");
      setNewEmail("");
    } catch (error) {
      notification.error(error?.response?.data?.error);
    }
  };

  return (
    <div className="my_account">
      <div className="pass_cont border_cont">
        <div className="row">
          <div className="label_col">
            <h4>Enter Old Password:</h4>
          </div>
          <div className="field_col">
            <Input
              type="password"
              value={oldPass}
              onChange={handleOldPassChange}
            />
            <FieldError
              error={"Please enter your old password"}
              visible={oldPassError}
            />
          </div>
        </div>
        <div className="row">
          <div className="label_col">
            <h4>Enter New Password:</h4>
          </div>
          <div className="field_col">
            <Input
              type="password"
              value={newPass}
              onChange={handleNewPassChange}
            />
            <FieldError
              error={"Please enter your new password"}
              visible={newPassError}
            />
          </div>
        </div>
        <div className="row">
          <div className="label_col">
            <h4>Confirm New Password:</h4>
          </div>
          <div className="field_col">
            <Input
              type="password"
              value={confirmPass}
              onChange={handleConfirmPassChange}
            />
            <FieldError
              error={"Please confirm your new password"}
              visible={confirmPassError}
            />
          </div>
        </div>
        <div className="row">
          <div className="label_col"></div>
          <div className="field_col">
            <Button
              onClick={validateChangePassword}
              className="btn_blue_m change_btn"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* -------- */}

      <div className="delete_cont border_cont">
        <div className="row">
          <div className="label_col">
            <h4>Enter Old Email:</h4>
          </div>
          <div className="field_col">
            <Input
              placeholder={user.email}
              type="email"
              value={OldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
            />
            <FieldError
              error={"Please enter your old email"}
              visible={oldEmailError}
            />
          </div>
        </div>
        <div className="row">
          <div className="label_col">
            <h4>Enter New Email:</h4>
          </div>
          <div className="field_col">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <FieldError
              error={"Please enter your new email"}
              visible={newEmailError}
            />
          </div>
        </div>

        <div className="row">
          <div className="label_col"></div>
          <div className="field_col">
            <Button
              onClick={validateChangeEmail}
              className="btn_blue_m change_btn"
            >
              Change Email
            </Button>
          </div>
        </div>
      </div>

      {/* --------- */}

      <div className="delete_cont border_cont">
        <div className="row">
          <div className="label_col">
            <h4>Type Your Email Address:</h4>
          </div>
          <div className="field_col">
            <Input type="email" value={email} onChange={handleEmailChange} />
            <FieldError
              error={"Please enter your email"}
              visible={emailError}
            />
          </div>
        </div>
        <div className="row">
          <div className="label_col">
            <h4>Enter Your Password:</h4>
          </div>
          <div className="field_col">
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <FieldError
              error={"Please enter your password"}
              visible={passwordError}
            />
          </div>
        </div>

        <div className="row">
          <div className="label_col"></div>
          <div className="field_col">
            <Button
              onClick={validateDeleteAccount}
              className="btn_red_m delete_btn"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
