import { io } from "socket.io-client";
import {
  setChats,
  receiveMessage,
  setUserOnline,
  setUserOffline,
  userTyping,
  userStoppedTyping,
  updateChat,
  chatDeleted,
  loadMessages,
  updateMessage,
  addChat,
} from "../store/chatSlice";
import {
  loadNotifications,
  notificationDeleted,
  notificationRecieved,
  notificationUpdate,
} from "../store/notificationSlice";
import { patchUpdate } from "../store/categorySlice";
import { pushUpdate } from "../store/updateSlice";
import { getBalance } from "../store/balanceSlice";
// import Cookies from "js-cookie";

export const socket = io("http://192.168.1.4:8080/", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export const sendMessage = (socket, message) => {
  socket.emit("send_message", message);
};

export const disconnect = (socket) => socket.emit("disconnect");

export const getMessages = (socket, { chatId, limit, page }) => {
  socket.emit("load_messages", {
    chatId,
    limit,
    page,
  });
};

export const getNotifications = (socket, page) => {
  socket.emit("get_notifications", page);
};

export const notificationRead = (socket, id) => {
  socket.emit("notification_read", id);
};

export const deleteNotification = (socket, notif) => {
  socket.emit("delete_notification", notif);
};

export const deleteChat = (socket, chatId) => {
  socket.emit("delete_chat", chatId);
};
export const deleteMessage = (socket, chatId, messageId) => {
  socket.emit("delete_message", chatId, messageId);
};
export const sendTyping = (socket, typing) => {
  socket.emit("typing", typing);
};
export const sendStoppedTyping = (socket, typing) => {
  socket.emit("stopped_typing", typing);
};
export const loadChats = (socket) => {
  socket.emit("load_chats");
};
export const blockChat = (socket, data) => {
  socket.emit("block_chat", data);
};

export const unBlockChat = (socket, data) => {
  socket.emit("unblock_chat", data);
};

export const messageRead = (socket, chatId, messageId) => {
  socket.emit("message_read", chatId, messageId);
};
export const init = (socket, dispatch) => {
  socket.on("send_update", (update) => {
    if (update.type == "balance-updated") return dispatch(getBalance());
    dispatch(pushUpdate(update));
  });
  socket.on("send_chats", (chats) => {
    dispatch(setChats(chats));
  });
  socket.on("receive_message", (data) => {
    dispatch(receiveMessage(data));
  });
  socket.on("user_online", (id) => dispatch(setUserOnline({ id })));
  socket.on("user_offline", (id) => dispatch(setUserOffline({ id })));
  socket.on("user_typing", ({ userId, chatId }) => {
    dispatch(userTyping({ userId, chatId }));
  });
  socket.on("user_stopped_typing", ({ userId, chatId }) => {
    dispatch(userStoppedTyping({ userId, chatId }));
  });
  socket.on("chat_blocked", (chat) => {
    dispatch(updateChat(chat));
  });
  socket.on("chat_unblocked", (chat) => {
    dispatch(updateChat(chat));
  });
  socket.on("chat_deleted", (id) => {
    dispatch(chatDeleted(id));
  });
  socket.on("user_read_message", (chatId, message) =>
    dispatch(updateMessage(chatId, message))
  );
  socket.on("user_deleted_message", (chatId, message) =>
    dispatch(updateMessage(chatId, message))
  );
  socket.on("new_chat", (chat) => dispatch(addChat(chat)));

  socket.on("send_notification", (notif) =>
    dispatch(notificationRecieved(notif))
  );
  socket.on("load_notifications", (data) => dispatch(loadNotifications(data)));
  socket.on("notification_update", (notif) =>
    dispatch(notificationUpdate(notif))
  );
  socket.on("notification_deleted", (id) => dispatch(notificationDeleted(id)));
  socket.on("send_messages", (data) => dispatch(loadMessages(data)));
  socket.on("category_update", (category) => dispatch(patchUpdate(category)));
};
