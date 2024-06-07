import React from "react";
import "../Select/index.css";

export default function Select({
  options,
  placeholder,
  name,
  id,
  onChange,
  value,
}) {
  let opts = options || [];
  opts.unshift({
    label: placeholder,
    value: "select",
    disabled: true,
    selected: true,
    hidden: true,
  });
  return (
    <select
      placeholder={placeholder || "Placeholder"}
      className="html_select"
      name={name || "name"}
      id={id || ""}
      onChange={onChange}
      value={value || opts[0].value}
    >
      {opts.map((option) => (
        <option
          selected={option.selected ? true : false}
          hidden={option.hidden ? true : false}
          disabled={option.disabled ? true : false}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
