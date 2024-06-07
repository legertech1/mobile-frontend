import React from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./index.css";

export default function Input({
  onChange,
  disabled,
  value,
  label,
  className,
  type,
  required,
  info,
  searchIcon,
  ...rest
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="mobile_input">
      {typeof label === "string" && (
        <label className="mobile_input_label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="mobile_input_container">
        {searchIcon && <SearchOutlinedIcon className="search_icon" />}
        <input
          disabled={disabled ? true : false}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
          type={show ? "text" : type || "text"}
          className={`input ${className}`}
          value={value}
          {...rest}
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
      {info && <p className="mobile_input_info">{info}</p>}
    </div>
  );
}
