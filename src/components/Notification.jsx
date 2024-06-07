// Notification.js
import React, { useState, useEffect } from "react";
import "./Notification.css";
import {
  // close icon
  Close,
} from "@mui/icons-material";
const Notification = ({ color, message, autoClose = true }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timeout = setTimeout(() => {
        closeNotification();
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [autoClose]);

  const closeNotification = () => {
    setVisible(false);
  };

  return visible ? (
    <div className={`notification ${color}`}>
      <span>{message}</span>
      <span>
        <Close className="close-icon" onClick={closeNotification} />
      </span>
    </div>
  ) : null;
};

export default Notification;
