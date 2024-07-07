import React, { useEffect, useRef, useState } from "react";
import showTime from "../../utils/showTiime";
import { imageFallback } from "../../utils/listingCardFunctions";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { socket, messageRead, deleteMessage } from "../../socket";
import useNotification from "../../hooks/useNotification";
import {
  BackspaceOutlined,
  CloseOutlined,
  DeleteForeverOutlined,
  DeleteOutlineOutlined,
  MoreHorizOutlined,
  MoreVertOutlined,
  ReplyOutlined,
} from "@mui/icons-material";
import ripple from "../../utils/ripple";
const _2hours = 2 * 60 * 60 * 1000;
function Message({
  message,
  id,
  next,
  prev,
  current,
  image,
  ind,
  setImagePreview,
  length,
}) {
  const options = useRef();
  const notification = useNotification();
  const ref = useRef();

  function show() {
    ref.current.classList.toggle("show");
    setTimeout(() => ref?.current?.classList?.remove("show"), 5000);
  }
  if (message?.to == id && !message.read)
    messageRead(socket, current._id, message._id);

  if (!message.message && message.type != "deleted") return <></>;
  const jsx = (
    <div
      className={
        "message_container" +
        (message.from == id ? " from" : "") +
        (prev?.from != message?.from ? " gap" : "") +
        (current.new && ind == 0 && !message.read ? " new" : "") +
        (message?.type == "deleted" ? " deleted" : "") +
        (Date.parse(message?.createdAt) - Date.parse(prev?.createdAt) >
          43200000 || ind == length - 1
          ? " show_time"
          : "") +
        (ind == 0 ? " last" : "")
      }
      key={message?.createdAt}
      ref={ref}
      onClick={(e) => {
        show();
      }}
    >
      {message.from == id &&
        Date.parse(message.createdAt) + _2hours > Date.now() &&
        message.type != "deleted" && (
          <button
            className="delete"
            onClick={(e) => {
              ripple(e, {
                cb: () => deleteMessage(socket, current?._id, message?._id),
              });
            }}
          >
            <DeleteForeverOutlined />
          </button>
        )}
      {message.from == id && (
        <div className={"actions"} ref={options}>
          <p
            onClick={() => {
              if (Date.parse(message.createdAt) + _2hours < Date.now())
                return notification.error(
                  "Messages can only be deleted within 2 hours of being sent."
                );
              deleteMessage(socket, current?._id, message?._id);
            }}
          >
            <BackspaceOutlined /> Delete
          </p>
        </div>
      )}

      {/* {message.from == id && (
        <div className={"time"}> {showTime(message?.createdAt)}</div>
      )} */}
      <div
        className={
          "message" +
          (message.from == id ? " from" : "") +
          (prev?.from == current?.info?._id &&
          prev?.from == message?.from &&
          Date.parse(message?.createdAt) - Date.parse(prev?.createdAt) <
            43200000
            ? " top_left_not_round"
            : "") +
          (next?.from == current?.info?._id &&
          next?.from == message?.from &&
          Date.parse(next?.createdAt) - Date.parse(message?.createdAt) <
            43200000
            ? " bottom_left_not_round"
            : "") +
          (prev?.from == id &&
          prev?.from == message?.from &&
          Date.parse(message?.createdAt) - Date.parse(prev?.createdAt) <
            43200000
            ? " top_right_not_round"
            : "") +
          (next?.from == id &&
          next?.from == message?.from &&
          Date.parse(next?.createdAt) - Date.parse(message?.createdAt) <
            43200000
            ? " bottom_right_not_round"
            : "") +
          (message?.type == "image" ? " image" : "") +
          (current.new && ind == 0 ? " new" : "") +
          (message?.type == "deleted" ? " deleted" : "")
        }
        key={message?.createdAt}
        onClick={(e) => {
          if (message.type == "image") {
            e.stopPropagation();
            ripple(e, { cb: () => setImagePreview(message.message), dur: 2 });
          }
        }}
      >
        {message.type == "text" && message.message}
        {message.type == "image" && (
          <img src={message.message} onError={imageFallback} />
        )}
        {message.type == "deleted" && "Message has been deleted"}
      </div>
      {message.from == id && (
        <div className={"rr" + (message?.read ? " read" : " unread")}>
          <DoneAllIcon />
        </div>
      )}

      <div className={"time" + (message.from == id ? " from" : "")}>
        {showTime(message?.createdAt)}
      </div>
    </div>
  );

  return jsx;
}

export default Message;
