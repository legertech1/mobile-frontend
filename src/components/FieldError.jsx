import React from "react";
import "./FieldError.css";

const FieldError = ({ error, visible }) => {
  return (
    <div
      className="field_error"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      {error}
    </div>
  );
};

export default FieldError;
