import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowDownwardOutlined,
  ArrowRight,
  ArrowRightAltOutlined,
  EmailOutlined,
  KeyboardArrowDown,
  LogoutOutlined,
  MailOutline,
  MoreHorizOutlined,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout, me } from "../store/authSlice";
import LOGO from "../assets/images/MainLogo.svg";
import LOGO2 from "../assets/images/MainLogoBlack.svg";
import apis from "../services/api";
import Modal from "./Modal";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IconPlayer from "./IconPlayer";
import notifAnimation from "../assets/animatedIcons/notification.json";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavedSearches from "./SavedSearches";
import LocationBox from "./LocationBox";
import WebLocation from "./WebLocation";
import { deleteNotification, notificationRead, socket } from "../socket";
import useConfirmDialog from "../hooks/useConfirmDialog";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PolicyOutlined from "@mui/icons-material/PolicyOutlined";
import { imageFallback } from "../utils/listingCardFunctions";
import { clearNotifications } from "../store/notificationSlice";
import NotificationLoader from "./NotificationLoader";
import OurPricing from "./OurPricing";
import CA from "../assets/images/CA.svg";
import US from "../assets/images/USA.svg";
import { useLocalStorage } from "@uidotdev/usehooks";
import useNotification from "../hooks/useNotification";
import { parseTime } from "../utils/helpers";
import Settings from "./Settings";
import NotificationSettings from "./NotificationSettings";
import EmailSettings from "./EmailSettings";
const countries = {
  US: { image: US, name: "USA", currency: "USD" },
  CA: {
    image: CA,
    name: "Canada",
    currency: "CAD",
  },
};

