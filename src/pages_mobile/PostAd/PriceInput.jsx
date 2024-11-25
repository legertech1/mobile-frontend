import * as React from "react";
import "./PriceInput.css";
import { PriceOptions } from "../../utils/constants";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo } from "react";

export default function PriceInput({
  setPrice,
  price,
  onChangeTerm,
  term,
  style,
  state,
  installments,
  setInstallments,
  reset,
  type,
}) {
  const options = useMemo(() => {
    if (type == "Service") {
      return PriceOptions.filter((o) => o != "Year");
    } else if (type == "Rent") {
      return PriceOptions.filter((o) => o != "Hour");
    } else if (type == "Lease" || type == "Finance")
      return PriceOptions.filter((o) => o != "Hour" && o != "Day");
    return PriceOptions;
  }, [type]);
  const [country, setCountry] = useLocalStorage("country", null);
  return (
    <div className="_price_inp" style={style}>
      <div className="custom_price_input">
        <div aria-label="menu" className="symbol">
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
          onChange={setPrice}
          className="price_input_field"
          aria-label="search google maps"
          style={{ flexGrow: 4 }}
        />
        {state == "definite" && (
          <>
            {" "}
            <div
              style={{
                height: "28px",
                borderLeft: "1px solid #1113",
              }}
            ></div>
            <input
              style={{
                color: "#555",
                flexGrow: 3,
              }}
              value={installments}
              placeholder={"Installments"}
              onChange={setInstallments}
              className="price_input_field pricing"
              defaultValue={installments}
            />
          </>
        )}
      </div>
      {state !== "total" && (
        <div className="option_container">
          {options.map((option) => (
            <div
              onClick={() => onChangeTerm(option)}
              className={`price_option ${option === term && "option_selected"}`}
            >
              {option == "Day" ? "Daily" : option + "ly"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
