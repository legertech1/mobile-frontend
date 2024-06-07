import React from "react";
import "./index.css";

export default function DatePicker({ placeholder, onChange, value }) {
  const onBlur = (e) => {
    if (!e.target.value) {
      e.target.type = "text";
    }
  };

  return (
    <input
      placeholder={placeholder || "Select Date"}
      className="html_date_picker"
      type="date"
      onChange={onChange}
      value={value}
      // onFocus={(e) => (e.target.type = "date")}
      // onBlur={onBlur}
    />
  );
}