function Navbar({ white, topOnly, noLoc, noPostAd }) {
  const notifier = useNotification();
  const dispatch = useDispatch();
  const [fixed, setFixed] = useState(false);
  const nav = useRef();
  const user = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chats);
  const notifications = useSelector((state) => state.notifications);
  const userMenu = useRef();
  const name = `${user?.firstName} ${user?.lastName}`;
  const [sSModal, setSSModal] = useState(false);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [chatUpdate, setChatUpdate] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectCountry, setSelectCountry] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);

  const [country, setCountry] = useLocalStorage("country", null);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );

  const notificationBox = useRef();

  const showModal = () => {
    setShowLocationModal(true);
  };

  const hideModal = () => {
    setShowLocationModal(false);
  };

  const confirm = useConfirmDialog();

  async function handleLogout() {
    confirm.openDialog(
      "Are you sure you want to logout?",
      async () => {
        dispatch(logout());
        dispatch(clearNotifications());
      },
      () => {}
    );
  }

  useEffect(() => {
    if (topOnly) return;

    window.onscroll = function (e) {
      setTimeout(() => {
        if (window.scrollY > 300) setFixed(true);
        else setFixed(false);
      }, 300);
    };
  }, []);

  useEffect(() => {
    if (!chats || !user) return;
    let chatUpdates = 0;

    for (let chat of chats) {
      if (
        chat?.messages[chat?.messages?.length - 1]?.read == false &&
        chat?.messages[chat?.messages?.length - 1]?.to == user._id
      ) {
        chatUpdates++;
      }
    }

    setChatUpdate(chatUpdates);
  }, [chats, user]);

  useEffect(() => {
    if (!notifications || !user) return;
    let unread = 0;

    for (let notif of notifications) if (!notif.read) unread++;

    setNotificationUpdate(unread);
  }, [notifications, user]);

  return (
    <div
      className={
        "nav" + (white ? " white" : "") + (fixed ? " white fixed" : "")
      }
      ref={nav}
    >
      <div>
        <div className="start_row">
          <Link to="/">
            <h1 className="logo">
              <img
                onError={imageFallback}
                src={fixed || white ? LOGO2 : LOGO}
              ></img>
              {/* Borrowbe */}
            </h1>
          </Link>
          <nav>
            <ul>
              <li>
                {!noLoc && (
                  <LocationBox
                    location={selectedLocation}
                    showModal={showModal}
                    white={white}
                    fixed={fixed}
                  />
                )}
              </li>
            </ul>
          </nav>
        </div>

        <nav>
          <ul>
            <li
              onClick={(e) => {
                e.stopPropagation();
                notificationBox.current.classList.toggle("active");

                const fn = () => {
                  if (!notificationBox?.current)
                    return document.removeEventListener("click", fn);
                  if (
                    Array.from(notificationBox.current.classList).includes(
                      "active"
                    )
                  ) {
                    notificationBox.current.classList.remove("active");
                    document.removeEventListener("click", fn);
                  }
                };
                document.addEventListener("click", fn);
              }}
            >
              <div
                className={
                  "hidden_dot" + (notificationUpdate ? " notfication_dot" : "")
                }
              >
                {notificationUpdate > 9 ? "9+" : notificationUpdate}
              </div>
              <NotificationsIcon />
              <div className="notification_box" ref={notificationBox}>
                <div className="heading">
                  <NotificationsIcon /> Notifications{" "}
                  {Boolean(notificationUpdate) && (
                    <span>({notificationUpdate})</span>
                  )}
                </div>
                <div className="notifications">
                  {Boolean(notifications?.length) &&
                    [...notifications]?.reverse()?.map((notif) => (
                      <div
                        className={
                          "notification" + (notif.read ? "" : " unread")
                        }
                        onClick={() => {
                          notificationRead(socket, notif._id);
                          navigate(notif.link || "/");
                        }}
                      >
                        <img
                          src={notif?.image}
                          onError={imageFallback}
                          alt=""
                        />
                        <div className="notif_info">
                          <p className="content">
                            {notif.content}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(socket, notif);
                              }}
                            >
                              <CloseOutlinedIcon />
                            </button>
                          </p>
                          <p className="time">{parseTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  {!user && (
                    <div className="animated_icon">
                      <IconPlayer icon={notifAnimation} />
                    </div>
                  )}
                  {user && notifications && !notifications.length && (
                    <div className="animated_icon">
                      <IconPlayer icon={notifAnimation} />
                    </div>
                  )}
                  {user &&
                    !notifications &&
                    [0, 0, 0, 0, 0].map(() => <NotificationLoader />)}
                </div>
              </div>
            </li>
            <li onClick={(e) => navigate("/wishlist")}>
              <FavoriteIcon />
            </li>
            <li onClick={(e) => navigate("/messages")}>
              <div
                className={
                  "hidden_dot" + (chatUpdate ? " notfication_dot" : "")
                }
              >
                {chatUpdate > 9 ? "9+" : chatUpdate}
              </div>
              <ChatBubbleOutlineOutlinedIcon />
            </li>
          </ul>

          {user ? (
            <>
              <li
                id="nav_profile_container"
                onClick={(e) => {
                  e.stopPropagation();
                  userMenu.current.classList.toggle("active");
                  userMenu.current.parentNode.classList.toggle("active");

                  const fn = () => {
                    if (!userMenu?.current)
                      return document.removeEventListener("click", fn);
                    if (
                      Array.from(userMenu?.current?.classList)?.includes(
                        "active"
                      )
                    ) {
                      userMenu.current.classList.remove("active");
                      userMenu.current.parentNode.classList.remove("active");
                      document.removeEventListener("click", fn);
                    }
                  };
                  document.addEventListener("click", fn);
                }}
              >
                <div id="nav_profile">
                  <img onError={imageFallback} src={user.image} alt="" />
                  <div id="nav_profile_main">
                    <div>
                      <span>Hello,</span>
                      <p>{user?.firstName}</p>
                    </div>
                  </div>
                </div>
                <div className="user_menu" ref={userMenu}>
                  <div className="user_menu_profile">
                    <img onError={imageFallback} src={user.image} alt="" />
                    <div className="user_menu_profile_main">
                      <h2>
                        {name}
                        {/* <hr /> <p>{user?.customerID}</p> */}
                      </h2>

                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="view_profile">
                    <button onClick={() => navigate("/profile")}>
                      View Profile
                    </button>
                  </div>
                  {country && (
                    <li
                      className="country_select menu_option"
                      onClick={() =>
                        noPostAd
                          ? notifier.error(
                              "Can't change country while posting Ad"
                            )
                          : setSelectCountry(true)
                      }
                    >
                      <img
                        src={countries[country]?.image}
                        onError={imageFallback}
                        alt="country flag"
                      />

                      <div className="country_currency">
                        <p>{countries[country].name}</p>
                      </div>
                      <KeyboardArrowDown />
                    </li>
                  )}
                  <hr />

                  <div className="menu_option" onClick={() => navigate("/ads")}>
                    <TuneIcon /> Manage Ads
                  </div>

                  <div
                    className="menu_option"
                    onClick={() => setShowPricing(true)}
                  >
                    <AttachMoneyIcon />
                    Our Pricing
                  </div>

                  <div
                    className="menu_option"
                    onClick={(e) => setSSModal(true)}
                  >
                    <BookmarkBorderOutlinedIcon /> Saved Searches
                  </div>

                  <hr />
                  <div
                    className="menu_option"
                    onClick={() => setShowOptions(true)}
                  >
                    <MoreHorizOutlined /> More Options
                  </div>
                  <div className="menu_option" onClick={handleLogout}>
                    <LogoutOutlined /> Logout
                  </div>
                </div>
              </li>
            </>
          ) : (
            <Link to="/login">
              <li>
                Hello, <span className="nav_sign_in">Sign In</span>
              </li>
            </Link>
          )}
          {showOptions && (
            <Modal close={() => setShowOptions(false)} className={`settings`}>
              <div className="_options" onClick={(e) => setShowOptions(false)}>
                <div className="opt" onClick={(e) => setShowSettings(true)}>
                  <SettingsOutlinedIcon /> Account Settings
                </div>

                <div className="opt" onClick={() => navigate("/help")}>
                  <PolicyOutlined />
                  Help & Support
                </div>
                <div
                  className="opt"
                  onClick={(e) => setShowNotificationSettings(true)}
                >
                  <NotificationsIcon /> Notification Settings
                </div>
                <div
                  className="opt"
                  onClick={(e) => setShowEmailSettings(true)}
                >
                  <MailOutline /> Email Settings
                </div>
              </div>
            </Modal>
          )}
          {!noPostAd && (
            <Link to="/post-ad">
              <button
                onClick={() => !user && navigate("/login")}
                className="btn_classic"
              >
                Post Ad
              </button>
            </Link>
          )}
        </nav>
      </div>
      {sSModal && (
        <Modal close={() => setSSModal(false)}>
          <SavedSearches close={() => setSSModal(false)} />
        </Modal>
      )}

      {showLocationModal && (
        <Modal
          className={"location_modal"}
          title={"Your Location"}
          close={hideModal}
        >
          <WebLocation close={hideModal} />
        </Modal>
      )}
      {showPricing && (
        <Modal close={() => setShowPricing(false)}>
          <OurPricing close={() => setShowPricing(false)} />
        </Modal>
      )}
      {selectCountry && (
        <Modal close={() => setSelectCountry(false)}>
          <div className="select_country">
            {" "}
            <div
              className="country"
              onClick={() => {
                setCountry("CA");
                window.location.reload();
              }}
            >
              <img src={CA} alt="" />
              Canada
            </div>
            <div
              className="country"
              onClick={() => {
                setCountry("US");
                setSelectCountry(false);
                window.location.reload();
              }}
            >
              <img src={US} alt="" />
              USA
            </div>
          </div>
        </Modal>
      )}
      {showNotificationSettings && (
        <Modal close={(e) => setShowNotificationSettings(false)}>
          <NotificationSettings />
        </Modal>
      )}
      {showEmailSettings && (
        <Modal close={(e) => setShowEmailSettings(false)}>
          <EmailSettings />
        </Modal>
      )}
      {showSettings && (
        <Modal close={(e) => setShowSettings(false)} className={"settings"}>
          <Settings close={(e) => setShowSettings(false)} />
        </Modal>
      )}
    </div>
  );
}

export default Navbar;
