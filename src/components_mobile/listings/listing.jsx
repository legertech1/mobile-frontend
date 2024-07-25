import React, { useEffect, useState } from "react";
import "./index.css";
import ripple from "../../utils/ripple";
import {
  Edit,
  Favorite,
  FavoriteBorderRounded,
  FavoriteRounded,
  PinDropRounded,
  PlaceOutlined,
  Settings,
  SettingsBackupRestore,
} from "@mui/icons-material";
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

function Listing({ ad, setAds, empty, selected, setSelected, status }) {
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
  return (
    <div
      className={
        "_listing" +
        (ad?.meta?.highlighted ? " highlighted" : "") +
        (empty ? " em" : "") +
        (selected ? " selected" : "")
      }
    >
      <div
        className={"overlay"}
        id={ad?._id}
        onClick={(e) => {
          e.stopPropagation();
          ripple(e, {
            dur: 2,
            fast: true,
            cb: () => {
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
              className={"wishlist" + (wishlisted ? " active" : "")}
              onClick={(e) => {
                ripple(e);
                e.stopPropagation();
                if (selected) {
                  console.log("...");
                  return setSelected((state) =>
                    state.filter((i) => i != ad._id)
                  );
                }

                wishlisted
                  ? remove(ad, null, dispatch)
                  : add(ad, user, dispatch, navigate);
              }}
            >
              {!selected ? <Favorite /> : <Checkmark />}
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
              <PlaceOutlined />
              {ad?.location.name}
            </>
          )}
        </div>
        <div className={"price_row" + (empty ? " empty" : "")}>
          {!empty && (
            <>
              {" "}
              <span className="price">${ad?.price}</span>/{ad?.term}
            </>
          )}
        </div>
      </div>
      {selected && (
        <div className="options">
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
