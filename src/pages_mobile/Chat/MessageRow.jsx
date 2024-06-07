import React from "react";
import { useSelector } from "react-redux";
import "./MessageRow.css"; // Import your CSS file

const showTime = (createdAt, flag) => {
  return createdAt;
};

const MessageRow = ({ messageDoc, chat, index, arr, setImagePreview }) => {
  const { message, from, type, _id } = messageDoc;
  const user = useSelector((state) => state.auth);
  let isUser = from === user._id;

  return (
    <div
      key={_id}
      className={`message_row ${isUser ? "chat-flex-end" : "chat-flex-start"}`}
    >
      {!isUser && arr[index + 1]?.from !== chat?.info?._id ? (
        <img className="userAvatar" src={chat?.info?.image} alt="user-avatar" />
      ) : (
        <div className="emptyStyle" />
      )}

      {type === "image" && (
        <div className={`imageContainer ${isUser ? "row-reverse" : "row"}`}>
          <div
            onClick={() => {
              setImagePreview(message);
            }}
            className={`imageWrapper ${isUser ? "userImage" : "otherImage"}`}
          >
            <img className="chat_image" src={message} alt="chat_img" />
          </div>
          <span className="timeStamp">
            {/* {showTime(messageDoc.createdAt, true)} */}
          </span>
        </div>
      )}

      {type === "text" && (
        <div className="textContainer">
          <div
            className={`textRowContainer ${isUser ? "userText" : "otherText"}`}
          >
            <p className="textRow">{message}</p>
          </div>
          <span className="timeStamp">
            {/* {showTime(messageDoc.createdAt, true)} */}
          </span>
        </div>
      )}

      {isUser && arr[index + 1]?.from !== user._id ? (
        <img className="userAvatar" src={user.image} alt="user-avatar" />
      ) : (
        <div className="emptyStyle" />
      )}
    </div>
  );
};

export default MessageRow;
