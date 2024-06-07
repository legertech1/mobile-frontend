import React from "react";
import "../TextArea/index.css";

export default function TextArea({ placeholder, rows, onChange, value }) {
  return (
    <div className="html_textarea">
      <textarea
        placeholder={placeholder || "Placeholder"}
        rows={rows || 4}
        onChange={onChange}
        value={value || ""}
      />
    </div>
  );
}
