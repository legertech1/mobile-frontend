import React, { useEffect, useRef, useState } from "react";
import Header from "../../components_mobile/Header";
import { InsertPhotoOutlined, Search } from "@mui/icons-material";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { imageFallback } from "../../utils/listingCardFunctions";
import { ChatTextFill } from "@styled-icons/bootstrap/ChatTextFill";
import {
  getMessages,
  sendMessage,
  sendStoppedTyping,
  sendTyping,
  socket,
} from "../../socket";
import { SearchAlt } from "@styled-icons/boxicons-regular/SearchAlt";
import { useLocation, useNavigate } from "react-router-dom";
import ImageCompressor from "image-compressor.js";
import { resetNew } from "../../store/chatSlice";
import showTime from "../../utils/showTiime";
import ripple from "../../utils/ripple";
import Chat from "./chat";

function Messages() {
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.auth);
  const [current, setCurrent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const chatsRef = useRef();
  const chatRef = useRef();

  useEffect(() => {
    if (location.pathname == "/messages") {
      chatsRef.current.style.transform = "translateX(0)";
      chatRef.current.style.transform = "translateX(100%)";
      if (current) setTimeout(() => setCurrent(null), 200);
      // window.removeEventListener("popstate", handleBack);
    } else if (location.pathname == "/messages/open") {
      if (!current) navigate("/messages");
      chatsRef.current.style.transform = "translateX(-100%)";
      chatRef.current.style.transform = "translateX(0)";

      // window.addEventListener("popstate", handleBack);
    }
  }, [location.pathname]);

  function manageShift(current) {
    if (!chatsRef.current || !chatRef.current) return;

    if (current) {
      navigate("/messages/open");
      setCurrent(current);
      // slideToChat();
    } else {
      navigate("/messages");

      // setTimeout(() => setCurrent(null), 200);
    }
  }

  const dispatch = useDispatch();
  const [count, setCount] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    if (chats?.length) {
      const currentTime = new Date();
      const timeToCompare = Date.parse(
        chats[0]?.messages[chats[0].messages.length - 1]?.updatedAt
      );
      if (
        Math.abs((currentTime - timeToCompare) / 1000) <= 5 &&
        chats[0].messages[chats[0].messages.length - 1]?.from == user._id
      ) {
        setCurrent(chats[0]);
      }
    }

    if (!current) return;

    const newCurr = chats.reduce(
      (acc, i) => (i._id == current._id ? i : acc),
      null
    );
    if (!newCurr) setCurrent(null);

    if (
      newCurr?.new ||
      newCurr?.messages?.length != current?.messages?.length ||
      JSON.stringify(newCurr) != JSON.stringify(current)
    ) {
      setCurrent(newCurr);
    }
  }, [chats]);

  useEffect(() => {
    return () => setCurrent(null);
  }, []);

  return (
    <div className="_messages">
      <div className="chats_view" ref={chatsRef}>
        {" "}
        <Header white={true} />
        <div className="header">
          <div className="search">
            <SearchAlt />{" "}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search by name or Ad title"
            />
          </div>
        </div>
        <div className="chats">
          {chats
            ?.filter((chat) => {
              if (
                (
                  chat?.info?.firstName?.toLowerCase() +
                    " " +
                    chat?.info?.lastName?.toLowerCase() +
                    " " +
                    chat?.info?.nickname +
                    chat?.ad.title || ""
                ).includes(text.toLowerCase())
              )
                return true;
              else return false;
            })
            .map((chat) => {
              let unreadCount = chat.messages
                .filter((m) => m.to == user?._id)
                .reduce((acc, c) => (c.read ? acc : acc + 1), 0);
              return (
                <>
                  <div
                    key={chat._id}
                    className={"chat" + (unreadCount > 0 ? " unread" : "")}
                    onClick={(e) => {
                      // if (animating) return;
                      if (chat?.new) dispatch(resetNew(chat));
                      ripple(e, {
                        cb: () => manageShift(chat),
                        dur: 2,
                        fast: true,
                      });
                    }}
                  >
                    <div className="overview_images">
                      {" "}
                      <img
                        className="ad_img"
                        src={chat?.ad?.image}
                        onError={imageFallback}
                        alt=""
                      />
                      <img
                        className="user_img"
                        src={chat?.info?.image}
                        onError={imageFallback}
                        alt=""
                      />
                    </div>
                    <div className="chat_info">
                      <div className="name">
                        <p>
                          {" "}
                          <span>
                            {" "}
                            {chat?.info?.firstName} {chat?.info?.lastName}
                            {chat?.info?.nickname && (
                              <> ({chat?.info?.nickname})</>
                            )}
                          </span>
                          {unreadCount > 0 ? (
                            <div className="unread">{unreadCount}</div>
                          ) : (
                            ""
                          )}
                        </p>
                        <div className="time">
                          {
                            showTime(
                              chat?.messages[chat?.messages?.length - 1]
                                ?.createdAt
                            )?.split(" ")[0]
                          }
                        </div>
                      </div>
                      <div className="ad_title">{chat?.ad?.title}</div>
                      <div className="last_message">
                        {chat.messages[chat.messages.length - 1]?.from ==
                          user._id && "Me: "}

                        {chat.messages[chat.messages.length - 1]?.type !=
                        "image" ? (
                          chat.messages[chat.messages.length - 1]?.type ==
                          "deleted" ? (
                            "message deleted"
                          ) : (
                            chat.messages[chat.messages.length - 1]?.message
                          )
                        ) : (
                          <>
                            <InsertPhotoOutlined />
                            image
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}

          {!chats.length && (
            <div className="no_chats">
              <ChatTextFill className="1" />
              <ChatTextFill className="2"/>
            </div>
          )}
        </div>
      </div>
      <div className="chat_view" ref={chatRef}>
        {current && (
          <Chat
            chat={current}
            setChat={setCurrent}
            manageShift={manageShift}
            // animating={animating}
          />
        )}
      </div>
    </div>
  );
}

export default Messages;
