import React, { useRef, useEffect, useState } from "react";
import Arrow from "@mui/icons-material/KeyboardArrowDown";
import "./index.css";

function Dropdown({
  label,
  array,
  setValue,
  value,
  error,
  icons,
  required,
  info,
  placeholder = "Select an option",
}) {
  const options = useRef();
  const dropdownButton = useRef();
  const [isOpen, setIsOpen] = useState(false);
  

  function dropdownControl() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        isOpen &&
        !options.current.contains(event.target) &&
        !dropdownButton.current.contains(event.target)
      ) {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  function Option({ value, index }) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          closeDropdown();
          setValue(value);
        }}
        className="option"
      >
        {icons && icons[index] && icons[index]}
        {value?.text || value}
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

      <div className="_dropdown_mobile">
        <div
          className="selected"
          ref={dropdownButton}
          onClick={dropdownControl}
        >
          <p>
            {icons &&
              icons[0] &&
              array.reduce((icon, item, index) => {
                if (item == value) return icons[index];
                else return icon;
              }, null)}
            {text}
          </p>
          <Arrow />
        </div>
        <div className={`options ${isOpen ? "active" : ""}`} ref={options}>
          {array &&
            array.map((item, index) => (
              <React.Fragment key={index}>
                <Option value={item} index={index} />
                <hr />
              </React.Fragment>
            ))}
          {(!array && error) || ""}
        </div>
      </div>
      {info && <p className="mobile_input_info">{info}</p>}
    </>
  );
}

export default Dropdown;
