import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Header from "../../components_mobile/Header";
import Wallet from "../../components/Wallet";
import { useDispatch, useSelector } from "react-redux";
import CA from "../../assets/images/CA.svg";
import US from "../../assets/images/USA.svg";
import ChangePassword from "../../components/Settings/ChangePassword";
import LOGO from "../../assets/images/MainLogo.svg";
import {
  AlternateEmailOutlined,
  AlternateEmailRounded,
  ArrowBack,
  BusinessOutlined,
  BusinessRounded,
  ContactSupportOutlined,
  DeleteForeverOutlined,
  DescriptionOutlined,
  EmailOutlined,
  FileOpenOutlined,
  FormatListBulletedOutlined,
  HelpOutlineRounded,
  KeyboardArrowDown,
  KeyboardArrowRight,
  LogoutOutlined,
  MenuOutlined,
  MoneyOutlined,
  NotificationsActiveOutlined,
  OutlinedFlagRounded,
  PaidOutlined,
  PasswordRounded,
  PersonOutlineRounded,
  PersonRemoveAlt1Outlined,
  PersonRemoveOutlined,
  PolicyOutlined,
  PowerOffRounded,
  PowerSettingsNew,
  QuestionAnswerOutlined,
  RemoveCircleOutlineOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useLocalStorage } from "@uidotdev/usehooks";
