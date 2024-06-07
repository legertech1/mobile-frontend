import React, { useRef } from "react";
import Arrow from "@mui/icons-material/KeyboardArrowDown";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import "./index.css";

function LocationDropdown({
  label,
  array,
  setValue,
  value,
  error,
  required,
  info,
  placeholder = "Select an option",
}) {
  const options = useRef();
  function dropdownControl() {
    options.current.classList.toggle("active");
  }
  function Option({ value, index }) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          dropdownControl();
          setValue(value);
        }}
        className="option"
      >
        {value?.text || value}
        <KeyboardArrowRightOutlinedIcon />
      </div>
    );
  }

  let text = value?.text || value || placeholder;

  return (
    <>
      {typeof label === "string" && (
        <label className="mobile_input_label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className="_location_dropdown_mobile">
        <div className="selected" onClick={dropdownControl}>
          <div className="init_cont">
            <LocationOnOutlinedIcon />
            <p>{text}</p>
          </div>
          <Arrow />
        </div>
        <div className="options" ref={options}>
          {array &&
            array.map((item, index) => (
              <>
                <Option value={item} index={index} key={index}>
                  {" "}
                </Option>{" "}
                <hr />
              </>
            ))}
          {(!array && error) || ""}
        </div>
      </div>
      {info && <p className="mobile_input_info">{info}</p>}
    </>
  );
}

export default LocationDropdown;
