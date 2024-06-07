// NotificationService.js
import React, { useState } from "react";
import Notification from "../components/Notification";
import { createPortal } from "react-dom";

const NotificationServiceContext = React.createContext();

const NotificationService = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (color, message, autoClose = false) => {
    const newNotification = {
      id: new Date().getTime(),
      color,
      message,
      autoClose,
    };

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  };

  const success = (message, autoClose = true) => {
    addNotification("success", message, autoClose);
  };

  const error = (message, autoClose = true) => {
    addNotification("error", message, autoClose);
  };

  const warning = (message, autoClose = true) => {
    addNotification("warning", message, autoClose);
  };

  const info = (message, autoClose = true) => {
    addNotification("info", message, autoClose);
  };

  return (
    <>
      {" "}
      <NotificationServiceContext.Provider
        value={{ success, error, warning, info }}
      >
        {children}
        {createPortal(
          <div className="notification-container">
            {notifications.map((notification) => (
              <Notification
                key={notification.id}
                color={notification.color}
                message={notification.message}
                autoClose={notification.autoClose}
                onClose={() => removeNotification(notification.id)}
              />
            ))}
          </div>,
          document.getElementById("portal")
        )}
      </NotificationServiceContext.Provider>
    </>
  );
};

export { NotificationService as default, NotificationServiceContext };
