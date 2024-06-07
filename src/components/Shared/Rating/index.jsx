import React from "react";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import "./index.css";

function index() {
  return (
    <div className="_rating">
      <StarRoundedIcon />

      <StarRoundedIcon />
      <StarRoundedIcon />
      <StarRoundedIcon />

      <StarOutlineRoundedIcon />
    </div>
  );
}

export default index;
