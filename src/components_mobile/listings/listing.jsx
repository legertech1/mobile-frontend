import React, { useEffect, useState } from "react";
import "./index.css";
import ripple from "../../utils/ripple";
import {
  Favorite,
  FavoriteBorderRounded,
  FavoriteRounded,
  PinDropRounded,
  PlaceOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { add, remove } from "../../utils/listingCardFunctions";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { Checkmark } from "@styled-icons/evaicons-solid/Checkmark";
import Ad from "../../pages_mobile/Ad";

function Listing({ ad, setAds, empty, selected, setSelected, status }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  useEffect(() => {
    user?.data?.wishlist?.includes(ad?._id)
      ? setWishlisted(true)
      : setWishlisted(false);
  }, [user]);

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
    </div>
  );
}

export default Listing;
