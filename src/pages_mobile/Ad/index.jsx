import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SendIcon from "@mui/icons-material/Send";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import { defaultMapProps, mapStyles, monthNames } from "../../utils/constants";
import Button from "../../components_mobile/shared/Button";
import Loader from "../../components_mobile/Loader";
import MobileCarousel from "../../components_mobile/MobileCarousel";
import imgPlaceHolder from "../../assets/images/imagePlaceholder.jpg";
import apis from "../../services/api";
import "./index.css";
import marker from "../../assets/images/marker.png";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import {
  editAd,
  initialAdState,
  // postAd,
  setFormData,
} from "../../store/adSlice";
import { sendMessage, socket } from "../../socket";
import usePreviousHook from "../../hooks/usePreviousHook";
import Modal from "../../components_mobile/Modal";
import PaymentElementMobile from "../../components_mobile/PaymentElementMobile";
import useNotification from "../../hooks/useNotification";
import { handleImgError } from "../../utils/helpers";
import { updateCart } from "../../store/cartSlice";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LanguageIcon from "@mui/icons-material/Language";
import { imageFallback } from "../../utils/listingCardFunctions";

import { Phone } from "@mui/icons-material";

export default function Ad(props) {
  const [ad, setAd] = useState(null);

  const [adPostingLoading, setAdPostingLoading] = useState(false);
  const [initiateChat, setInitiateChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const chats = useSelector((state) => state.chats);
  const prevChats = usePreviousHook(chats);

  const [loading, setLoading] = useState(false);
  const [postedBy, setPostedBy] = useState({});
  const params = useParams();
  const preview = !params?.id;
  const { state } = useLocation();
  const [paymentModal, setPaymentModal] = useState(false);

  let adToPreview = state?.ad;

  const editId = state?.editId;

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  let lat = ad?.location?.coordinates?.lat || defaultMapProps.center.lat;
  let lng = ad?.location?.coordinates?.long || defaultMapProps.center.lng;
  const { selectedLocation } = useSelector((state) => state.location);

  async function fetchAd(id) {
    try {
      setLoading(true);
      const res = await axios.get(`${apis.ad}${id}`);

      setAd(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  async function loadPerson(postedById) {
    let id = preview ? user?._id : postedById;

    if (!id) return;
    let data = (await axios.get(apis.getuserInfo + id)).data;
    setPostedBy(data);
  }

  useEffect(() => {
    adToPreview && setAd(adToPreview);
  }, [adToPreview]);

  useEffect(() => {
    params.id && fetchAd(params.id);
  }, [params.id, selectedLocation]);

  useEffect(() => {
    loadPerson(ad?.user);
  }, [ad?.user]);

  const handleSubmitAd = async () => {
    if (!preview) return;

    if (editId) {
      initEdit();
    } else {
      if (cart.free) {
        const { token, free } = (
          await axios.post(apis.createPaymentIntent, {
            pricing: cart,
            category: ad.category,
          })
        ).data;
        dispatch(updateCart({}));
        onPaymentSuccessful(token);
      } else setPaymentModal(true);
    }
  };

  function initEdit(token) {
    setAdPostingLoading(true);
    dispatch(editAd(ad))
      .unwrap()
      .then((ad) => {
        setAdPostingLoading(false);
        navigate("/listing/" + editId);
      })
      .catch((err) => {
        setAdPostingLoading(false);
      });
  }

  const postNewAd = async (token) => {
    setAdPostingLoading(true);
    const adToPost = { ...ad };

    // dispatch(postAd({ ad: adToPost, token }))
    //   .unwrap()
    //   .then((ad) => {
    //     setAdPostingLoading(false);
    //     navigate("/listing/" + ad._id);
    //     dispatch(setFormData(initialAdState));
    //     dispatch(updateCart({}));
    //   })
    //   .catch(() => {
    //     setAdPostingLoading(false);
    //   });
  };

  function onPaymentSuccessful(token) {
    postNewAd(token);
  }
  const notification = useNotification();

  function onPaymentFailed(error) {
    setPaymentModal(false);
    notification.error(error.message);
  }

  const handleSend = () => {
    if (editId || preview) return;

    if (!inputText) {
      alert("Please enter a message");
      return;
    }
    if (chatLoading) return;

    setChatLoading(true);
    sendMessage(socket, {
      from: user?._id,
      to: ad.user,
      message: inputText,
      type: "text",
      ad: ad._id,
    });
    setInitiateChat(true);
  };

  useEffect(() => {
    return () => {
      setChatLoading(false);
      setInitiateChat(false);
      setInputText("");
      setPostedBy({});
      setInitiateChat(false);
    };
  }, []);

  useEffect(() => {
    if (initiateChat) {
      // if (chatId) {
      //   navigate('single-chat/'+chatId);
      //   return;
      // }

      if (chats?.length) {
        let currChat = chats?.find((c) => c.ad._id === ad._id);
        if (currChat) {
          navigate("/single-chat/" + currChat._id);
        }
      }
      if (prevChats?.length !== chats?.length) {
        let currChat = chats?.find((c) => c.ad._id === ad._id);

        if (!currChat) {
          navigate("/messages");
          return;
        }

        navigate("/single-chat/" + currChat._id);
      }
    }
  }, [chats, ad?._id, initiateChat, prevChats?.length]);

  const navigateToUserPage = () => {
    navigate(`/view-profile/${postedBy?._id}`);
  };

  const renderItem = (val) => {
    if (typeof val === "boolean") {
      return (
        <span className={val ? "checkmark" : "close"}>
          {val ? (
            <CheckCircleOutlineOutlinedIcon />
          ) : (
            <HighlightOffOutlinedIcon />
          )}
        </span>
      );
    }
    return <span>{val}</span>;
  };

  return (
    <div className="mobile_ad_view">
      {loading && <Loader title={"Loading ad..."} />}
      <Spinner title={"Posting Ad"} loading={adPostingLoading}>
        {ad && !loading && (
          <>
            {preview && (
              <div className="content">
                <div className="card">
                  <h2
                    style={{
                      textAlign: "center",
                      color: "#2196f3",
                      fontWeight: "bold",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {editId ? "Editing " : "Posting "}
                    Preview Mode
                  </h2>
                </div>
                <br />
              </div>
            )}
            <div className="carousel_card">
              <MobileCarousel
                images={ad?.images?.length > 0 ? ad?.images : [imgPlaceHolder]}
              />
            </div>
            <div className="content">
              <div className="card">
                <p>
                  {ad?.meta?.category || ad?.category} -{" "}
                  {ad?.meta?.subCategory || ad?.subCategory}
                </p>
                <p className="title">{ad.title}</p>

                <p>
                  <span className="price">${ad.price}</span>
                  <span className="price_type">/{ad.term}</span>
                </p>
                <p className="posted_on">
                  <CalendarMonthOutlinedIcon className="icon" />
                  Posted on: <strong className="date">{getDate(ad)}</strong>
                </p>
              </div>
              {ad?.meta?.business && (
                <div className="card">
                  <div className="heading_row">
                    <BusinessIcon />
                    <p className="heading">Business Info </p>
                  </div>
                  <div className="business_main">
                    <div className="info">
                      <div className="text_row">
                        <h3 className="name">{postedBy?.BusinessInfo?.name}</h3>
                        {postedBy?.BusinessInfo?.email && (
                          <>
                            <a>{postedBy?.BusinessInfo?.email}</a>
                          </>
                        )}
                      </div>
                      <img
                        onError={imageFallback}
                        src={postedBy?.BusinessInfo?.LOGO}
                      />
                    </div>

                    <div className="business_row">
                      {postedBy?.BusinessInfo?.website && (
                        <div className="row_item">
                          <div className="title_row">
                            <LocationOnIcon />
                            Address:
                          </div>
                          <a>{postedBy?.BusinessInfo?.address}</a>
                        </div>
                      )}
                      {postedBy?.BusinessInfo?.website && (
                        <div className="row_item">
                          <div className="title_row">
                            <LanguageIcon />
                            Website:
                          </div>
                          <a>{postedBy?.BusinessInfo?.website}</a>
                        </div>
                      )}
                      {postedBy?.BusinessInfo?.phone && (
                        <div className="row_item">
                          <div className="title_row">
                            <Phone />
                            Phone:
                          </div>
                          <a>{postedBy?.BusinessInfo?.phone}</a>
                        </div>
                      )}
                      {postedBy?.BusinessInfo?.youtube && (
                        <div className="row_item">
                          <div className="title_row">
                            <YouTubeIcon />
                            YouTube:
                          </div>
                          <a>{postedBy?.BusinessInfo?.youtube}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="card">
                <div className="heading_row">
                  <InfoOutlinedIcon />
                  <p className="heading">Details </p>
                </div>
                <div className="fields_cont">
                  {Object.keys(ad?.extraFields || {}).map((key, i) => (
                    <div className="field_row" key={key}>
                      <p className="field_title">{key}</p>
                      {renderItem(ad?.extraFields[key])}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="heading_row">
                  <ArticleOutlinedIcon />
                  <p className="heading">Description</p>
                </div>
                <p className="ad_description">{ad.description}</p>
              </div>
              <div className="card">
                <div className="heading_row">
                  <PersonOutlineOutlinedIcon />
                  <p className="heading">Posted By</p>
                </div>
                <div className="posted_by_row" onClick={navigateToUserPage}>
                  <div className="left_cont">
                    <img
                      alt="user_avatar"
                      onError={handleImgError}
                      src={postedBy?.image}
                      className="user_avatar_img"
                    />
                    <div className="user_meta">
                      <p className="username">{postedBy?.firstName}</p>
                      <p className="posted_on">
                        Member since
                        <strong className="date">
                          {new Date(postedBy?.createdAt).getDate()}
                          {` `}
                          {monthNames[new Date(postedBy?.createdAt).getMonth()]}
                          {` `}
                          {new Date(postedBy?.createdAt).getYear() + 1900}
                        </strong>
                      </p>
                    </div>
                  </div>
                  {/* <div> */}
                  <ChevronRightOutlinedIcon />
                  {/* </div> */}
                </div>
                {user && user?._id != ad?.user && !preview && (
                  <div className="message_row">
                    <input
                      // disabled={image}
                      value={inputText}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // handleSendMessage();
                          handleSend();
                          setInputText("");
                        }
                      }}
                      id="messageInput"
                      onChange={(e) => {
                        setInputText(e.target.value);
                      }}
                      // value={textMessage}
                      type="text"
                      placeholder="Type your message..."
                      className="message_input"
                    />
                    <button
                      onClick={() => {
                        if (chatLoading) return;
                        handleSend();
                        setInputText("");
                      }}
                      className="send_btn"
                    >
                      {!chatLoading && <SendIcon />}

                      {chatLoading && (
                        <AutorenewOutlinedIcon
                          sx={{
                            animation: "spin 1s linear infinite",
                            fontSize: "1.5rem",
                          }}
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="card">
                <div className="heading_row">
                  <LocationOnOutlinedIcon />
                  <p className="heading">Location</p>
                </div>
                <p>{ad?.location?.name}</p>
                <div className="map_container">
                  <GoogleMap
                    center={{
                      lat: lat,
                      lng: lng,
                    }}
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
                    {!ad?.showPreciseLocation && (
                      <Circle
                        center={{
                          lat: lat,
                          lng: lng,
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
                    {ad?.showPreciseLocation && (
                      <OverlayView
                        position={{
                          lat: lat,
                          lng: lng,
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div className="map_marker">
                          <img src={marker} alt="" />
                          {/* <img src={shadow} alt="" className="shadow" /> */}
                        </div>
                      </OverlayView>
                    )}
                  </GoogleMap>
                </div>
              </div>
              <div className="card">
                <div className="heading_row">
                  <LocalOfferOutlinedIcon />
                  <p className="heading">Tags</p>
                </div>
                <div className="tags_container">
                  {ad?.tags?.map((tag, i) => (
                    <div key={i} className="tag">
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              {preview && (
                <div className="card">
                  <div className="btns_row">
                    <Button
                      onClick={() => {
                        editId
                          ? navigate("/edit/" + ad._id)
                          : navigate("/post-ad");
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitAd}
                      disabled={adPostingLoading}
                    >
                      {editId ? "Update Ad" : "Post Ad"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Spinner>
      {paymentModal && (
        <Modal close={(e) => setPaymentModal(false)}>
          <PaymentElementMobile
            onPaymentSuccessful={onPaymentSuccessful}
            onPaymentFailed={onPaymentFailed}
            close={(e) => setPaymentModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

const getDate = (ad) => {
  try {
    let postedDate = `${new Date(ad?.createdAt).getDate()} ${
      monthNames[new Date(ad?.createdAt).getMonth()]
    } ${new Date(ad?.createdAt).getYear() + 1900}`;

    if (postedDate.toLowerCase().includes("nan"))
      throw new Error("Invalid date");
    return postedDate;
  } catch (error) {
    return `${new Date().getDate()} ${monthNames[new Date().getMonth()]} ${
      new Date().getYear() + 1900
    }`;
  }
};
