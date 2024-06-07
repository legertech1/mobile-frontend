import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import "./LocationBox.css";

export default function LocationBox({ showModal, fixed, white, location }) {
  return (
    <div
      className={"location_box" + (fixed || white ? " white" : "")}
      onClick={() => {
        showModal();
      }}
    >
      <div className="info">
        <LocationOnOutlinedIcon className="loc_icon" />
        <span className="location">
          {location?.name || "Select a location"}
        </span>
        <span className="radius">
          {" "}
          {location?.radius && (
            <>
              <hr />
              {location.radius} km
            </>
          )}
        </span>
      </div>
      <KeyboardArrowDownOutlinedIcon className="icon" />
    </div>
  );
}
