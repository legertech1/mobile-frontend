import React from "react";
import "./index.css";

export default function Button({ disabled, children, ...rest }) {
  return (
    <button
      disabled={disabled ? true : false}
      {...rest}
      className={`mobile_btn ${rest.className} ${
        disabled ? "mobile_btn_disabled" : ""
      } `}
    >
      {children}
    </button>
  );
}
