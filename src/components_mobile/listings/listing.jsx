import React from "react";
import "./index.css";
import ripple from "../../utils/ripple";
import { PinDropRounded, PlaceOutlined } from "@mui/icons-material";

function Listing({ ad }) {
  return (
    <div
      className="_listing"
      onClick={(e) => {
        ripple(e);
        e.stopPropagation();
      }}
    >
      <div className="image">
        <img src={ad.thumbnails[0]} alt="" />
      </div>
      <div className="info">
        <h3 className="title">{ad.title}</h3>
        <div className="row">
          <PlaceOutlined />
          {ad.location.name}
        </div>
        <div className="price_row">
          <span className="price">${ad.price}</span>/{ad.term}
        </div>
      </div>
    </div>
  );
}

export default Listing;
