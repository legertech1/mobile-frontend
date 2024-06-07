import React, { useCallback, useState } from "react";
import Button from "../../components_mobile/shared/Button";
import Input from "../../components_mobile/shared/Input";
import Loader from "../../components_mobile/Loader";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import axios from "axios";
import apis from "../../services/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import "./index.css";
import useNotification from "../../hooks/useNotification";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notification = useNotification();

  const deleteUserAccount = async (payload) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.post(apis.deleteAccount, payload);
      setLoading(false);
      setEmail("");
      setPassword("");
      notification.success(response.data.info);
      dispatch(logout());
    } catch (error) {
      notification.error(error.response.data.error);
      setLoading(false);
    }
  };

  const validateDeleteAccount = useCallback(() => {
    if (!email) {
      notification.error("Please enter your email");
      return;
    }
    if (!password) {
      notification.error("Please enter your password");
      return;
    }

    if (!validateEmail(email)) {
      notification.error("Please enter a valid email");
      return;
    }

    if (!validatePassword(password)) {
      notification.error(
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

  return (
    <div className="mobile_user_profile">
      <div className="card">
        <h3 className="title">Delete Account</h3>
        <div className="form_container">
          <div>
            <Input
              label="Type Your Email Address:"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type={"password"}
              label="Enter Your Password:"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div>{loading && <Loader title={"Deleting Account..."} />}</div>

          <div className="single_btn_container delete_btn_cont">
            <Button
              disabled={loading}
              onClick={validateDeleteAccount}
              className
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
