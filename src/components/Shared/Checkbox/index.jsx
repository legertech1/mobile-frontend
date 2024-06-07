import React from "react";
import "./index.css";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

function Checkbox({ checked, setChecked }) {
  return (
    <div
      className={"_checkbox" + (checked ? " checked" : "")}
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
