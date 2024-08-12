import * as React from "react";
import "./PriceInput.css";
import { PriceOptions } from "../../utils/constants";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function PriceInput({
  onChange,
  price,
  onChangeTerm,
  term,
  style,
}) {
  const [country, setCountry] = useLocalStorage("country", null);
  return (
    <div className="_price_inp" style={style}>
      <div className="custom_price_input">
        <div style={{ padding: "10px" }} aria-label="menu" className="symbol">
          {country}$
        </div>
        <div
          style={{
            height: "28px",
            borderLeft: "1px solid #ccc",
          }}
        ></div>
        <input
          value={price}
          placeholder={"Input price"}
          onChange={onChange}
          className="price_input_field"
          aria-label="search google maps"
        />
      </div>
      <div className="option_container">
        {PriceOptions.map((option) => (
          <div
            onClick={() => onChangeTerm(option)}
            className={`price_option ${option === term && "option_selected"}`}
          >
            Per {option}
          </div>
        ))}
      </div>
    </div>
  );
}
