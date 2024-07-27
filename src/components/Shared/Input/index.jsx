import React from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../Input/index.css";

export default function Input({
  placeholder,
  name,
  id,
  type,
  onChange,
  value,
  onKeyDown,
  maxLength,
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="input_container">
      <input
        placeholder={placeholder || ""}
        className="html-input"
        name={name || "name"}
        id={id || ""}
        type={show ? "text" : type || "text"}
        onChange={onChange || null}
        value={value}
        onKeyDown={onKeyDown || null}
        maxLength={maxLength}
      />
      {type === "password" && (
        <>
          {!show ? (
            <VisibilityOffIcon
              className="eye_icon"
              onClick={() => setShow(!show)}
            />
          ) : (
            <VisibilityIcon
              className="eye_icon"
              onClick={() => setShow(!show)}
            />
          )}
        </>
      )}
    </div>
  );
}
