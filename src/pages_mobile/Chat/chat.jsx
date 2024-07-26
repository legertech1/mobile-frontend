import React, { useEffect, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PinchZoomImage from "../Ad/PinchToZoom";
import "./index.css";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useLocation, useNavigate } from "react-router-dom";
import ripple from "../../utils/ripple";
import {
  ArrowForward,
  BlockOutlined,
  Close,
  DeleteForeverOutlined,
  InsertPhotoOutlined,
  MoreVertRounded,
  PlaceOutlined,
  Send,
} from "@mui/icons-material";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import {
  blockChat,
  deleteChat,
  getMessages,
  sendMessage,
  sendStoppedTyping,
  sendTyping,
  socket,
  unBlockChat,
} from "../../socket";
import Ad from "../../pages_mobile/Ad";
import { useSelector } from "react-redux";
import ImageCompressor from "image-compressor.js";
import parseImage from "../../utils/parseImage";
import scrollToBottom from "../../utils/scrollToBottom";
import { createPortal } from "react-dom";
import Message from "./Message";
import OnlineStatus from "./OnlineStatus";
import Modal from "../../components_mobile/Modal";

function Chat({ chat, setChat, manageShift, animating }) {
  const confirm = useConfirmDialog();
  const user = useSelector((state) => state.auth);
  const [image, setImage] = useState("");
  const fileInp = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const chatActions = useRef();
  const [message, setMessage] = useState("");
  const compressor = new ImageCompressor();
  const [typing, setTyping] = useState(false);
  const sendRef = useRef();
  const containerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [options, setOptions] = useState(false);
  function handleScroll() {
    if (loading) return;
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (
      container.scrollTop - container.clientHeight <=
      container.scrollHeight - 10
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }
  useEffect(() => {
    // !init && setTimeout(() => setInit(1), 500);
    if (!chat || chat.messages.length >= chat.messagesLength) return;
    setLoading(true);
    getMessages(socket, {
      chatId: chat._id,
      limit: 20,
      page: page || 1,
    });
    setTimeout(() => setLoading(false), 2000);
  }, [page]);

  function send() {
    sendMessage(socket, {
      from: user._id,
      to: chat?.info?._id,
      message: image || message,
      type: image ? "image" : "text",
      ad: chat.ad._id,
    });
    // containerRef.current.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
    sendStoppedTyping(socket, { userId: user?._id, chatId: chat?._id });
    setMessage("");
    setImage("");
  }
  useEffect(() => {
    if (typing) {
      sendTyping(socket, { userId: user?._id, chatId: chat?._id });
      const timeout = setTimeout(() => {
        sendStoppedTyping(socket, { userId: user?._id, chatId: chat?._id });
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [typing]);
  const [adModal, setAdModal] = useState(false);
  function handleBack(e) {
    e.preventDefault();
    if (imagePreview) return;
    if (location.pathname == "/messages/open") navigate("/messages");
  }

  // useEffect(() => {
  //   window.history.pushState({ page: "initial" }, "", window.location.href);
  //   if (imagePreview) navigate("/messages/open");
  //   window.addEventListener("popstate", handleBack);
  //   return () => window.removeEventListener("popstate", handleBack);
  // }, [imagePreview]);
  useEffect(() => {
    if (
      Date.parse(chat.messages[chat.messages.length - 1].createdAt) >
      Date.now() - 3000
    ) {
      containerRef.current.scrollTo({
        top: 0,
        // behavior: "smooth",
      });
    }
  }, [chat.messages.length]);

  return (
    <div className="_chat">
      <div
        className="header"
        onClick={(e) =>
          ripple(e, {
            fast: true,
            dur: 2,
            cb: (e) => navigate("/user/" + chat?.info?._id),
          })
        }
      >
        <button
          className="back"
          onClick={(e) => {
            ripple(e, { cb: () => manageShift(null), dur: 1 });

            e.stopPropagation();
          }}
        >
          <ArrowBackIcon />
        </button>
        <div className="user_info">
          <img src={chat?.info.image} alt="" className="user" />
          <div>
            <p className="name">
              {chat?.info.firstName + " " + (chat?.info.lastName || "")}
            </p>

            <OnlineStatus current={chat} />
          </div>
        </div>

        <button
          className="options"
          onClick={(e) => {
            ripple(e, { dur: 2 });
            e.stopPropagation();
            setOptions(!options);
          }}
        >
          <MoreVertRounded />
        </button>
      </div>
      <div className="ad" onClick={(e) => ripple(e)}>
        <img src={chat?.ad.image} alt="" />
        <div className="ad_info">
          <p className="title">{chat.ad.title}</p>
          <span>
            <PlaceOutlined />
            {chat.ad.location.name}
          </span>
        </div>
        <button
          className="options back"
          onClick={(e) => {
            e.stopPropagation();
            ripple(e, { dur: 2, cb: () => setAdModal(true) });
          }}
        >
          <ArrowForward />
        </button>
      </div>
      <div
        className={"_options" + (options ? " active" : "")}
        onClick={() => setOptions(false)}
      >
        <div
          className="option"
          onClick={(e) => {
            ripple(e, { dur: 2 });
            confirm.openDialog(
              "Are you sure you want to delete your chat with " +
                chat?.info?.firstName +
                "?",
              () => {
                deleteChat(socket, chat._id);
                setChat(null);
                navigate("/messages");
              },
              () => {}
            );
          }}
        >
          <DeleteForeverOutlined /> Delete chat
        </div>
        <div
          className="option"
          onClick={(e) =>
            ripple(e, {
              dur: 2,
              cb: (e) => {
                confirm.openDialog(
                  "Are you sure you want to block " +
                    chat?.info?.firstName +
                    " ?",
                  () => {
                    blockChat(socket, {
                      userId: user._id,
                      chatId: chat._id,
                    });
                  },
                  () => {}
                );
              },
            })
          }
        >
          <BlockOutlined /> Block chat
        </div>
      </div>
      <div className="messages">
        <div className="overlay" ref={containerRef} onScroll={handleScroll}>
          {location.pathname == "/messages/open" && (
            <>
              {" "}
              {chat?.typing?.includes(chat?.info?._id) && (
                <div className="message_container gap">
                  <div className="message typing">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              {(chat.messages.length < 20 &&
              chat.messages.length < chat.messagesLength
                ? []
                : [...chat?.messages]
              )
                .reverse()
                .map((message, ind, arr) => {
                  return (
                    <Message
                      id={user?._id}
                      message={message}
                      next={arr[ind - 1]}
                      prev={arr[ind + 1]}
                      current={chat}
                      image={user?.image}
                      setImagePreview={setImagePreview}
                      ind={ind}
                      length={arr.length}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
      {location.pathname == "/messages/open" &&
        createPortal(
          <div
            id={"send_message_area"}
            ref={sendRef}
            className={
              "send_message_area" + (chat.blockedBy.length ? " b" : "")
            }
          >
            {!chat.blockedBy.length && (
              <>
                {!image && (
                  <button
                    className="send_image"
                    onClick={(e) => {
                      ripple(e);
                      fileInp.current.click();
                    }}
                  >
                    <InsertPhotoOutlined />
                  </button>
                )}
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
                      <div className="cancel" onClick={(e) => setImage("")}>
                        <Close />
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
                        {
                          quality: 0.2,
                        }
                      );
                      parseImage(file, (img) => {
                        setImage(img);
                        setMessage("");
                      });
                    }}
                    style={{ display: "none" }}
                  />
                </div>
                <button
                  className="send"
                  onClick={(e) => {
                    ripple(e);
                    send();
                  }}
                >
                  <Send />{" "}
                </button>
              </>
            )}
            {chat.blockedBy.includes(chat.info._id) &&
              !chat.blockedBy.includes(user._id) && (
                <div className="blocked">
                  You cannot send messages to this chat.
                </div>
              )}
            {chat.blockedBy.includes(user._id) && (
              <div className="blocked">
                You have blocked this chat,{" "}
                <span
                  style={{ color: "var(--blue)", cursor: "pointer" }}
                  onClick={(e) => {
                    confirm.openDialog(
                      "Are you sure you want to unblock " +
                        chat?.info?.firstName +
                        " ?",
                      () => {
                        unBlockChat(socket, {
                          userId: user?._id,
                          chatId: chat._id,
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
          </div>,
          document.querySelector("#send_message_cont")
        )}

      {adModal && (
        <Modal
          heading={<span>{chat?.ad?.listingID}</span>}
          close={(e) => {
            setAdModal(false);
          }}
          className={"ad"}
        >
          <Ad _id={chat?.ad?._id} />
        </Modal>
      )}
      {imagePreview && (
        <Modal
          close={() => setImagePreview(null)}
          onKeyDown={(e) => e.key == "Escape" && setImagePreview(null)}
          className={"gallery"}
        >
          <div className="_gallery">
            <div className="images_container">
              <div className="images">
                <PinchZoomImage src={imagePreview}> </PinchZoomImage>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Chat;
