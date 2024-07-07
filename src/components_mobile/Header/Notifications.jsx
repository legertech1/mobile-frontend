import React, { useRef } from "react";
import { imageFallback } from "../../utils/listingCardFunctions";
import ripple from "../../utils/ripple";
import { deleteNotification, notificationRead, socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { NotificationsRounded } from "@mui/icons-material";
import { parseTime } from "../../utils/helpers";
import { useSwipeable } from "react-swipeable";

function Notif({ n }) {
  const navigate = useNavigate();
  const nRef = useRef();
  const handleSwipe = (direction) => {
    console.log(direction, nRef);
    if (direction === "left") {
      document.querySelector("#notif_" + n._id).classList.add("left");
      setTimeout(() => {
        deleteNotification(socket, n);
        document.querySelector("#notif_" + n._id).style.display = "none";
      }, 300);
    } else if (direction === "right") {
      document.querySelector("#notif_" + n._id).classList.add("right");
      setTimeout(() => {
        deleteNotification(socket, n);
        document.querySelector("#notif_" + n._id).style.display = "none";
      }, 300);
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),

    trackMouse: true,
  });

  let time = parseTime(n.createdAt);
  return (
    <div
      className={"notif" + (!n.read ? " unread" : "")}
      id={"notif_" + n._id}
      {...handlers}
    >
      <div
        className="overlay"
        onClick={(e) =>
          ripple(e, {
            dur: 2,
            fast: true,
            cb: () => {
              notificationRead(socket, n._id);
              navigate(n.link || "/");
            },
          })
        }
      ></div>
      <img src={n.image} onError={imageFallback} alt="" />
      <div className="main">
        <p>{n.content}</p>
        <p className="time">
          {time} {time != "Just now" && "ago"}
        </p>
      </div>
    </div>
  );
}

function Notifications({ notifications }) {
  return (
    <div className="_notifications">
      {notifications &&
        Boolean(notifications.length) &&
        [...notifications].reverse().map((n) => <Notif n={n} key={n._id} />)}
      {notifications && Boolean(notifications.length) && (
        <p>Swipe left or right to dimiss</p>
      )}
      {!notifications ||
        (!notifications.length && (
          <div className="no_notifs">
            <NotificationsRounded /> No notifications{" "}
          </div>
        ))}
    </div>
  );
}

export default Notifications;