import { imageFallback } from "../../utils/listingCardFunctions";
import ripple from "../../utils/ripple";
import Modal from "../Modal";
import { useLocation, useNavigate } from "react-router-dom";
import ModalSelector from "../ModalSelector";
import CreatePassword from "../../components/Settings/ChangePassword";
import DeleteAccount from "../../components/Settings/DeleteAccount";
import ChangeEmail from "../../components/Settings/ChangeEmail";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import { clearNotifications } from "../../store/notificationSlice";
import { logout } from "../../store/authSlice";
import Doc from "./Doc";
import Info from "./Info";
import Pricing from "./Pricing";
import Transactions from "./Transactions";
import ContactUsForm from "../../pages/ContactUs/ContactUsForm";
import EmailSettings from "../../components/EmailSettings";
import NotificationSettings from "../../components/NotificationSettings";
import BInfo from "./BInfo";
import Faq from "../../pages/Faq";
import Help from "../../pages/Help";
const countries = {
  US: { image: US, name: "USA", currency: "USD" },
  CA: {
    image: CA,
    name: "Canada",
    currency: "CAD",
  },
};
function Account() {
  const user = useSelector((state) => state.auth);
  const [country, setCountry] = useLocalStorage("country", null);
  const [selectCountry, setSelectCountry] = useState(false);
  const [tab, setTab] = useState("");
  const initRef = useRef();
  const actionRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [accSettings, setAccSettings] = useState(false);
  const confirm = useConfirmDialog();

  useEffect(() => {
    console.log(tab);
    if (tab != "" && location.pathname != "/profile/" + tab)
      navigate("/profile/" + tab);
    else if (tab == "" && location.pathname != "/profile") navigate("/profile");
  }, [tab]);
  const dispatch = useDispatch();
  async function handleLogout() {
    confirm.openDialog(
      "Are you sure you want to logout?",
      async () => {
        dispatch(logout());
        dispatch(clearNotifications());
        navigate("/");
      },
      () => {}
    );
  }
  useEffect(() => {
    if (location.pathname == "/profile") {
      if (tab) setTab("");
      initRef.current.style.transform = "translateX(0)";
      actionRef.current.style.transform = "translateX(100%)";
    } else if (location.pathname.includes("/profile/")) {
      if (!tab) navigate("/profile");
      initRef.current.style.transform = "translateX(-100%)";
      actionRef.current.style.transform = "translateX(0)";
      document.querySelector(".___app").scrollTo(0, 0);
    }
  }, [location.pathname]);
  return (
    <div className="_account">
      <div className="initial" ref={initRef}>
        {" "}
        {user && <Header noUser={true} />}
        <div className={"header" + (!user ? " no_user" : "")}>
          <div className="mask"></div>

          {!user && <img src={LOGO} />}
          {user && (
            <div className="profile">
              <img src={user.image} alt="" />
              <div className="info">
                <h3 className="name">
                  {" "}
                  {user?.firstName + " " + user?.lastName}
                </h3>
                <p className="email"> {user.email}</p>
              </div>
            </div>
          )}
        </div>
        <div className={"main" + (!user ? " no_user" : "")}>
          {!user && (
            <div
              className="tile"
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => navigate("/login"),
                })
              }
            >
              <h2>
                <PersonOutlineRounded /> Login or Register{" "}
              </h2>
            </div>
          )}
          {user && <Wallet />}
          {user && (
            <div
              className={"tile user_info"}
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => setTab("user_info"),
                })
              }
            >
              <h2>
                <PersonOutlineRounded /> User Info{" "}
                <span>
                  <KeyboardArrowRight />
                </span>
              </h2>
            </div>
          )}

          {user && (
            <div
              className={"tile user_info"}
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => setTab("business_info"),
                })
              }
            >
              <h2>
                <BusinessOutlined /> Business Info{" "}
                <span>
                  <KeyboardArrowRight />
                </span>
              </h2>
            </div>
          )}

          <div
            className={"tile busiuness_info"}
            onClick={(e) =>
              ripple(e, {
                dur: 2,
                fast: true,
                cb: () => setTab("pricing"),
              })
            }
          >
            <h2>
              <PaidOutlined /> Ad Pricing
              <span>
                <KeyboardArrowRight />
              </span>
            </h2>
          </div>
          {user && (
            <div
              className={"tile busiuness_info"}
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => setTab("transactions"),
                })
              }
            >
              <h2>
                <FormatListBulletedOutlined /> My Payments
                <span>
                  <KeyboardArrowRight />
                </span>
              </h2>
            </div>
          )}
          {user && (
            <div
              className={"tile account_settings"}
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => setAccSettings(true),
                })
              }
            >
              <h2>
                <SettingsOutlined /> Account Settings{" "}
                <span>
                  <KeyboardArrowDown />
                </span>
              </h2>
            </div>
          )}
          <div
            className="tile country"
            onClick={(e) =>
              ripple(e, {
                dur: 2,
                fast: true,
                cb: (e) => setSelectCountry(true),
              })
            }
          >
            <h2>
              <OutlinedFlagRounded />
              Country{" "}
            </h2>
            <img
              src={countries[country]?.image}
              onError={imageFallback}
              className="country_flag"
              alt="country flag"
            />
          </div>

          <div className="tile options">
            {user && (
              <>
                <div
                  className="option"
                  onClick={(e) => {
                    ripple(e, {
                      dur: 2,
                      fast: true,
                      cb: () => setTab("email-settings"),
                    });
                  }}
                >
                  <EmailOutlined /> Email Settings
                </div>
                <div
                  className="option"
                  onClick={(e) => {
                    ripple(e, {
                      dur: 2,
                      fast: true,
                      cb: () => setTab("notification-settings"),
                    });
                  }}
                >
                  <NotificationsActiveOutlined /> Notification Settings
                </div>
              </>
            )}
            <div
              className="option"
              onClick={(e) => {
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: (e) => setTab("doc/terms-of-use"),
                });
              }}
            >
              <DescriptionOutlined /> Terms of Use
            </div>
            <div
              className="option"
              onClick={(e) => {
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: (e) => setTab("doc/privacy-policy"),
                });
              }}
            >
              <PolicyOutlined /> Privacy Policy
            </div>
            <div
              className="option"
              onClick={(e) => {
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: (e) => setTab("contact-us"),
                });
              }}
            >
              <ContactSupportOutlined /> Contact Us
            </div>
            <div
              className="option"
              onClick={(e) => {
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: (e) => setTab("doc/about-us"),
                });
              }}
            >
              <InfoOutlined /> About Us
            </div>
            <div
              className="option"
              onClick={(e) => {
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: (e) => setTab("help"),
                });
              }}
            >
              <HelpOutlineRounded />
              Help and Support
            </div>
            <div
              className="option"
              onClick={(e) => {
                ripple(e, { dur: 2, fast: true, cb: (e) => setTab("faq") });
              }}
            >
              <QuestionAnswerOutlined /> Frequently Asked Questions
            </div>
          </div>
          {user && (
            <div
              className="logout"
              onClick={(e) => ripple(e, { dur: 2, cb: () => handleLogout() })}
            >
              <LogoutOutlined /> Logout
            </div>
          )}
        </div>
        {selectCountry && (
          <Modal
            close={() => setSelectCountry(false)}
            heading={"Select a country"}
          >
            <div className="select_country">
              {" "}
              <div
                className="country"
                onClick={(e) => {
                  ripple(e, {
                    fast: true,
                    dur: 2,
                    cb: () => {
                      setCountry("CA");
                      window.location.reload();
                    },
                  });
                }}
              >
                <img src={CA} alt="" />
                Canada
              </div>
              <div
                className="country"
                onClick={(e) => {
                  ripple(e, {
                    fast: true,
                    dur: 2,
                    cb: () => {
                      setCountry("US");
                      window.location.reload();
                    },
                  });
                }}
              >
                <img src={US} alt="" />
                USA
              </div>
            </div>
          </Modal>
        )}
        {accSettings && (
          <Modal
            heading={
              <span>
                <SettingsOutlined />
                Account Settings
              </span>
            }
            close={(e) => setAccSettings(false)}
          >
            <ModalSelector
              items={[
                { icon: <PasswordRounded />, value: "Change password" },
                { icon: <AlternateEmailRounded />, value: "Change email" },
                {
                  icon: (
                    <RemoveCircleOutlineOutlined
                      style={{ fill: "var(--red)" }}
                    />
                  ),
                  value: "Delete account",
                },
              ]}
              close={(e) => setAccSettings(false)}
              setState={(v) => setTab(v.value)}
            ></ModalSelector>
          </Modal>
        )}
      </div>
      <div className="action" ref={actionRef}>
        {tab == "Change password" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
            </h2>
            <div className="_setting">
              <ChangePassword />
            </div>
          </>
        )}
        {tab == "Create password" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
            </h2>
            <div className="_setting">
              <CreatePassword />
            </div>
          </>
        )}
        {tab == "Change email" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
            </h2>
            <div className="_setting">
              <ChangeEmail />
            </div>
          </>
        )}
        {tab == "Delete account" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
            </h2>
            <div className="_setting">
              <DeleteAccount />
            </div>
          </>
        )}
        {tab.includes("doc/") && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
            </h2>
            <Doc />
          </>
        )}
        {tab == "user_info" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              User Info
            </h2>
            <Info />
          </>
        )}
        {tab == "business_info" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Business Info
            </h2>
            <BInfo />
          </>
        )}
        {tab == "pricing" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Our Pricing
            </h2>
            <Pricing />
          </>
        )}
        {tab == "transactions" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              My Payments
            </h2>
            <Transactions />
          </>
        )}
        {tab == "contact-us" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Contact Us
            </h2>
            <ContactUsForm />
          </>
        )}
        {tab == "email-settings" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Email updates configuration
            </h2>
            <EmailSettings />
          </>
        )}
        {tab == "notification-settings" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Notification updates configuration
            </h2>
            <NotificationSettings />
          </>
        )}
        {tab == "faq" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Frequently Asked Questions
            </h2>
            <Faq />
          </>
        )}

        {tab == "help" && (
          <>
            <h2 className="heading">
              <div
                className="back"
                onClick={(e) => ripple(e, { dur: 1, cb: (e) => setTab("") })}
              >
                {" "}
                <ArrowBack />
              </div>{" "}
              Help and Support
            </h2>
            <Help setTab={setTab} />{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default Account;
