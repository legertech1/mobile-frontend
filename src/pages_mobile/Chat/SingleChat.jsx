import React, { useEffect, useRef, useState } from "react";
import "./SingleChat.css";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import usePreviousHook from "../../hooks/usePreviousHook";
import {
  blockChat,
  deleteChat,
  getMessages,
  // messagesRead,
  sendMessage,
  sendStoppedTyping,
  sendTyping,
  socket,
  unBlockChat,
} from "../../socket";
import MessageRow from "./MessageRow";
import parseImage from "../../utils/parseImage";
import ImageCompressor from "image-compressor.js";
import Modal from "../../components/Modal";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OnlineStatus from "../../pages/Messages/OnlineStatus";

const ChatComponent = () => {
  const [chat, setChat] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.auth);
  const chatId = useParams().id;
  let prevChat = usePreviousHook(chat);
  const chatContainerRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const fileInp = useRef();
  const [image, setImage] = useState("");
  const compressor = new ImageCompressor();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const chatActions = useRef();

  // if prevchat exist and next chat is null redirect
  useEffect(() => {
    if (prevChat && !chat) {
      alert("Chat not found");
      // navigation.navigate('Chat');
    }
  }, [chat, prevChat]);

  useEffect(() => {
    if (!chats) return;

    const currChat = chats.find((c) => c._id === chatId);

    if (!currChat && chats.length > 0) {
      const defaultChat = chats[0];

      // navigation.navigate('Message', {id: defaultChat._id});
      setChat(defaultChat);
    } else {
      setChat(currChat || null);
    }

    const lastMessage = currChat?.messages[currChat.messages.length - 1];
    if (lastMessage?.read === false && lastMessage?.to === user?._id) {
      // messagesRead(socket, currChat?._id);
    }

    return () => {
      setChat(null);
    };
  }, [chatId, chats, user?._id]);

  useEffect(() => {
    if (chat?.messages?.length === 1) {
      fetchMoreMessages();
    }
  }, [chat?.messages?.length]);

  // setloading flase when chat.messages.length is equal to chat.messagesLength, useeffect will run again
  useEffect(() => {
    if (chat?.messages?.length === chat?.messagesLength) {
      setLoading(false);
    }
  }, [chat?.messages?.length, chat?.messagesLength]);

  const fetchMoreMessages = () => {
    setLoading(true);

    const messagesLength = chat?.messagesLength || 0;

    if (chat?.messages?.length === messagesLength) {
      setNoMoreMessages(true);
      setLoading(false);
      return;
    }

    if (noMoreMessages) {
      setLoading(false);
      return;
    }

    let page = Math.floor(chat?.messages?.length / 20) + 1;

    getMessages(socket, {
      chatId: chat?._id,
      limit: 20,
      page: page,
    });
  };

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;

      let scrollTopRound = Math.round(scrollTop);
      let f = scrollTopRound - clientHeight;

      f = f < 0 ? f * -1 : f;
      if (f === scrollHeight) {
        fetchMoreMessages();
      }
    };

    chatContainerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      chatContainerRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [chat?.messages?.length, chatContainerRef]);

  useEffect(() => {
    if (typing) {
      sendTyping(socket, { userId: user?._id, chatId: chat?._id });
      const timeout = setTimeout(() => {
        sendStoppedTyping(socket, { userId: user?._id, chatId: chat?._id });
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [chat?._id, typing, user?._id]);

  const handleSendMessage = () => {
    let txt = textMessage.trim();
    let msg = image || txt;
    if (!msg) {
      return;
    }

    sendMessage(socket, {
      from: user._id,
      to: chat?.info?._id,
      message: msg,
      type: image ? "image" : "text",
      ad: chat?.ad._id,
    });
    setTextMessage("");
    setImage("");
    sendStoppedTyping(socket, { userId: user?._id, chatId: chat?._id });
  };

  const navigateToListing = () => {
    navigate(`/listing/${chat?.ad?._id}`);
  };

  const navigateToUserPage = () => {
    navigate(`/view-profile/${chat?.info?._id}`);
  };

  if (!chat)
    return (
      <div className="single_chat_loader">
        <Loader />
      </div>
    );
  let messages = [...chat?.messages].reverse() || [];

  return (
    <div className="single_chat" style={{}}>
      <div className="fixed-header">
        <div className="list_row">
          <div className="list_row_left">
            <span>
              <Link to="/messages">
                <ArrowBackIcon />
              </Link>
            </span>
            <img
              onClick={navigateToUserPage}
              className="user_img"
              src={chat?.info?.image}
              alt="user"
            />
            <span onClick={navigateToUserPage} className="row_col">
              <div className="user_name">
                {chat?.info?.firstName} {chat?.info?.lastName}{" "}
                {chat?.info?.nickname && "(" + chat?.info?.nickname + ")"}
                <OnlineStatus current={chat} />
              </div>
              <span className="away_text">
                {chat?.typing?.includes(chat?.info?._id) ? "typing..." : ""}
              </span>
            </span>
          </div>
          <span
            className="action"
            onClick={(e) => {
              e.stopPropagation();
              chatActions.current.classList.toggle("active");

              const fn = () => {
                if (!chatActions?.current)
                  return document.removeEventListener("click", fn);
                if (
                  Array.from(chatActions.current.classList).includes("active")
                ) {
                  chatActions.current.classList.remove("active");
                  document.removeEventListener("click", fn);
                }
              };
              document.addEventListener("click", fn);
            }}
          >
            <MoreVertIcon />
          </span>
          <div className="show_actions" ref={chatActions}>
            {/* <div className="option">
              <StarOutlineRoundedIcon /> Mark as Importrant
            </div> */}
            <div
              className="option"
              onClick={(e) => {
                confirm.openDialog(
                  "Are you sure you want to block " + chat?.info?.nickname ||
                    chat?.info?.firstName,
                  () => {
                    blockChat(socket, {
                      userId: user._id,
                      chatId: chat._id,
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
                    chat?.info?.nickname || chat?.info?.firstName,
                  () => {
                    deleteChat(socket, chat._id);
                    navigate("/messages");
                  },
                  () => {}
                );
              }}
            >
              {" "}
              <DeleteOutlineOutlinedIcon /> Delete Chat
            </div>
          </div>
        </div>
        <div onClick={navigateToListing} className="list_row">
          <div className="list_row_left">
            <span></span>
            <img className="ad_img" src={chat?.ad?.image} alt="user" />
            <span className="ad_title">
              {chat?.ad?.title}
              <br />
              <span className="price">
                ${chat?.ad?.price} /{" "}
                <span className="term">{chat?.ad?.term}</span>
              </span>
            </span>
          </div>
          <span>
            <ArrowForwardIcon />
          </span>
        </div>
      </div>
      <div ref={chatContainerRef} className="messages_container">
        {messages.map((message, index) => {
          return (
            <>
              {/* {index == 0 && message.from === user?._id && (
             
              )} */}
              {index === 0 && message.from === user?._id && (
                <p key={"read-unread"} className="read-unread">
                  {message.read && "read"}
                  {!message.read && "unread"}
                </p>
              )}
              {/* {index === 0 && chat?.typing?.includes(chat?.info?._id) && (
                <p key={"typing"} className="typing">
                  typing...
                </p>
              )} */}

              <MessageRow
                key={index}
                messageDoc={message}
                chat={chat}
                arr={messages}
                setImagePreview={setImagePreview}
              />
            </>
          );
        })}
        {loading && (
          <div
            key={"loading"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
              padding: "20px",
            }}
          >
            <Loader />
          </div>
        )}
      </div>
      {image && (
        <div className="preview_image_cont">
          <img
            onClick={() => setImagePreview(image)}
            src={image}
            className="preview_image"
            alt="preview"
          />
          <div
            className="remove_img_btn"
            onClick={() => {
              setImage("");
            }}
          >
            <CloseIcon />
          </div>
        </div>
      )}

      <input
        type="file"
        name=""
        id=""
        ref={fileInp}
        onChange={async (e) => {
          if (!e.target.files[0]) return;
          const file = await compressor.compress(e.target.files[0], {
            quality: 0.2,
          });
          parseImage(file, (img) => {
            setImage(img);
            setTextMessage("");
          });
        }}
        style={{ display: "none" }}
      />

      {chat.blockedBy.includes(chat.info._id) &&
        !chat.blockedBy.includes(user._id) && (
          <div className="blocked fixed-footer">
            You cannot send messages to this chat.
          </div>
        )}
      {chat.blockedBy.includes(user._id) && (
        <div className="blocked fixed-footer">
          <span>You have blocked this chat,</span>
          <span>
            <span
              style={{ color: "var(--blue)", cursor: "pointer" }}
              onClick={(e) => {
                confirm.openDialog(
                  "Are you sure you want to unblock " + chat?.info?.nickname ||
                    chat?.info?.firstName,
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
          </span>
        </div>
      )}
      {!chat.blockedBy.length && (
        <div className="fixed-footer">
          {!image && (
            <button
              className="img_btn"
              onClick={(e) => fileInp.current.click()}
            >
              <InsertPhotoOutlinedIcon />
            </button>
          )}

          <input
            disabled={image}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            id="messageInput"
            onChange={(e) => {
              setTextMessage(e.target.value);
              setTyping(true);
            }}
            value={textMessage}
            type="text"
            placeholder={image ? "Disabled" : "Type a message..."}
            className="message_input"
          />
          <button onClick={() => handleSendMessage()} className="send_btn">
            <SendIcon />{" "}
          </button>
        </div>
      )}
      {imagePreview && (
        <Modal
          close={() => setImagePreview(null)}
          onKeyDown={(e) => e.key == "Escape" && setImagePreview(null)}
        >
          <img
            className="message_img_preview"
            alt="preview"
            src={imagePreview}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChatComponent;
