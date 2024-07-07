import { NotificationsRounded } from "@mui/icons-material";

import React, { useMemo, useState } from "react";
import MobileLogo from "../../assets/images/MainLogo.svg";
import MobileLogo2 from "../../assets/images/MainLogoBlack.svg";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ripple from "../../utils/ripple";
import Modal from "../Modal";
import Notifications from "./Notifications";
function Header({ white, noUser }) {
  const user = useSelector((state) => state.auth);
  const [notifs, setNotifs] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const unread = useMemo(() => {
    if (!notifications) return 0;
    let ur = 0;

    for (let notif of notifications) if (!notif.read) ur++;

    return ur;
  }, [notifications?.length]);
  const navigate = useNavigate();
  return (
    <div className="_header">
      <div className="logo">
        {white ? (
          <img src={MobileLogo2} alt="" onClick={(e) => navigate("/")} />
        ) : (
          <img src={MobileLogo} alt="" onClick={(e) => navigate("/")} />
        )}
      </div>
      {user && (
        <>
          <div className="overlay">
            {Boolean(unread) && (
              <span className="dot">{unread > 9 ? "9+" : unread}</span>
            )}
            <div
              className="notifications option"
              onClick={(e) => ripple(e, { dur: 1, cb: () => setNotifs(true) })}
            >
              <NotificationsRounded />
            </div>
          </div>

          {!noUser && (
            <div className="overlay">
              <div
                className="user option"
                onClick={(e) => ripple(e, { dur: 2 })}
              >
                <img
                  src={user.image}
                  alt=""
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </div>
          )}
        </>
      )}
      {!user && (
        <div
          className="sign-in-btn"
          onClick={(e) => {
            ripple(e);
            navigate("/login");
          }}
        >
          Sign in
        </div>
      )}

      {notifs && (
        <Modal
          close={(e) => setNotifs(false)}
          className={"ad"}
          heading={
            <span>
              Notifications{" "}
              {Boolean(unread) && (
                <span className="heading_unread">({unread})</span>
              )}
            </span>
          }
        >
          <Notifications notifications={notifications} />
        </Modal>
      )}
    </div>
  );
}

export default Header;
