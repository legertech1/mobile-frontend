import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import ripple from "../../utils/ripple";
import {
  DeleteRounded,
  Edit,
  Favorite,
  FavoriteBorderRounded,
  FavoriteRounded,
  MoreHoriz,
  Pause,
  PinDropRounded,
  PlaceOutlined,
  PlayArrowRounded,
  Settings,
  SettingsBackupRestore,
} from "@mui/icons-material";
import haversine from "../../utils/haversineFormula";
import { useDispatch, useSelector } from "react-redux";
import { add, remove } from "../../utils/listingCardFunctions";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { Checkmark } from "@styled-icons/evaicons-solid/Checkmark";
import Ad from "../../pages_mobile/Ad";
import Config from "./Config";
import RelistAd from "../../pages_mobile/PostAd/RelistAd";
import { updateCart } from "../../store/cartSlice";
import { getBalance } from "../../store/balanceSlice";
import { me } from "../../store/authSlice";
import success from "../../assets/animatedIcons/successful.json";
import IconPlayer from "../../components/IconPlayer";
import { relistAd } from "../../store/adSlice";
import PaymentElement from "../../components/PaymentElement";
import useNotification from "../../hooks/useNotification";

function Listing({
  ad,
  setAds,
  empty,
  selected,
  setSelected,
  status,
  actions,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useNotification();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const [config, setConfig] = useState(false);
  const [relistModal, setRelistModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState();
  const [options, setOptions] = useState(false);
  const optRef = useRef();
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  function onPaymentSuccessful(token) {
    setPaymentSuccess(true);
    dispatch(relistAd({ id: ad._id, token }))
      .unwrap()
      .then((ad) => {
        dispatch(me());
        dispatch(getBalance());
        dispatch(updateCart({}));
      })
      .catch((err) => {});
  }
  useEffect(() => {
    user?.data?.wishlist?.includes(ad?._id)
      ? setWishlisted(true)
      : setWishlisted(false);
  }, [user]);
  function onPaymentFailed(error) {
    setPaymentModal(false);
    notification.error(error);
  }

  const distance = useMemo(() => {
    if (ad?.location && selectedLocation)
      return haversine(
        ad.location?.coordinates.lat,
        ad.location?.coordinates.long,
        selectedLocation.coordinates.lat,
        selectedLocation.coordinates.long
      ).toFixed(0);
    else return -1;
  }, []);

  return (
    <div
      className={
        "_listing" +
        (ad?.meta?.highlighted ? " highlighted" : "") +
        (empty ? " em" : "") +
        (selected ? " selected" : "")
      }
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={"overlay" + (options ? " white" : "")}
        id={ad?._id}
        onClick={(e) => {
          e.stopPropagation();
          ripple(e, {
            dur: 2,
            fast: true,
            cb: () => {
              setOptions(false);
              setOpen(true);
            },
          });
        }}
      ></div>
      <div className="badges">
        {(ad?.meta?.featured || ad?.meta?.highlighted) && (
          <span className="featured">
            {ad?.meta?.featured && "Featured"}
            {ad?.meta?.featured && ad?.meta?.highlighted && " & "}
            {ad?.meta?.highlighted && "Highlighted"}
          </span>
        )}
      </div>

      <div className={"image" + (empty ? " empty" : "")}>
        {empty && <div className="empty empty_img"></div>}

        {!empty && (
          <>
            <div
              className={
                "wishlist" +
                (wishlisted ? " active" : "") +
                (status && !selected ? " opt" : "")
              }
              onClick={(e) => {
                ripple(e);

                e.stopPropagation();
                if (selected) {
                  return setSelected((state) =>
                    state.filter((i) => i != ad._id)
                  );
                }
                if (status) {
                  if (!options) {
                    setTimeout(() => setOptions(false), 5000);
                  }
                  return setOptions(!options);
                }

                wishlisted
                  ? remove(ad, null, dispatch)
                  : add(ad, user, dispatch, navigate);
              }}
            >
              {!status && (!selected ? <Favorite /> : <Checkmark />)}
              {status && (!selected ? <MoreHoriz /> : <Checkmark />)}
            </div>
            <img
              src={ad?.thumbnails[0]}
              alt=""
              style={{ pointerEvents: "none" }}
            />
          </>
        )}
      </div>
      <div className="info">
        {status && (
          <div className={`status ${ad?.meta?.status}`}>
            {ad?.meta?.status}{" "}
          </div>
        )}
        <h3 className={"title" + (empty ? " empty" : "")}>{ad?.title}</h3>
        {ad?.meta.highlighted && (
          <p className="description">{ad.description}</p>
        )}
        <div className={"row" + (empty ? " empty" : "")}>
          {!empty && (
            <>
              {" "}
              <span>
                <PlaceOutlined />
                {ad?.location.name}
              </span>
            </>
          )}
        </div>
        <div className={"price_row" + (empty ? " empty" : "")}>
          {!empty &&
            (ad?.priceHidden ? (
              <p
                className="contact_for_price"
                style={{ fontWeight: "600", color: "var(--blue)", margin: "0" }}
              >
                Contact me for Prices
              </p>
            ) : (
              <>
                {" "}
                <span className="price">
                  {" "}
                  {ad?.price ? "$" + ad?.price : "Free"}
                </span>
                /{ad?.term}{" "}
                {ad?.tax != "none" && <span className="tax">+{ad?.tax}</span>}
                {distance <= 100 && distance > -1 && (
                  <span className="distance">~{distance} Km</span>
                )}
              </>
            ))}
        </div>
      </div>
      {status && options && (
        <div
          className="options"
          ref={optRef}
          onClick={(e) => setOptions(false)}
        >
          {ad?.meta?.status != "expired" && (
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    setConfig(true);
                  },
                })
              }
            >
              <Settings /> Settings
            </button>
          )}
          {ad?.meta?.status == "expired" && (
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    setRelistModal(true);
                  },
                })
              }
            >
              <SettingsBackupRestore /> Relist
            </button>
          )}
          {ad?.meta?.status == "active" && (
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    actions?.pause(ad._id, ad.listingID);
                  },
                })
              }
            >
              <Pause /> Pause
            </button>
          )}
          {ad?.meta?.status == "paused" && (
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    actions?.resume(ad._id, ad.listingID);
                  },
                })
              }
            >
              <PlayArrowRounded /> Resume
            </button>
          )}

          <button
            className="action"
            onClick={(e) =>
              ripple(e, {
                dur: 1,
                cb: () => {
                  navigate("/edit/" + ad._id);
                },
              })
            }
          >
            <Edit /> Edit
          </button>
          <button
            className="action _del"
            onClick={(e) =>
              ripple(e, {
                dur: 1,
                cb: () => {
                  actions?.delete(ad._id, ad.listingID);
                },
              })
            }
          >
            <DeleteRounded /> Delete
          </button>
        </div>
      )}
      {open && (
        <Modal
          heading={<span>{ad?.listingID}</span>}
          close={(e) => {
            setOpen(false);
          }}
          className={"ad"}
        >
          <Ad _id={ad?._id} />
        </Modal>
      )}
      {config && (
        <Modal
          className={"ad"}
          close={() => setConfig(false)}
          heading={"Ad settings"}
        >
          <Config listing={ad} setListings={setAds} />
        </Modal>
      )}
      {relistModal && (
        <Modal
          className={"ad"}
          heading={"Relist Ad"}
          close={() => {
            setRelistModal(false);
            if (!paymentModal) dispatch(updateCart({}));
          }}
        >
          <RelistAd
            ad={ad}
            close={() => {
              setRelistModal(false);
            }}
            setPaymentModal={setPaymentModal}
            onPaymentSuccessful={onPaymentSuccessful}
          />
        </Modal>
      )}

      {paymentModal && (
        <Modal
          close={(e) => setPaymentModal(false)}
          className={"payment"}
          heading={"Relist Ad"}
        >
          <PaymentElement
            onPaymentSuccessful={onPaymentSuccessful}
            onPaymentFailed={onPaymentFailed}
            close={(e) => {
              setPaymentModal(false);
              dispatch(updateCart({}));
            }}
            listing={ad}
            category={ad.meta?.category}
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
    </div>
  );
}

export default Listing;
