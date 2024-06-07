import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import imgPlaceHolder from "../../assets/images/imagePlaceholder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import AdMenu from "../AdMenu";
import "./index.css";
import RadiusBadge from "../RadiusBadge";

export default function RowListing({ listing, actions, cb }) {
  const { thumbnails, title, price, description, term, _id, location, meta } =
    listing;
  const currUser = useSelector((state) => state.auth);

  const [wishlisted, setWishlisted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    currUser?.data?.wishlist?.includes(_id)
      ? setWishlisted(true)
      : setWishlisted(false);
  }, [currUser]);

  function add() {
    if (!currUser) return navigate("/login");
    dispatch(addToWishlist(_id));
    setWishlisted(true);
  }

  function remove() {
    if (!currUser) return navigate("/login");
    dispatch(removeFromWishlist(_id));
    setWishlisted(false);
  }

  const navigateTo = (e) => {
    e.stopPropagation();
    navigate(`/listing/${_id}`);
  };

  return (
    <div
      key={_id}
      onClick={(e) => {
        e.stopPropagation();
        navigateTo(e);
      }}
      className={"mobile_row_card" + (meta?.highlighted ? " highlighted" : "")}
    >
      <div className="image_cont">
        <img src={thumbnails[0] || imgPlaceHolder} className="image" alt="" />
        <button
          className={"wishlist" + (wishlisted ? " active" : "")}
          onClick={(e) => {
            e.stopPropagation();

            wishlisted ? remove() : add();
          }}
        >
          <FavoriteIcon />
        </button>
        <div className="status_cont">
          {actions && (
            <div className={"status " + listing?.meta?.status}>
              {listing?.meta?.status}
            </div>
          )}
        </div>

        <div className="badges">
          {meta?.featured && meta?.highlighted && (
            <div className="featured">Highlighted & Featured</div>
          )}
          {meta?.featured && !meta?.highlighted && (
            <div className="featured"> Featured</div>
          )}
          {!meta?.featured && meta?.highlighted && (
            <div className="featured">Highlighted </div>
          )}
        </div>
      </div>
      <div className="info_container">
        <div className="flexBox">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p className="title">{title}</p>
            {/* <span>i</span> */}
            <div
              style={{
                position: "relative",
                alignSelf: "flex-start",
              }}
            >
              {actions && <AdMenu adId={_id} cb={cb} listing={listing} />}
            </div>
          </div>

          {/* <div className="rating">
            <Rating></Rating> <span>(545)</span>
          </div> */}

          <p className="description2">{description}</p>
        </div>

        <div className="price_container">
          <span className="price">
            ${price}
            <span className="term">/{term}</span>
          </span>
          <RadiusBadge location={location} />
        </div>
      </div>
    </div>
  );
}
