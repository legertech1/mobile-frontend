import { useContext } from "react";
import { NotificationServiceContext } from "../services/notification";

const useNotification = () => {
  const notification = useContext(NotificationServiceContext);
  return notification;
};

export default useNotification;
