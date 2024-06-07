import React from "react";
import "../TextArea/index.css";

export default function TextArea({
  placeholder,
  rows,
  onChange,
  value,
  label,
  required,
}) {
  return (
    <>
      {typeof label === "string" && (
        <label className="mobile_input_label">
          {label}
          {required && <span className="required">{` `}*</span>}

          {/* {required && <span className="required">*(Required)</span>} */}
        </label>
      )}
      <div className="html_textarea_mobile">
        <textarea
          placeholder={placeholder || "Placeholder"}
          rows={rows || 4}
          onChange={onChange}
          value={value || ""}
        />
      </div>
    </>
  );
}
