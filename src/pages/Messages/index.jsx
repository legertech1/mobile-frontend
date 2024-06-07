import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { PinDropOutlined } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import parseImage from "../../utils/parseImage";
import Modal from "../../components/Modal";
import showTime from "../../utils/showTiime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  socket,
  sendMessage,
  sendTyping,
  sendStoppedTyping,
  blockChat,
  unBlockChat,
  deleteChat,
  getMessages,
} from "../../socket";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import ImageCompressor from "image-compressor.js";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import Footer from "../../components/Footer";
import IconPlayer from "../../components/IconPlayer";
import chatIcon from "../../assets/animatedIcons/chat.json";
import Message from "./Message";
import { resetNew } from "../../store/chatSlice";
import { imageFallback } from "../../utils/listingCardFunctions";
import ChatLoader from "./ChatLoader";
import MessagesLoader from "./MessagesLoader";
import OnlineStatus from "./OnlineStatus";

function Messages() {
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.auth);
  const [current, setCurrent] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [image, setImage] = useState("");
  const fileInp = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const chatActions = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const compressor = new ImageCompressor();
  const confirm = useConfirmDialog();
  const dispatch = useDispatch();
  const [count, setCount] = useState(null);
  const containerRef = useRef();
  const [page, setPage] = useState(0);
  function handleScroll() {
    if (loading) return;
    if (!containerRef.current) return;
    const container = containerRef.current;
    console.log(
      container.scrollTop,
      container.clientHeight,
      container.scrollHeight
    );
    if (
      container.scrollTop - container.clientHeight <=
      container.scrollHeight - 10
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }

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
        setPage(!page);
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

  function send() {
    sendMessage(socket, {
      from: user._id,
      to: current?.info?._id,
      message: image || message,
      type: image ? "image" : "text",
      ad: current.ad._id,
    });
    sendStoppedTyping(socket, { userId: user?._id, chatId: current?._id });
    setMessage("");
    setImage("");
  }

  useEffect(() => {
    if (typing) {
      sendTyping(socket, { userId: user?._id, chatId: current?._id });
      const timeout = setTimeout(() => {
        sendStoppedTyping(socket, { userId: user?._id, chatId: current?._id });
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [typing]);

  useEffect(() => {
    if (!current || current.messages.length >= current.messagesLength) return;
    setLoading(true);
    getMessages(socket, {
      chatId: current._id,
      limit: 20,
      page: page || 1,
    });
    setTimeout(() => setLoading(false), 2000);
  }, [page]);

  useEffect(() => {
    return () => setCurrent(null);
  }, []);

  return (
    <>
      <div className="messages_page">
        <Navbar white={true} topOnly={true}></Navbar>
        <div className="left_blob"></div>
        <div className="right_blob"></div>
        <div className="main">
          <div className="content">
            {/* <div className="heading_shadow_box"></div> */}
            <div className="chats">
              <div className="heading">
                {!search && (
                  <>
                    Messages
                    <div className="action" onClick={(e) => setSearch(true)}>
                      <SearchIcon />
                    </div>
                  </>
                )}
                {search && (
                  <>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                      }}
                    />
                    <div className="action" onClick={(e) => setSearch(false)}>
                      <CloseIcon />
                    </div>
                  </>
                )}
              </div>
              <div className="chats_main">
                {chats
                  ?.filter((chat) => {
                    if (
                      (
                        chat?.info?.firstName?.toLowerCase() +
                          " " +
                          chat?.info?.firstName?.toLowerCase() +
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
                          className={
                            "chat" +
                            (current?._id == chat._id ? " active" : "") +
                            (unreadCount > 0 ? " unread" : "")
                          }
                          onClick={() => {
                            setCurrent(chat);
                            setPage(!page);
                            if (current?.new) dispatch(resetNew(current));
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
                                {!chat?.info?.nickname &&
                                  chat?.info?.firstName}{" "}
                                {!chat?.info?.nickname && chat?.info?.lastName}
                                {chat?.info?.nickname && chat?.info?.nickname}
                                {unreadCount > 0 ? (
                                  <div className="unread">{unreadCount}</div>
                                ) : (
                                  ""
                                )}
                              </p>
                              <div className="time">
                                {showTime(
                                  chat?.messages[chat?.messages?.length - 1]
                                    ?.createdAt
                                )}
                              </div>
                            </div>
                            <div className="ad_title">{chat?.ad?.title}</div>
                            <div className="last_message">
                              {chat.messages[chat.messages.length - 1]?.from ==
                                user._id && "Me: "}

                              {chat.messages[chat.messages.length - 1]?.type !=
                              "image" ? (
                                chat.messages[chat.messages.length - 1]?.message
                              ) : (
                                <>
                                  <InsertPhotoOutlinedIcon />
                                  image
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}

                {!chats && [0, 0, 0, 0, 0, 0].map(() => <ChatLoader />)}
              </div>
            </div>
            <div className="messaging_area">
              {current && (
                <>
                  <div className="heading">
                    <div className="info">
                      <OnlineStatus current={current} />
                      <div
                        className="name"
                        onClick={(e) => navigate("/user/" + current?.info?._id)}
                      >
                        {current?.info?.firstName} {current?.info?.lastName}{" "}
                        <span className="nickname">
                          {current?.info?.nickname &&
                            "(" + current?.info?.nickname + ")"}
                        </span>
                      </div>
                    </div>

                    <div
                      className="actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        chatActions.current.classList.toggle("active");

                        const fn = () => {
                          if (!chatActions?.current)
                            return document.removeEventListener("click", fn);
                          if (
                            Array.from(chatActions.current.classList).includes(
                              "active"
                            )
                          ) {
                            chatActions.current.classList.remove("active");
                            document.removeEventListener("click", fn);
                          }
                        };
                        document.addEventListener("click", fn);
                      }}
                    >
                      <div className="action">
                        <MoreVertIcon />
                      </div>
                      <div className="show_actions" ref={chatActions}>
                        {/* <div className="option">
                          <StarOutlineRoundedIcon /> Mark as Importrant
                        </div> */}
                        <div
                          className="option"
                          onClick={(e) => {
                            confirm.openDialog(
                              "Are you sure you want to block " +
                                current?.info?.nickname ||
                                current?.info?.firstName,
                              () => {
                                blockChat(socket, {
                                  userId: user._id,
                                  chatId: current._id,
                                });
                              },
                              () => {}
                            );
                          }}
                        >
                          <BlockRoundedIcon /> Block
                        </div>
                        <div
                          className="option"
                          onClick={(e) => {
                            confirm.openDialog(
                              "Are you sure you want to delete your chat with " +
                                current?.info?.nickname ||
                                current?.info?.firstName,
                              () => {
                                deleteChat(socket, current._id);
                              },
                              () => {}
                            );
                          }}
                        >
                          {" "}
                          <DeleteOutlineOutlinedIcon /> Delete Chat
                        </div>
                      </div>
                      {/* 
                   
                 */}
                    </div>
                  </div>
                  <div
                    className="ad"
                    onClick={(e) => navigate("/listing/" + current?.ad?._id)}
                  >
                    <img src={current?.ad?.image} alt="" />

                    <div className="info">
                      <div className="line">
                        <div className="price">
                          ${current?.ad?.price || "free"}
                          <span>/{current?.ad?.term}</span>
                        </div>
                        <div className="location">
                          <PinDropOutlined />
                          <p>{current?.ad?.location?.name}</p>
                        </div>
                        <div className="ad_id">
                          Ad ID: {current?.ad?.listingID}
                        </div>
                      </div>
                      <div className="line">
                        <h3>
                          <p>{current?.ad?.title}</p>
                        </h3>

                        <span className="view_ad">View Ad</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="messages"
                    ref={containerRef}
                    onScroll={handleScroll}
                  >
                    {current?.typing?.includes(current?.info?._id) && (
                      <div className="message_container gap">
                        <img src={current?.info?.image} alt="" />
                        <div className="message typing">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                    )}
                    {(current.messages.length < 20 &&
                    current.messages.length < current.messagesLength
                      ? []
                      : [...current?.messages]
                    )
                      .reverse()
                      .map((message, ind, arr) => {
                        return (
                          <Message
                            id={user?._id}
                            message={message}
                            next={arr[ind - 1]}
                            prev={arr[ind + 1]}
                            current={current}
                            image={user?.image}
                            setImagePreview={setImagePreview}
                            ind={ind}
                          />
                        );
                      })}
                    {/* {current.messages.length >= 20 && loading && (
                      <div className="loader_cont">
                        <Loader />
                      </div>
                    )} */}
                    {current.messages.length < 20 &&
                      current.messages.length < current.messagesLength && (
                        <MessagesLoader />
                      )}
                  </div>
                  <div
                    className={
                      "send_message_area" +
                      (current.blockedBy.length ? " b" : "")
                    }
                  >
                    {!current.blockedBy.length && (
                      <>
                        <div className="inp">
                          {!image && (
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => {
                                setMessage(e.target.value.slice(0, 2000));
                                setTyping(true);
                              }}
                              placeholder="Type a message"
                              onKeyDown={(e) => e.key == "Enter" && send()}
                            />
                          )}
                          {image && (
                            <div className="image_cont">
                              <div
                                className="cancel"
                                onClick={(e) => setImage("")}
                              >
                                <CloseIcon />
                              </div>
                              <img src={image} />
                            </div>
                          )}
                          <input
                            type="file"
                            name=""
                            id=""
                            ref={fileInp}
                            onChange={async (e) => {
                              if (!e.target.files[0]) return;
                              const file = await compressor.compress(
                                e.target.files[0],
                                { quality: 0.2 }
                              );
                              parseImage(file, (img) => {
                                setImage(img);
                                setMessage("");
                              });
                            }}
                            style={{ display: "none" }}
                          />
                          {!image && (
                            <InsertPhotoOutlinedIcon
                              onClick={(e) => fileInp.current.click()}
                            />
                          )}
                        </div>
                        <button className="send" onClick={send}>
                          <SendIcon />{" "}
                        </button>
                      </>
                    )}
                    {current.blockedBy.includes(current.info._id) &&
                      !current.blockedBy.includes(user._id) && (
                        <div className="blocked">
                          You cannot send messages to this chat.
                        </div>
                      )}
                    {current.blockedBy.includes(user._id) && (
                      <div className="blocked">
                        You have blocked this chat,{" "}
                        <span
                          style={{ color: "var(--blue)", cursor: "pointer" }}
                          onClick={(e) => {
                            confirm.openDialog(
                              "Are you sure you want to unblock " +
                                current?.info?.nickname ||
                                current?.info?.firstName,
                              () => {
                                unBlockChat(socket, {
                                  userId: user?._id,
                                  chatId: current._id,
                                });
                              },
                              () => {}
                            );
                          }}
                        >
                          Unblock
                        </span>{" "}
                        to send messages.
                      </div>
                    )}
                  </div>
                </>
              )}

              {!current && (
                <>
                  <div className="no_chat_selected">
                    <IconPlayer icon={chatIcon} />
                    Select a chat to view conversation
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {imagePreview && (
          <Modal
            close={() => setImagePreview(null)}
            onKeyDown={(e) => e.key == "Escape" && setImagePreview(null)}
            className={"image"}
          >
            <img  src={imagePreview} />
          </Modal>
        )}
      </div>

      <Footer></Footer>
    </>
  );
}

export default Messages;
