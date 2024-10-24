import * as React from "react";
import "./PriceInput.css";
import { PriceOptions } from "../../utils/constants";
import { useLocalStorage } from "@uidotdev/usehooks";
import Dropdown from "../../components/Shared/Dropdown";

export default function PriceInput({
  price,
  setPrice,
  installments,
  setInstallments,
  setTerm,
  term,
  style,
  reset,
  state,
  setState,
  tax,
  setTax,
}) {
  const [country, setCountry] = useLocalStorage("country", null);
  return (
    <div className="_price_inp" style={style}>
      <div
        className="price_dropdowns"
        style={{
          display: "flex",
          gap: "8px",
          minWidth: "330px",
          flex: "1",
          maxWidth: "100%",
        }}
      >
        <Dropdown
          value={state}
          subtext={"Pricing type"}
          placeholder="Pricing type"
          heading="Pricing type"
          array={[
            "Indefinite payments",
            "Definite installments",
            "Total amount",
          ]}
          setValue={(v) => {
            setState(v);
            reset();
          }}
        />
        <Dropdown
          value={tax}
          subtext={"Tax"}
          placeholder="Added tax"
          heading="Added tax"
          array={["none", "GST", "HST", "TAX"]}
          setValue={(v) => setTax(v)}
        />
      </div>

      <div className="custom_price_input">
        <div style={{ padding: "10px" }} aria-label="menu" className="symbol">
          {country}$
        </div>
        <div
          style={{
            height: "20px",
            borderLeft: "1px solid #1113",
          }}
        ></div>
        <input
          style={{ minWidth: "260px" }}
          value={price}
          placeholder={"Amount"}
          onChange={setPrice}
          className="price_input_field pricing"
          defaultValue={price}
        />
      </div>
      {state == "Definite installments" && (
        <div className="custom_price_input">
          <input
            style={{ minWidth: "200px" }}
            style={{
              color: "#555",
            }}
            value={installments}
            placeholder={"Installments"}
            onChange={setInstallments}
            className="price_input_field pricing"
            defaultValue={installments}
          />
        </div>
      )}
      {state != "Total amount" && (
        <div className="option_container">
          {PriceOptions.map((option) => (
            <div
              onClick={() => setTerm(option)}
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
