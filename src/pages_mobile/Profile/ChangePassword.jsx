import React, { useCallback, useState } from "react";
import Button from "../../components_mobile/shared/Button";
import Input from "../../components_mobile/shared/Input";
import Loader from "../../components_mobile/Loader";
import validatePassword from "../../utils/validatePassword";
import axios from "axios";
import apis from "../../services/api";
import "./index.css";
import useNotification from "../../hooks/useNotification";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const notification = useNotification();

  const changeUserPassword = async (payload) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.post(apis.changePassword, payload);
      setLoading(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      notification.success(response.data.info);
    } catch (error) {
      notification.error(error.response.data.error);
      setLoading(false);
    }
  };

  const validateChangePassword = useCallback(() => {
    if (newPass !== confirmPass) {
      notification.error("Passwords do not match");
      return;
    }

    if (!validatePassword(newPass)) {
      notification.error(
        "Password should contain at least one special character, one number and be 8 characters long"
      );
      return;
    }

    // if both passwords are same
    if (oldPass === newPass) {
      notification.error("New password cannot be same as old password");
      return;
    }

    const payload = {
      oldPassword: oldPass,
      newPassword: newPass,
    };

    changeUserPassword(payload);
  }, [oldPass, newPass, confirmPass]);

  return (
    <div className="mobile_user_profile">
      <div className="card">
        <h3 className="title">Change Password </h3>
        <div className="form_container">
          <div>
            <Input
              label="Enter Old Password:"
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Enter New Password:"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Confirm New Password:"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
          <div>{loading && <Loader title={"Changing Password..."} />}</div>

          <div className="single_btn_container">
            <Button disabled={loading} onClick={validateChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
