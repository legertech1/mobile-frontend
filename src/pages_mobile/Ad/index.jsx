import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, me, removeFromWishlist } from "../../store/authSlice";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import blackAnimatedLOGO from "../../assets/animatedIcons/animated_black_LOGO.json";
import axios from "axios";
import LaunchIcon from "@mui/icons-material/Launch";
import apis from "../../services/api";
import CA from "../../assets/images/CA.svg";
import US from "../../assets/images/USA.svg";

import LinkIcon from "@mui/icons-material/Link";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import SendIcon from "@mui/icons-material/Send";
import IconPlayer from "../../components/IconPlayer";
import "./index.css";
import CheckIcon from "@mui/icons-material/DoneAll";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { defaultMapProps, mapStyles, monthNames } from "../../utils/constants";
import { sendMessage, socket } from "../../socket";
import {
  ArrowBack,
  ArrowForward,
  CloseOutlined,
  EditAttributesOutlined,
  EditOutlined,
  Favorite,
  KeyboardDoubleArrowUpOutlined,
  Phone,
  Preview,
} from "@mui/icons-material";
import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import marker from "../../assets/images/marker.png";
import { editAd, postAd } from "../../store/adSlice";
import Modal from "../../components_mobile/Modal";
import PaymentElement from "../../components/PaymentElement";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ShareIcon from "@mui/icons-material/Share";

import Share from "../../components/Share";

