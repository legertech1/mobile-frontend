import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../services/api";
import "./index.css";

function OnlineStatus({ current }) {
  const [online, setOnline] = useState(false);
  async function getOnlineStatus() {
    setOnline(
      (await axios.get(apis.getOnlineStatus + current?.info?._id))?.data?.active
    );
  }
  useEffect(() => {
    if (!current) return;
    getOnlineStatus();
    const interval = setInterval(() => getOnlineStatus(), 10000);
    return () => clearInterval(interval);
  }, [current]);
  return (
    <div
      className={
        "online_status" +
        (online && !current?.blockedBy?.length ? " active" : " inactive")
      }
    ></div>
  );
}

export default OnlineStatus;
