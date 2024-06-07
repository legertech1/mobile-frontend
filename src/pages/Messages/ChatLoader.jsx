import React from "react";

function ChatLoader() {
  return (
    <div className="chat empty">
      <div className="overview_images empty"></div>
      <div className="chat_info">
        <div className="name">
          <p className="empty"></p>
          <div className="time empty"></div>
        </div>
        <div className="ad_title empty"></div>
        <div className="last_message empty"></div>
      </div>
    </div>
  );
}

export default ChatLoader;
