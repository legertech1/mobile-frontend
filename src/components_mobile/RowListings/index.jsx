import React from "react";
import RowListing from "../RowListing";
import Loader from "../Loader";
import "./index.css";

function RowListings({ listings, loading, endReached, infoText, actions, cb }) {
  if (!loading && Array.isArray(listings) && listings.length === 0) {
    return (
      <p className="info_text">
        {infoText ||
          "No Ad found. Try changing the filters or searching for something else."}
      </p>
    );
  }
  return (
    <>
      <div className="mobile_row_listings">
        {listings?.map((listing) => {
          return (
            <RowListing
              key={listing._id}
              listing={listing}
              actions={actions}
              cb={cb}
            />
          );
        })}
      </div>
      {loading && <Loader />}
      {endReached && (
        <div className="end-reached">
          <p className="info_text">You've reached the end of the listings.</p>
        </div>
      )}
    </>
  );
}

export default RowListings;
