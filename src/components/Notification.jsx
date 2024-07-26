// Notification.js
import React, { useState, useEffect } from "react";
import "./Notification.css";
import {
  // close icon
  Close,
} from "@mui/icons-material";
const Notification = ({
  color,
  message,
  autoClose = true,
  closeNotification,
  id,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timeout = setTimeout(() => {
        closeNotification();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [autoClose]);

  return (
    <div className={`notification ${color}`} id={id}>
      <span>{message.message || message.error || message}</span>
      <span>
        <Close className="close-icon" onClick={closeNotification} />
      </span>
    </div>
  );
};

export default Notification;
