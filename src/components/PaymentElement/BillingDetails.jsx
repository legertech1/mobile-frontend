import React, { useState } from "react";
import Dropdown from "../Shared/Dropdown";
import Input from "../Shared/Input";
import useNotification from "../../hooks/useNotification";
import CheckBox from "../Shared/Checkbox";
import { useLocalStorage } from "@uidotdev/usehooks";
import { CANADA_PROVINCES, US_STATES } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import apis from "../../services/api";
import { me } from "../../store/authSlice";
import {
  ArticleOutlined,
  Close,
  DeleteForeverOutlined,
} from "@mui/icons-material";
function BillingDetails({ billing, setBilling }) {
  const [country, setCountry] = useLocalStorage("country", null);
  const user = useSelector((state) => state.auth);
  const [state, setState] = useState({
    line1: "",
    state: "",
    city: "",
    postal_code: "",
  });
  const dispatch = useDispatch();
  const notification = useNotification();
  const [save, setSave] = useState(false);
  async function useAddress() {
    if (!state.line1 || !state.city || !state.state || !state.postal_code)
      return notification.error("All fields are required");
    setBilling(state);
    if (save) {
      setSave(false);
      try {
        const res = await axios.post(apis.addBillingAddress, state);
        notification.success(res.data);
        dispatch(me());
      } catch (err) {
        notification.error(err.response?.data);
      }
    }
  }

  async function removeAddress(address) {
    try {
      const res = await axios.post(apis.removeBillingAddress, address);
      notification.success(res.data);
      dispatch(me());
    } catch (err) {
      notification.error(err.response?.data);
    }
  }
  return (
    <div className="billing_details">
      <h1>
        <ArticleOutlined />
        Billing Address
      </h1>
      {billing && (
        <div className="saved">
          <div>
            <p>
              {billing.line1}, {billing.city}, {billing.state}, {country} (
              {billing.postal_code})
            </p>
            <CheckBox
              checked={true}
              setChecked={(v) => !v && setBilling(null)}
            />
          </div>
        </div>
      )}
      {!billing && (
        <>
          {Boolean(user?.config?.billingAddresses[country].length || 0) && (
            <div className="saved">
              {user?.config?.billingAddresses[country]?.map((a) => (
                <div>
                  <p>
                    {a.line1}, {a.city}, {a.state}, {country} ({a.postal_code})
                  </p>
                  <span>
                    <CheckBox
                      checked={false}
                      setChecked={() => setBilling(a)}
                    />
                    <button className="del" onClick={() => removeAddress(a)}>
                      {" "}
                      <Close />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="add">
            <div className="line">
              <Input
                placeholder="Address line 1"
                value={state.line1}
                onChange={(e) => setState({ ...state, line1: e.target.value })}
              />
            </div>
            <div className="line">
              <Input
                type="text"
                placeholder="City"
                value={state.city}
                onChange={(e) => setState({ ...state, city: e.target.value })}
              />
              <Dropdown
                placeholder={country == "CA" ? "Province" : "State"}
                value={state.state}
                array={
                  country == "US"
                    ? US_STATES.map((v) => v.label)
                    : CANADA_PROVINCES.map((v) => v.label)
                }
                setValue={(v) => setState({ ...state, state: v })}
              />
              <Input
                placeholder={country == "CA" ? "Postal code" : "Zip code"}
                value={state.postal_code}
                onChange={(e) =>
                  setState({ ...state, postal_code: e.target.value })
                }
              />
            </div>
            <div className="line">
              <p className="save_for_later">
                Save for later{" "}
                <CheckBox checked={save} setChecked={(v) => setSave(v)} />
              </p>
              <button className="btn_blue_m" onClick={useAddress}>
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BillingDetails;
