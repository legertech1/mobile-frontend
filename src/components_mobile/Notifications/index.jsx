import React from "react";
import { useSelector } from "react-redux";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { deleteNotification, socket } from "../../socket";
import "./index.css";
import { parseTime } from "../../utils/helpers";

export default function Notifications() {
  const notifications = useSelector((state) => state.notifications);

  return (
    <div className="mobile_notifications">
      <div className="notifications">
        {notifications.map((notification) => {
          return (
            <div key={notification._id} className="notif_row">
              <img src={notification.image} alt="notif_image" />
              <div className="notification_content">
                <p className="content">{notification.content}</p>
                <p className="date">{parseTime(notification.createdAt)}</p>
              </div>
              <button
                className="remove_btn"
                onClick={() => {
                  deleteNotification(socket, notification);
                }}
              >
                <CloseOutlinedIcon />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
