import React from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import "./index.css";

function Checkbox({ checked, setChecked }) {
  return (
    <div
      className="mobile_checkbox"
      onClick={(e) => {
        e.stopPropagation();
        setChecked && setChecked(!checked);
      }}
    >
      {checked && (
        <div className="checked">
          <CheckOutlinedIcon></CheckOutlinedIcon>
        </div>
      )}
    </div>
  );
}

export default Checkbox;
