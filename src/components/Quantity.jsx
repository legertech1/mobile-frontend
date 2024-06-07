import React from "react";
import "./Quantity.css";

export default function Quantity({ value, onChange, disabled, className }) {
  const handleChange = (val) => {
    if (disabled) return;
    if (isNaN(val)) return;
    if (val < 0) return;
    if (val > 10000) return;

    onChange && onChange(val);
  };
  return (
    <div className="quantity_input">
      <button
        className="quantity_btn"
        onClick={() => {
          handleChange(Number(value) - 1);
        }}
      >
        -
      </button>
      <input
        type="number"
        className="quantity_input_field"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
      <button
        className="quantity_btn"
        onClick={() => {
          handleChange(Number(value) + 1);
        }}
      >
        +
      </button>
    </div>
  );
}
