import React, { useEffect } from "react";
import "./index.css";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import showTime from "../../utils/showTiime";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { Link } from "react-router-dom";

import { socket, loadChats } from "../../socket/index";

export default function Chat() {
  const chats = useSelector((state) => state.chats);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadChats(socket);
  }, []);

  if (!chats)
    return (
      <div className="mobile_chat_loader">
        <Loader />
      </div>
    );

  if (chats.length == 0) {
    return (
      <div className="mobile_chat">
        <div className="no_chat">
          <p>You have no chats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile_chat">
      <div className="chat_list">
        {chats.map((chat) => {
          let unreadCount = chat.messages
            .filter((m) => m.to == user?._id)
            .reduce((acc, c) => (c.read ? acc : acc + 1), 0);

          return (
            <Link to={`/single-chat/${chat._id}`} key={chat._id}>
              <div className="chat_item">
                <div className="chat_left">
                  <img src={chat?.ad?.image} className="ad_img" alt="ad_img" />
                  <img className="user_img" src={chat?.info?.image} alt="" />
                </div>
                <div className="chat_right">
                  <div className="text_cont">
                    <p className="user_name">
                      {!chat?.info?.nickname && chat?.info?.firstName}{" "}
                      {!chat?.info?.nickname && chat?.info?.lastName}
                      {chat?.info?.nickname && chat?.info?.nickname}
                      {unreadCount > 0 ? (
                        <div className="unread">{unreadCount}</div>
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="ad_title">{chat?.ad?.title}</p>
                    <p className="last_row">
                      <span className="from_me">
                        {chat.messages[chat.messages.length - 1]?.from ==
                          user?._id && "Me: "}
                      </span>
                      {chat.messages[chat.messages.length - 1]?.type !=
                      "image" ? (
                        chat.messages[chat.messages.length - 1]?.message
                      ) : (
                        <>
                          <InsertPhotoOutlinedIcon />
                          image
                        </>
                      )}
                    </p>
                  </div>
                  <div className="date_cont">
                    {showTime(
                      chat?.messages[chat?.messages?.length - 1]?.createdAt
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
