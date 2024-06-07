import React from "react";
import Listing from "./listing";
import "./index.css";

function Listings({ ads }) {
  return (
    <div className="_listings">
      {Boolean(ads?.length) &&
        ads?.map((ad) => <Listing ad={ad} key={ad._id}></Listing>)}
    </div>
  );
}

export default Listings;
