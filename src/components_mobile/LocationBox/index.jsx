import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useSelector } from "react-redux";
import "./index.css";

export default function LocationBox({ showModal }) {
  const user = useSelector((state) => state?.auth);

  return (
    <div
      className="mobile_location_row"
      onClick={() => {
        showModal();
      }}
    >
      <div className="info">
        <LocationOnOutlinedIcon className="loc_icon" />
        <span className="location">
          {user?.location?.name || "Select a location"}
        </span>
      </div>
      <KeyboardArrowDownOutlinedIcon className="icon" />
    </div>
  );
}