import {
  next,
  prev,
  hover,
  imageFallback,
} from "../../utils/listingCardFunctions";
import useNotification from "../../hooks/useNotification";
import { updateCart } from "../../store/cartSlice";
import { getBalance } from "../../store/balanceSlice";
import success from "../../assets/animatedIcons/successful.json";
import { createPortal } from "react-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import getCartAndTotal from "../../utils/getCartAndTotal";
import AdPosthandler from "../../components/AdPosthandler";
import ripple from "../../utils/ripple";
import { useSwipeable } from "react-swipeable";
import PinchZoomImage from "./PinchToZoom";
import { ChevronRight } from "@styled-icons/entypo/ChevronRight";
import { KeyboardArrowDown } from "styled-icons/material";
const countries = { US, CA };
function ViewListing({ preview, _id, header }) {
  const [listing, setListing] = useState(null);
  const location = useLocation();
  const [edit, setEdit] = useState(
    new URLSearchParams(location.search).get("edit") || false
  );
  const ad = useSelector((state) => state.ad);
  const [postedBy, setPostedBy] = useState(null);
  const [message, setMessage] = useState("");
  const [imgView, setImgView] = useState(false);
  const cart = useSelector((state) => state.cart);
  const params = useParams();

  const [share, setShare] = useState(false);
  const id = _id || location.pathname.split("/")[2];
  const [paymentModal, setPaymentModal] = useState(false);
  const notification = useNotification();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useLocalStorage("country", null);
  const [token, setToken] = useState(null);
  const categories = useSelector((state) => state.categories);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  async function loadAd() {
    try {
      let data = (await axios.get(apis.ad + id)).data;
      loadPerson(data.user);
      setListing(data);
    } catch (err) {
      console.log(err);
      notification.error(err.response.data.error);
      navigate("/");
    }
    setLoading(false);
  }
  async function loadPerson(id) {
    try {
      let data = (await axios.get(apis.getuserInfo + id)).data;
      setPostedBy(data);
    } catch (err) {
      notification.error(
        err.response.data.error || err.response.data || err.message
      );
      navigate("/");
    }
  }

  useEffect(() => {
    if (preview && !ad.title) {
      navigate("/");
    }
    if (preview && edit) {
      setListing({ ...ad });
      setPostedBy(user);
      return;
    }
    if (preview) {
      setListing({ ...ad, user: user._id, createdAt: Date.now() });
      setPostedBy(user);
      return;
    }
    loadAd();
  }, []);

  const ref = useRef();
  useEffect(() => {
    if (loading) return;
    if (!loading && !listing) navigate("/");
  }, [loading]);

  const user = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();
  const details = useRef();
  const desc = useRef();
  useEffect(() => {
    user?.data?.wishlist?.includes(listing?._id)
      ? setWishlisted(true)
      : setWishlisted(false);
  }, [user]);

  function remove() {
    if (preview) return;
    dispatch(removeFromWishlist(listing?._id));
  }

  function add() {
    if (!user || preview) return navigate("/login");
    dispatch(addToWishlist(listing?._id));
  }

  const carousel = useRef();
  const carousel2 = useRef();

  const ind = useRef();
  const dispatch = useDispatch();
  const [slide, setSlide] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const imgs =
    (listing?.images?.length && listing?.images) || listing?.thumbnails || [];

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),

    trackMouse: true,
  });

  const handleSwipe = (direction) => {
    if (direction === "left") {
      if (slide + 1 <= listing.images.length) next(listing, slide, setSlide);
    } else if (direction === "right") {
      if (slide - 1 > 0) prev(listing, slide, setSlide);
    }
  };

  function initEdit(token) {
    dispatch(editAd(ad))
      .unwrap()
      .then((ad) => {
        notification.info("Ad edited successfully");
        navigate("/ads?tab=ads");
      })
      .catch((err) => console.log(err));
  }

  function onPaymentFailed(error) {
    setPaymentModal(false);
    notification.error(error);
  }
  function send({ from, to }) {
    if (!message) return;
    sendMessage(socket, {
      from,
      to,
      message,
      type: "text",
      ad: listing?._id,
    });
    setMessage("");
    navigate("/messages?open=true");
  }
  return (
    <>
      {!listing && loading && (
        <div className="logo_loader">
          <IconPlayer icon={blackAnimatedLOGO} />
        </div>
      )}
      {listing && (
        <>
          <div className="view_listing">
            {header && (
              <div className="ad_header">
                <button
                  className="back"
                  onClick={(e) =>
                    ripple(e, { dur: 1, cb: () => navigate("/") })
                  }
                >
                  <ArrowBack />
                </button>
                <p>{listing?.listingID || "A0000001"}</p>
              </div>
            )}
            <div
              className="main left right"
              style={preview ? { paddingBottom: "60px" } : {}}
            >
              {" "}
              <div className="left_img_cont">
                <div
                  className={"images_container"}
                  onScroll={(e) => e.preventDefault()}
                  onClick={(e) => setImgView(true)}
                  tabIndex={0}
                  {...handlers}
                >
                  <button
                    className="close"
                    onClick={(e) => {
                      e.stopPropagation();

                      setImgView(false);
                    }}
                  >
                    <CloseOutlined />
                  </button>

                  {listing.images?.length > 1 && (
                    <div className="slides" ref={ind}>
                      {listing?.images?.length > 1 &&
                        listing?.images.map((img, i) => (
                          <div
                            className={
                              "dot" + (i + 1 == slide ? " active" : "")
                            }
                          ></div>
                        ))}
                    </div>
                  )}

                  {!preview && (
                    <button
                      className={"wishlist" + (wishlisted ? " active" : "")}
                      onClick={(e) => {
                        e.stopPropagation();
                        wishlisted ? remove() : add();
                      }}
                    >
                      <FavoriteIcon />
                    </button>
                  )}
                  <div
                    className="images"
                    onScroll={(e) => e.preventDefault()}
                    ref={carousel}
                  >
                    {imgs?.map((img, ind) => (
                      <div
                        className="img_cont"
                        style={{
                          transform: "translateX(" + (ind + 1 - slide) + "00%)",
                        }}
                      >
                        <img onError={imageFallback} src={img}></img>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="_left">
                <div className="title_and_price tile">
                  <div className="posted_on">
                    {" "}
                    <p>
                      <CalendarMonthIcon />
                      Posted on{" "}
                      {preview ? (
                        <span>
                          {new Date().getDate()}{" "}
                          {monthNames[new Date().getMonth()]}
                          {", "}
                          {new Date().getFullYear()}
                        </span>
                      ) : (
                        <span>
                          {new Date(listing?.createdAt).getDate()}{" "}
                          {monthNames[new Date(listing?.createdAt).getMonth()]}
                          {", "}
                          {new Date(listing?.createdAt).getFullYear()}
                        </span>
                      )}
                    </p>
                    <div className="actions">
                      {!preview && (
                        <>
                          {" "}
                          <button
                            className="share"
                            onClick={(e) => setShare(true)}
                          >
                            <ShareIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!preview && (
                    <p className="category">
                      {listing?.meta?.category} <ChevronRight />{" "}
                      {listing?.meta?.subCategory}
                      <ChevronRight /> {listing.listingID}
                    </p>
                  )}
                  <h2>{listing?.title}</h2>

                  <h1 className="price">
                    {!listing?.priceHidden ? (
                      <>
                        <span>
                          ${Boolean(listing?.price) ? listing?.price : "Free"}
                        </span>
                        {listing.term ? <p>/{listing?.term}</p> : <p>Total</p>}
                        {listing?.term && listing.installments && (
                          <p
                            className="tax"
                            style={{
                              fontSize: "x-large !important",
                              fontWeight: "600",
                              color: "var(--blue)",
                            }}
                          >
                            x{listing?.installments}
                          </p>
                        )}
                        {listing?.tax != "none" && (
                          <p className="tax">+{listing?.tax}</p>
                        )}{" "}
                      </>
                    ) : (
                      <p className="price_hidden">Please Contact</p>
                    )}
                    <img
                      className="country_img_global"
                      src={countries[listing?.meta?.country || country]}
                      alt=""
                    />
                  </h1>
                </div>
                {(listing?.meta?.business ||
                  (preview && cart.extras?.business)) && (
                  <div className="business tile">
                    <h1>
                      <BusinessIcon /> Business Info
                    </h1>
                    <div className="business_main">
                      <img
                        onError={imageFallback}
                        src={postedBy?.BusinessInfo?.LOGO}
                      />
                      <div className="info">
                        {postedBy?.BusinessInfo?.email && (
                          <>
                            <a href={"mailto:" + postedBy?.BusinessInfo?.email}>
                              <AlternateEmailIcon />{" "}
                              {postedBy?.BusinessInfo?.email}
                            </a>
                          </>
                        )}
                        <h3 className="name">{postedBy?.BusinessInfo?.name}</h3>
                        <p className="address">
                          {postedBy?.BusinessInfo?.address}
                        </p>{" "}
                      </div>
                    </div>
                    <div className="row">
                      {postedBy?.BusinessInfo?.website && (
                        <>
                          {" "}
                          <a
                            href={postedBy?.BusinessInfo?.website}
                            target="_blank"
                          >
                            <LanguageIcon />
                            {postedBy?.BusinessInfo?.website}
                          </a>
                        </>
                      )}

                      {postedBy?.BusinessInfo?.phone && (
                        <>
                          {" "}
                          <a
                            href={"tel:" + postedBy?.BusinessInfo?.phone}
                            target="_blank"
                          >
                            <Phone />
                            {postedBy?.BusinessInfo?.phone &&
                              `(${postedBy.BusinessInfo.phone.slice(
                                0,
                                3
                              )}) ${postedBy.BusinessInfo.phone.slice(
                                3,
                                6
                              )}-${postedBy.BusinessInfo.phone.slice(6)}`}
                          </a>
                        </>
                      )}

                      {postedBy?.BusinessInfo?.youtube && (
                        <>
                          <a
                            href={postedBy?.BusinessInfo?.youtube}
                            target="_blank"
                          >
                            <YouTubeIcon />
                            {postedBy?.BusinessInfo?.youtube}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {(Object.keys(listing?.extraFields || {})?.filter(
                  (k) =>
                    listing.extraFields[k] !== undefined &&
                    listing.extraFields[k] !== ""
                ).length ||
                  null) && (
                  <div className="details tile">
                    <h1>
                      {" "}
                      <InfoOutlinedIcon /> Details{" "}
                      {details?.current?.scrollHeight > "296" && (
                        <span
                          className="expand"
                          onClick={(e) => setDetailsExpanded((state) => !state)}
                          style={
                            detailsExpanded
                              ? { transform: "rotate(180deg)" }
                              : {}
                          }
                        >
                          <KeyboardArrowDown />
                        </span>
                      )}
                    </h1>

                    <div
                      className={"extra_fields"}
                      ref={details}
                      style={
                        detailsExpanded
                          ? { maxHeight: details?.current?.scrollHeight + "px" }
                          : {}
                      }
                    >
                      {Object.keys(listing?.extraFields || {})
                        ?.filter(
                          (k) =>
                            listing.extraFields[k] !== undefined &&
                            listing.extraFields[k] !== ""
                        )
                        ?.map((key) => (
                          <div className="field">
                            <p className="key">{key}</p>
                            <p className="val">
                              {listing?.extraFields[key]}
                              {listing?.extraFields[key] === false && "false"}
                              {listing?.extraFields[key] === true && "true"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                <div className="description tile">
                  <h1>
                    {" "}
                    <DescriptionOutlinedIcon /> Description{" "}
                    {desc?.current?.scrollHeight > "296" && (
                      <span
                        className="expand"
                        onClick={(e) =>
                          setDescriptionExpanded((state) => !state)
                        }
                        style={
                          descriptionExpanded
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      >
                        <KeyboardArrowDown />
                      </span>
                    )}
                  </h1>
                  <p
                    className="_desc"
                    ref={desc}
                    style={
                      descriptionExpanded
                        ? { maxHeight: desc?.current?.scrollHeight + "px" }
                        : {}
                    }
                  >
                    <pre>{listing?.description}</pre>
                  </p>
                </div>
              </div>
              <div className="_right">
                {(listing?.config?.current?.extras?.youtube ||
                  listing?.config?.current?.extras?.website) && (
                  <div className="tile youtube_website">
                    <h1>
                      <LinkIcon /> Links
                    </h1>
                    <div>
                      {listing?.config?.current?.extras?.youtube && (
                        <p>
                          <YouTubeIcon />
                          <a
                            href={
                              listing?.config?.current?.extras?.youtube?.url
                            }
                            target="_blank"
                          >
                            {listing?.config?.current?.extras?.youtube?.url}
                          </a>{" "}
                        </p>
                      )}
                      {listing?.config?.current?.extras?.website && (
                        <p>
                          <LanguageIcon />{" "}
                          <a
                            href={
                              listing?.config?.current?.extras?.website?.url
                            }
                            target="_blank"
                          >
                            {listing?.config?.current?.extras?.website?.url}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {preview && (
                  <div className="tile preview">
                    <h1>
                      <CheckIcon />
                      Let's post it then?
                    </h1>
                    <div className="actions">
                      <button
                        className="continue_editing btn_blue_m"
                        onClick={(e) =>
                          edit ? navigate("/edit/" + id) : navigate("/post-ad")
                        }
                      >
                        <EditOutlined /> Keep Editing
                      </button>
                      <button
                        className="postAd btn_blue_m"
                        onClick={async (e) => {
                          if (edit) initEdit();
                          else {
                            const [total, _] = getCartAndTotal(
                              cart,
                              user,
                              categories.filter((c) => c.name == ad.category)[0]
                            );
                            console.log(total);
                            if (!Number(total)) {
                              try {
                                const { token } = (
                                  await axios.post(apis.createPaymentIntent, {
                                    pricing: cart,
                                    category: ad.category,
                                  })
                                ).data;
                                dispatch(updateCart({}));
                                setToken(token);
                              } catch (err) {
                                console.log(err);
                              }
                            } else setPaymentModal(true);
                          }
                        }}
                      >
                        <KeyboardDoubleArrowUpOutlined /> Post
                      </button>
                    </div>
                  </div>
                )}
                {listing?.location && listing.location?.coordinates && (
                  <div className="location tile">
                    <h1>
                      <PinDropOutlinedIcon />
                      Location
                    </h1>
                    <p className="location_name">
                      {listing?.location?.name}{" "}
                      <a
                        href={
                          "https://www.google.com/maps?q=" +
                          (listing?.showPreciseLocation
                            ? listing?.location?.coordinates.lat +
                              "," +
                              listing?.location?.coordinates.long
                            : listing?.location?.name)
                        }
                        target="_blank"
                      >
                        {" "}
                        <LaunchIcon />
                      </a>
                    </p>
                    <div className="map">
                      <GoogleMap
                        center={
                          {
                            lat: listing?.location?.coordinates.lat,
                            lng: listing?.location?.coordinates.long,
                          } || defaultMapProps.center
                        }
                        zoom={defaultMapProps.zoom}
                        mapContainerStyle={mapStyles}
                        options={{
                          mapTypeControl: false,
                          fullscreenControl: false,
                          streetViewControl: false,
                          rotateControl: false,
                          scaleControl: false,
                        }}
                      >
                        {listing?.location && !listing?.showPreciseLocation && (
                          <Circle
                            center={{
                              lat: listing?.location?.coordinates.lat,
                              lng: listing?.location?.coordinates.long,
                            }}
                            radius={2000} // in meters
                            options={{
                              fillColor: "#2196f3", // fill color of the circle
                              fillOpacity: 0.4, // opacity of the fill
                              strokeColor: "#2196f3", // border color of the circle
                              strokeOpacity: 0.8, // opacity of the border
                              strokeWeight: 2, // border thickness
                            }}
                            // options={place.circle.options}
                          />
                        )}
                        {listing?.location && listing?.showPreciseLocation && (
                          <OverlayView
                            position={{
                              lat: listing?.location?.coordinates.lat,
                              lng: listing?.location?.coordinates.long,
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          >
                            <div className="map_marker">
                              <img src={marker} alt="" />
                            </div>
                          </OverlayView>
                        )}
                      </GoogleMap>
                    </div>
                  </div>
                )}
                {!preview && (
                  <div className="seller_info tile">
                    <h1>
                      <PersonOutlineOutlinedIcon /> Posted By
                    </h1>
                    <div
                      className="info"
                      onClick={(e) =>
                        postedBy?._id == user?._id
                          ? navigate("/profile")
                          : navigate("/user/" + postedBy?._id)
                      }
                    >
                      <img
                        onError={imageFallback}
                        src={
                          listing?.meta?.business
                            ? postedBy?.BusinessInfo?.LOGO
                            : postedBy?.image
                        }
                        alt=""
                      />
                      <div>
                        <p className="name">
                          {listing?.meta?.business
                            ? postedBy?.BusinessInfo?.name
                            : postedBy?.firstName +
                              " " +
                              postedBy?.lastName}{" "}
                          {user?._id == listing?.user && "(You)"}
                        </p>
                        <p className="member_since">
                          Member since{" "}
                          <span>
                            {" "}
                            {
                              monthNames[
                                new Date(postedBy?.createdAt).getMonth()
                              ]
                            }
                            , {new Date(postedBy?.createdAt).getYear() + 1900}
                          </span>
                        </p>
                      </div>
                      <ArrowForward />
                    </div>
                    {user && user?._id != listing?.user && (
                      <div className="send_message">
                        <input
                          type="text"
                          placeholder="Send a Message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) =>
                            e.key == "Enter" &&
                            send({ from: user?._id, to: postedBy?._id })
                          }
                        />
                        <button
                          onClick={(e) =>
                            send({ from: user?._id, to: postedBy?._id })
                          }
                        >
                          <SendIcon />
                        </button>
                      </div>
                    )}
                    {!user && (
                      <div className="no_user_message">
                        <Link to="/login"> Login</Link> to send a message to{" "}
                        {postedBy?.nickname || postedBy?.firstName}
                      </div>
                    )}
                    {user?._id == listing?.user && (
                      <div className="no_user_message">
                        You cant message yourself.
                      </div>
                    )}
                  </div>
                )}
                {listing?.tags?.length ? (
                  <div className="tags tile">
                    <h1>
                      <LabelOutlinedIcon /> Tags
                    </h1>
                    <div>
                      {listing.tags?.map((tag) => (
                        <div className="tag">{tag}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {share && (
            <Modal
              close={(e) => setShare(false)}
              heading={
                <span>
                  <ShareIcon /> Share this Ad
                </span>
              }
            >
              <Share
                close={(e) => setShare(false)}
                url={
                  process.env.REACT_APP_FRONTEND_URL +
                  "/listing/" +
                  listing?._id
                }
              />
            </Modal>
          )}
          {paymentModal && (
            <Modal
              heading={"Post Ad"}
              className="payment"
              close={(e) => setPaymentModal(false)}
            >
              <PaymentElement
                onPaymentSuccessful={(token) => setToken(token)}
                onPaymentFailed={onPaymentFailed}
                close={(e) => setPaymentModal(false)}
              />
            </Modal>
          )}
          {paymentSuccess && (
            <Modal close={() => setPaymentSuccess(false)}>
              <div className="_success">
                {" "}
                <IconPlayer icon={success} once={true} />
                <p>Ad posted successfully</p>
              </div>
            </Modal>
          )}
          {token && (
            <Modal
              close={() => setToken(null)}
              heading={"Your Ad is Being Posted"}
              className={"post_ad_handler"}
            >
              <AdPosthandler
                close={() => setToken(null)}
                token={token}
                onSuccess={(e) => setPaymentSuccess(true)}
              />
            </Modal>
          )}
          {imgView && (
            <Modal
              className={"gallery"}
              close={(e) => setImgView(false)}
              heading={"Image " + slide + " of " + listing?.images.length}
            >
              <div className="_gallery">
                <div className={"images_container"} tabIndex={0}>
                  <div className="slides" ref={ind}>
                    {listing?.images?.length > 1 &&
                      listing?.images.map((img, i) => (
                        <div
                          className={"dot" + (i + 1 == slide ? " active" : "")}
                        ></div>
                      ))}
                  </div>

                  <div
                    className="images"
                    onScroll={(e) => e.preventDefault()}
                    ref={carousel2}
                  >
                    {imgs?.map((img, ind) => (
                      <div
                        className="img_cont"
                        style={{
                          transform: "translateX(" + (ind + 1 - slide) + "00%)",
                        }}
                      >
                        <PinchZoomImage
                          src={img}
                          onSwipedLeft={() => handleSwipe("left")}
                          onSwipedRight={() => handleSwipe("right")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
}
export default ViewListing;
