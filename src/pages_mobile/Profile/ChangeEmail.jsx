import React, { useState } from "react";
import Button from "../../components_mobile/shared/Button";
import Input from "../../components_mobile/shared/Input";
import validateEmail from "../../utils/validateEmail";
import "./index.css";
import useNotification from "../../hooks/useNotification";
import { useSelector } from "react-redux";
import axios from "axios";
import apis from "../../services/api";

export default function ChangeEmail() {
  const [OldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const notification = useNotification();
  const user = useSelector((state) => state.auth);

  const validateChangeEmail = async () => {
    if (!OldEmail || !newEmail) {
      notification.error("Please fill all fields");
      return;
    }

    if (!validateEmail(newEmail) || !validateEmail(OldEmail)) {
      notification.error("Invalid email format");
      return;
    }

    if (OldEmail === newEmail || user.email === newEmail) {
      notification.error("New email cannot be same as old email");
      return;
    }

    if (user.email !== OldEmail) {
      notification.error("Old email is not same as user email");
      return;
    }
    try {
      let r = await axios.post(apis.changeEmail, {
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
    <div className="mobile_user_profile">
      <div className="card">
        <h3 className="title">Change Email </h3>
        <div className="form_container">
          <div>
            <Input
              label="Enter Old Email:"
              placeholder={user.email}
              type="email"
              value={OldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Enter New Email:"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="single_btn_container">
            <Button onClick={validateChangeEmail}>Change Email </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
