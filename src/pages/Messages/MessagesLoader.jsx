import React from "react";

function MessagesLoader() {
  return (
    <div className="messages_loader">
      <div className="line">
        <div className="user empty"></div>
        <div className="msg empty top w-450"></div>
      </div>
      <div className="line">
        <div className="msg empty mid w-350"></div>
      </div>
      <div className="line">
        <div className="msg empty last w-250"></div>
      </div>
      <div className="line alt">
        <div className="msg empty top w-500"></div>
        <div className="user empty"></div>
      </div>
      <div className="line alt">
        <div className="msg empty mid w-350"></div>
      </div>
      <div className="line alt">
        <div className="msg empty mid w-300"></div>
      </div>
      <div className="line alt">
        <div className="msg empty last w-100"></div>
      </div>
      <div className="line">
        <div className="user empty"></div>
        <div className="msg empty top w-450"></div>
      </div>
      <div className="line">
        <div className="msg empty mid w-300"></div>
      </div>
      <div className="line">
        <div className="msg empty last w-150"></div>
      </div>
    </div>
  );
}

export default MessagesLoader;
