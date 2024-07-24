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
    document.querySelector("#notif" + id)?.classList.add("removed");
    setTimeout(
      () =>
        setNotifications((prevNotifications) => {
          
          return prevNotifications.filter((n) => n.id !== id);
        }),
      300
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
                id={"notif" + notification.id}
                autoClose={true}
                closeNotification={() => removeNotification(notification.id)}
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
