import React from "react";
import "../Button/index.css";

export default function Button({
  children,
  onClick,
  className = "btn_blue",
  disabled,
}) {
  return (
    <button
      className={`${className} ${disabled ? "disabled_btn" : ""}`}
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
      }}
      disabled={disabled || false}
    >
      {children}
    </button>
  );
}
