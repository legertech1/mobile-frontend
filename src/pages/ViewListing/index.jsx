import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import GoogleMapReact from "google-map-react";
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
  CloseOutlined,
  EditAttributesOutlined,
  EditOutlined,
  KeyboardDoubleArrowUpOutlined,
  Phone,
  Preview,
} from "@mui/icons-material";
import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import marker from "../../assets/images/marker.png";
import { editAd, postAd } from "../../store/adSlice";
import Modal from "../../components/Modal";
import PaymentElement from "../../components/PaymentElement";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ShareIcon from "@mui/icons-material/Share";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Share from "../../components/Share";
import Footer from "../../components/Footer";
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
const countries = { US, CA };
function ViewListing({ preview, edit }) {
  const [listing, setListing] = useState(null);

  const ad = useSelector((state) => state.ad);
  const [postedBy, setPostedBy] = useState(null);
  const [message, setMessage] = useState("");
  const [imgView, setImgView] = useState(false);
  const cart = useSelector((state) => state.cart);
  const params = useParams();
  const [share, setShare] = useState(false);
  const id = params.id;
  const [paymentModal, setPaymentModal] = useState(false);
  const notification = useNotification();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useLocalStorage("country", null);
  const [token, setToken] = useState(null);
  const categories = useSelector((state) => state.categories);
  async function loadAd() {
    try {
      let data = (await axios.get(apis.ad + params.id)).data;
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
      notification.error(err.response.data.error);
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

  useEffect(() => {
    if (!listing) return;
    if (imgView) {
      document.querySelector("#root").style.filter = "blur(5px)";
      document.body.style.overflow = "hidden";
      ref.current.style.zIndex = 999;
    } else {
      document.querySelector("#root").style.filter = "unset";
      document.body.style.overflow = "unset";
      ref.current.style.zIndex = 1;
    }
  }, [imgView, listing]);

  const user = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

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
  const nextBtn = useRef();
  const prevBtn = useRef();
  const ind = useRef();
  const dispatch = useDispatch();
  const [slide, setSlide] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const imgs =
    (listing?.images?.length && listing?.images) || listing?.thumbnails || [];

  useEffect(() => {
    if (!listing) return;
    const images = carousel.current.childNodes;
    Array.from(images).map(
      (img, ind) =>
        (img.style.transform = "translateX(" + (ind + 1 - slide) + "00%)")
    );
  }, [slide, listing]);

  function initEdit(token) {
    dispatch(editAd(ad))
      .unwrap()
      .then((ad) => navigate("/profile"))
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!listing && loading && (
        <div className="logo_loader">
          <IconPlayer icon={blackAnimatedLOGO} />
        </div>
      )}
      {listing && (
        <>
          <div className="view_listing">
            <Navbar
              white={true}
              topOnly={true}
              noPostAd={preview ? true : false}
            />
            <div className="path">
              {" "}
              {listing?.meta?.category || listing?.category}
              <hr />
              {listing?.meta?.subCategory || listing?.subCategory} <hr />
              {listing?.listingID || "A0000000"}
            </div>
            <div className="main left right">
              {" "}
              <div className="left" ref={ref}>
                <div className="left_img_cont">
                  {imgView ? (
                    createPortal(
                      <div className="view_listing">
                        <div
                          className={
                            "images_container" + (imgView ? " view_images" : "")
                          }
                          onScroll={(e) => e.preventDefault()}
                          onClick={(e) => setImgView(true)}
                          onKeyDown={(e) =>
                            e.key == "Escape" && setImgView(false)
                          }
                          tabIndex={0}
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
                          {listing?.images?.length > 1 && (
                            <button
                              className="carousel_button prev"
                              ref={prevBtn}
                              onClick={(e) => prev(listing, slide, setSlide, e)}
                              style={slide < 2 ? { display: "none" } : {}}
                            >
                              <KeyboardArrowLeftIcon />
                            </button>
                          )}

                          {listing?.images?.length > 1 && (
                            <button
                              className="carousel_button next"
                              ref={nextBtn}
                              onClick={(e) => next(listing, slide, setSlide, e)}
                              style={
                                slide >= listing?.thumbnails.length
                                  ? { display: "none" }
                                  : {}
                              }
                            >
                              <KeyboardArrowRightIcon />
                            </button>
                          )}
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

                          {!preview && (
                            <button
                              className={
                                "wishlist" + (wishlisted ? " active" : "")
                              }
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
                              <img
                                onError={imageFallback}
                                src={img}
                                style={{
                                  transform: "translateX(" + ind + "00%)",
                                }}
                              ></img>
                            ))}
                          </div>
                        </div>
                      </div>,
                      document.querySelector("#portal")
                    )
                  ) : (
                    <div
                      className={
                        "images_container" + (imgView ? " view_images" : "")
                      }
                      onScroll={(e) => e.preventDefault()}
                      onClick={(e) => setImgView(true)}
                      onKeyDown={(e) => e.key == "Escape" && setImgView(false)}
                      tabIndex={0}
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
                      {listing?.images?.length > 1 && (
                        <button
                          className="carousel_button prev"
                          ref={prevBtn}
                          onClick={(e) => prev(listing, slide, setSlide, e)}
                          style={slide < 2 ? { display: "none" } : {}}
                        >
                          <KeyboardArrowLeftIcon />
                        </button>
                      )}

                      {listing?.images?.length > 1 && (
                        <button
                          className="carousel_button next"
                          ref={nextBtn}
                          onClick={(e) => next(listing, slide, setSlide, e)}
                          style={
                            slide >= listing?.thumbnails.length
                              ? { display: "none" }
                              : {}
                          }
                        >
                          <KeyboardArrowRightIcon />
                        </button>
                      )}
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
                          <img
                            onError={imageFallback}
                            src={img}
                            style={{
                              transform: "translateX(" + ind + "00%)",
                            }}
                          ></img>
                        ))}
                      </div>
                    </div>
                  )}
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
                        <h3 className="name">
                          {postedBy?.BusinessInfo?.name}
                          {postedBy?.BusinessInfo?.email && (
                            <>
                              <hr />
                              <a
                                href={"mailto:" + postedBy?.BusinessInfo?.email}
                              >
                                <AlternateEmailIcon />{" "}
                                {postedBy?.BusinessInfo?.email}
                              </a>
                            </>
                          )}
                        </h3>
                        <p className="address">
                          {postedBy?.BusinessInfo?.address}
                        </p>
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
                              <hr />
                              <a
                                href={"tel:" + postedBy?.BusinessInfo?.phone}
                                target="_blank"
                              >
                                <Phone />
                                {postedBy?.BusinessInfo?.phone}
                              </a>
                            </>
                          )}

                          {postedBy?.BusinessInfo?.youtube && (
                            <>
                              <hr />
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
                      <InfoOutlinedIcon /> Details
                    </h1>

                    <div className="extra_fields">
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
                <div className="description tile">
                  <h1>
                    {" "}
                    <DescriptionOutlinedIcon /> Description
                  </h1>
                  <p>
                    <pre>{listing?.description}</pre>
                  </p>
                </div>

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
              <div className="right">
                {preview && (
                  <div className="tile preview">
                    <h1>
                      <CheckIcon />
                      Lets post it then?
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
                            if (!Number(total)) {
                              const { token } = (
                                await axios.post(apis.createPaymentIntent, {
                                  pricing: cart,
                                  category: ad.category,
                                })
                              ).data;
                              dispatch(updateCart({}));
                              setToken(token);
                            } else setPaymentModal(true);
                          }
                        }}
                      >
                        <KeyboardDoubleArrowUpOutlined /> Post
                      </button>
                    </div>
                  </div>
                )}
                <div className="title_and_price tile">
                  <div className="posted_on">
                    {" "}
                    <p>
                      <CalendarMonthIcon />
                      Posted on{" "}
                      <span>
                        {new Date(listing?.createdAt).getDate()}{" "}
                        {monthNames[new Date(listing?.createdAt).getMonth()]}
                        {", "}
                        {new Date(listing?.createdAt).getFullYear()}
                      </span>
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

                  <h2>{listing?.title}</h2>
                  <h1 className="price">
                    <span>${listing?.price || "Free"}</span>/{listing?.term}{" "}
                    {listing?.tax != "none" && (
                      <p className="tax">+{listing?.tax}</p>
                    )}{" "}
                    <img
                      className="country_img_global"
                      src={countries[listing?.meta?.country || country]}
                      alt=""
                    />
                  </h1>
                </div>
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
                      <KeyboardArrowRightIcon />
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
              </div>
            </div>
          </div>
          {share && (
            <Modal close={(e) => setShare(false)}>
              <Share
                close={(e) => setShare(false)}
                url={window.location.href}
              />
            </Modal>
          )}
          {paymentModal && (
            <Modal close={(e) => setPaymentModal(false)}>
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
            <Modal close={() => setToken(null)}>
              <AdPosthandler
                close={() => setToken(null)}
                token={token}
                onSuccess={(e) => setPaymentSuccess(true)}
              />
            </Modal>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}
export default ViewListing;
