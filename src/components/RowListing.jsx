import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CA from "../assets/images/CA.svg";
import US from "../assets/images/USA.svg";
import haversine from "../utils/haversineFormula";
import ListingsOptions from "./ListingsOptions";
import {
  add,
  remove,
  next,
  prev,
  hover,
  imageFallback,
} from "../utils/listingCardFunctions";
import { useLocalStorage } from "@uidotdev/usehooks";
import { PinDropOutlined } from "@mui/icons-material";
const countries = { CA, US };

function RowListing({ listing, actions, setListings, empty }) {
  const carousel = useRef();
  const nextBtn = useRef();
  const prevBtn = useRef();
  const ind = useRef();
  const dispatch = useDispatch();
  const [slide, setSlide] = useState(1);
  const user = useSelector((state) => state.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();
  const [country, setCountry] = useLocalStorage("country", null);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const curr = useRef();
  const distance =
    listing?.location && selectedLocation
      ? haversine(
          listing.location?.coordinates.lat,
          listing.location?.coordinates.long,
          selectedLocation.coordinates.lat,
          selectedLocation.coordinates.long
        ).toFixed(0)
      : -1;

  useEffect(() => {
    user?.data?.wishlist.includes(listing?._id)
      ? setWishlisted(true)
      : setWishlisted(false);
  }, [user]);

  useEffect(() => {
    const images = carousel.current.childNodes;
    const dots = ind.current.childNodes;
    Array.from(images).map((img, ind) => {
      img.style.transform = "translateX(" + (ind + 1 - slide) + "00%)";
    });
  }, [slide]);

  return (
    <div
      className={
        "row_listing" +
        (listing?.meta?.highlighted ? " highlighted" : "") +
        (empty ? " empty" : "")
      }
      onClick={() => {
        navigate("/listing/" + listing?._id);
      }}
    >
      <div
        className={"images_container" + (empty ? " empty" : " _")}
        onScroll={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        {listing?.thumbnails?.length > 1 && (
          <button
            className="carousel_button prev"
            ref={prevBtn}
            onClick={(e) => prev(listing, slide, setSlide, e)}
            style={slide < 2 ? { display: "none" } : {}}
          >
            <KeyboardArrowLeftIcon />
          </button>
        )}

        {listing?.thumbnails?.length > 1 && (
          <button
            className="carousel_button next"
            ref={nextBtn}
            onClick={(e) => next(listing, slide, setSlide, e)}
            style={
              slide >= listing?.thumbnails.length ? { display: "none" } : {}
            }
          >
            <KeyboardArrowRightIcon />
          </button>
        )}
        <div className="slides" ref={ind}>
          {listing?.thumbnails?.length > 1 &&
            listing?.thumbnails.map((img, i) => (
              <div className={"dot" + (i + 1 == slide ? " active" : "")}></div>
            ))}
        </div>

        {!actions && (
          <button
            className={"wishlist" + (wishlisted ? " active" : "")}
            onClick={(e) => {
              e.stopPropagation();
              wishlisted
                ? remove(listing, setListings, dispatch)
                : add(listing, user, dispatch, navigate);
            }}
          >
            <FavoriteIcon />
          </button>
        )}
        <div className="badges">
          {listing?.meta?.featured && listing?.meta?.highlighted && (
            <div className="featured">Highlighted & Featured</div>
          )}
          {listing?.meta?.featured && !listing?.meta?.highlighted && (
            <div className="featured"> Featured</div>
          )}
          {!listing?.meta?.featured && listing?.meta?.highlighted && (
            <div className="featured">Highlighted </div>
          )}
          {actions && (
            <div className={"status " + listing?.meta?.status}>
              {listing?.meta?.status}
            </div>
          )}
        </div>

        <div
          className="images"
          onScroll={(e) => e.preventDefault()}
          ref={carousel}
        >
          {listing?.thumbnails?.map((img, ind) => (
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

      <div className="main">
        <h1
          onClick={() => {
            navigate("/listing/" + listing?._id);
          }}
          className={empty ? " empty" : ""}
        >
          {listing?.title}
        </h1>
        <p
          className={empty ? "t" : ""}
          onClick={() => {
            navigate("/listing/" + listing?._id);
          }}
        >
          {empty && (
            <>
              <p className={empty ? " empty" : ""}></p>
              <p className={empty ? " empty" : ""}></p>
              <p className={empty ? " empty" : ""}></p>
            </>
          )}{" "}
          {listing?.description}
        </p>
        <div className={"info" + (empty ? " empty" : "")}>
          <span className="location">
            {!empty && <PinDropOutlined />}
            {listing?.location.name}
          </span>
          {distance <= 100 && distance > -1 && (
            <div className="distance">~{distance} Km Away</div>
          )}
        </div>
        <div className="price">
          <p className={empty ? " empty" : ""}>
            {!empty && (
              <>
                {" "}
                <span className="price_num">${listing?.price || "Free"}</span>/
                {listing?.term}
                {listing?.tax != "none" && (
                  <p className="tax">+{listing?.tax}</p>
                )}{" "}
                {listing?.meta?.country != country && (
                  <img
                    className="country_img_global"
                    src={countries[listing?.meta?.country]}
                    alt=""
                  />
                )}
              </>
            )}
          </p>

          <div className="buttons"></div>
        </div>
      </div>
      {actions && (
        <ListingsOptions
          listing={listing}
          setListings={setListings}
          noView={true}
        />
      )}
    </div>
  );
}

export default RowListing;
