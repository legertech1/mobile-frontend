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
}) {
  const options = useRef();
  const notification = useNotification();
  if (message?.to == id && !message.read)
    messageRead(socket, current._id, message._id);
  if (!message.message && message.type != "deleted") return <></>;
  const jsx = (
    <div
      className={
        "message_container" +
        (message.from == id ? " from" : "") +
        (prev?.from != message?.from ? " gap" : "") +
        (current.new && ind == 0 ? " new" : "")
      }
      key={message?.createdAt}
    >
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
      {message.from != id && prev?.from != current?.info?._id && (
        <img src={current?.info?.image} onError={imageFallback} />
      )}
      {message.from == id && (
        <div
          className={
            "time from" +
            (prev?.from == id &&
            Date.parse(message?.createdAt) - Date.parse(prev?.createdAt) <
              43200000
              ? " hide"
              : "")
          }
        >
          {" "}
          {showTime(message?.createdAt)}
        </div>
      )}
      <div
        className={
          "message" +
          (message.from == id ? " from" : "") +
          (prev?.from == current?.info?._id && prev?.from == message?.from
            ? " top_left_not_round"
            : "") +
          (next?.from == current?.info?._id && next?.from == message?.from
            ? " bottom_left_not_round"
            : "") +
          (prev?.from == id && prev?.from == message?.from
            ? " top_right_not_round"
            : "") +
          (next?.from == id && next?.from == message?.from
            ? " bottom_right_not_round"
            : "") +
          (message?.type == "image" ? " image" : "") +
          (current.new && ind == 0 ? " new" : "") +
          (message?.type == "deleted" ? " deleted" : "")
        }
        key={message?.createdAt}
        onClick={(e) =>
          message.type == "image" && setImagePreview(message.message)
        }
      >
        <div
          className="options"
          onClick={(e) => {
            e.stopPropagation();
            options.current.classList.toggle("active");

            const fn = () => {
              if (!options?.current)
                return document.removeEventListener("click", fn);
              if (Array.from(options.current.classList).includes("active")) {
                options.current.classList.remove("active");
                document.removeEventListener("click", fn);
              }
            };
            document.addEventListener("click", fn);
          }}
        >
          <MoreHorizOutlined />
        </div>

        {message.type == "text" && message.message}
        {message.type == "image" && (
          <img src={message.message} onError={imageFallback} />
        )}
        {message.type == "deleted" && "Message has been deleted"}
      </div>
      {message.from == id && (
        <div
          className={
            "rr" +
            (message?.read ? " read" : " unread") +
            (ind == 0 ? " show" : "")
          }
        >
          <DoneAllIcon />
        </div>
      )}
      {!(message.from == id) && (
        <div
          className={
            "time" +
            (prev?.from == current?.info?._id &&
            Date.parse(message?.createdAt) - Date.parse(prev?.createdAt) <
              43200000
              ? " hide"
              : "")
          }
        >
          {showTime(message?.createdAt)}
        </div>
      )}
      {message.from == id && prev?.from != id && (
        <img src={image} onError={imageFallback} />
      )}
    </div>
  );

  return jsx;
}

export default Message;
