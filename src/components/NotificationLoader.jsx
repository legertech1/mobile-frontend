import React from "react";

function NotificationLoader() {
  return (
    <div className={"notification"}>
      <div className="img_skeleton empty"></div>
      <div className="notif_info">
        <p className="content empty"></p>
        <p className="content empty"></p>
        <p className="time empty"></p>
      </div>
    </div>
  );
}

export default NotificationLoader;
