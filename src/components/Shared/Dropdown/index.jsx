import React, { useRef, useState, useEffect } from "react";
import Arrow from "@mui/icons-material/KeyboardArrowDown";
import "./index.css";
import Modal from "../../../components_mobile/Modal";
import ModalSelector from "../../../components_mobile/ModalSelector";

function Dropdown({
  array,
  setValue,
  value,
  error,
  icons,
  subtext,
  placeholder = "Select an option",
  heading = "Select an option",
}) {
  const options = useRef();
  const dropdownButton = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(array);

  function dropdownControl() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (isOpen && !dropdownButton.current.contains(event.target)) {
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

  useEffect(() => {
    if (isOpen) document.addEventListener("keypress", function () {});
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

  return (
    <div className={`_dropdown ${isOpen ? "active" : ""}`}>
      <div
        className={`selected ${isOpen ? "active" : ""}`}
        ref={dropdownButton}
        onClick={() => {
          dropdownControl();
        }}
      >
        <div>
          {subtext && <span className="subtext">{subtext}</span>}
          {icons &&
            icons[0] &&
            array.reduce((icon, item, index) => {
              if (item == value) return icons[index];
              else return icon;
            }, null)}
          {value?.text || value || placeholder}
        </div>

        <div className="arrow">
          <Arrow></Arrow>
        </div>
      </div>

      {isOpen && (
        <Modal heading={heading} close={() => setIsOpen(false)}>
          <ModalSelector
            items={array}
            state={value}
            setState={setValue}
            close={() => setIsOpen(false)}
          ></ModalSelector>
        </Modal>
      )}
    </div>
  );
}

export default Dropdown;
