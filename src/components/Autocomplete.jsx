import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, AutocompleteService } from "@react-google-maps/api";
import "./Autocomplete.css";
import { adLocationTypesExcluded } from "../utils/constants";
import { setSelectedLocation } from "../store/locationSlice";
import { useDispatch } from "react-redux";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Close } from "@mui/icons-material";

const MyAutocomplete = ({
  value,
  setValue,
  types,
  children,
  excluded,
  loc,
  disabled = false,
  country = ["us", "ca"],
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [focus, setFocus] = useState(false);
  const [_country, setCountry] = useLocalStorage("country", null);
  useEffect(() => {
    setValue(null);
    setInputValue("");
  }, [_country]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.google) {
      setAutocomplete(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (autocomplete && value.trim() !== "") {
      autocomplete.getPlacePredictions(
        {
          input: value,
          componentRestrictions: {
            country: country,
          },
          types: types,
        },
        (results, status) => {
          if (status === "OK") {
            setPredictions(
              excluded
                ? results.filter((item) => {
                    for (let type of item.types) {
                      for (let _type of excluded) {
                        if (type == _type) {
                          return false;
                        }
                      }
                      return true;
                    }
                  })
                : results
            );
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSuggestionClick = (prediction) => {
    setInputValue(prediction.description);
    setValue(prediction);
  };

  useEffect(() => {
    if (value) setPredictions([]);
  }, [value]);

  useEffect(() => {
    setInputValue(loc);
  }, [loc]);
  return (
    <div className="_autocomplete" onClick={(e) => e.stopPropagation()}>
      {children}

      <input
        disabled={disabled ? true : false}
        type="text"
        placeholder="Enter location"
        value={
          loc ? inputValue : value?.description || value?.name || inputValue
        }
        onChange={handleInputChange}
        // onClick={(e) => e.stopPropagation()}
        onFocus={(e) => {
          setFocus(true);
          const listener = document.body.addEventListener("click", (e) => {
            setFocus(false);
            document.body.removeEventListener("click", listener);
          });
        }}
        // onBlur={(e) => setFocus(false)}
        onKeyDown={(e) => {
          if (e.key == "Enter" && !value && inputValue) {
            setValue(predictions[0]);
            setInputValue(predictions[0]?.description);
          }
        }}
      />
      {(inputValue || value) && (
        <button
          className="clear"
          onClick={() => {
            setValue(null);
            setInputValue("");
            setPredictions([]);
          }}
        >
          <Close />
        </button>
      )}
      {focus && (
        <ul onClick={(e) => setFocus(false)}>
          {predictions.map((prediction) => (
            <li
              onClick={(e) => {
                handleSuggestionClick(prediction);
              }}
              key={prediction.place_id}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAutocomplete;
