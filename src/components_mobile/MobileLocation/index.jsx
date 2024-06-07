import React, { useEffect, useState } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import axios from "axios";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLocation } from "../../store/locationSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import { updatePlaces as setProvinces } from "../../store/placesSlice";
import apis from "../../services/api";
import parseAdressComponents from "../../utils/parseAdressComponents";
import MyAutocomplete from "../../components/Autocomplete";
import Loader from "../../components/Loader";
import { MAP_API_KEY } from "../../utils/constants";

export default function WebLocation({ close }) {
  const provinces = useSelector((state) => state.places);
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [map, setMap] = useState(null);
  const dispatch = useDispatch();
  const { selectedLocation, currentLocation } = useSelector(
    (state) => state.location
  );

  const [recentLocations, setRecentLocations] = useLocalStorage(
    "recentLocations",
    null
  );
  const [radius, _setRadius] = useState(selectedLocation?.radius);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (!selectedLocation || !show) return;
    //
    const tm = setTimeout(() => {
      //
      dispatch(setSelectedLocation({ ...selectedLocation, radius: radius }));
    }, 100);
    return () => clearTimeout(tm);
  }, [radius]);

  const getProvinces = async () => {
    try {
      setLoading(true);
      let provinces = await axios.get(apis.fetchProvinces);

      dispatch(setProvinces(provinces.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getCities = async (province) => {
    try {
      setLoading(true);
      let cities = await axios.get(
        apis.fetchCities +
          "/" +
          province?.components?.administrative_area_level_1.long_name
      );
      dispatch(
        setProvinces([
          ...provinces.map((p) =>
            p.place_id == province.place_id ? { ...p, cities: cities.data } : p
          ),
        ])
      );
      setProvince({ ...province, cities: cities.data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!provinces || !provinces.length) getProvinces();
  }, []);
  useEffect(() => {
    if (province && !province?.cities?.length) getCities(province);
  }, [province]);

  const handleScrollToCoordinates = (targetCoordinates) => {
    if (map) {
      const targetLatLng = {
        lat: targetCoordinates.lat,
        lng: targetCoordinates.long,
      };
      map.panTo(targetLatLng);
    }
  };
  useEffect(() => {
    if (selectedLocation)
      setTimeout(() => {
        setShow(true);
      }, 100);
    handleScrollToCoordinates(selectedLocation?.coordinates);
  }, [selectedLocation]);

  // useEffect(() => {
  //   if (!show) {
  //     const tm = setTimeout(() => {
  //       setShow(true);
  //     }, 100);

  //     return () => clearTimeout(tm);
  //   }
  // }, [show]);
  useEffect(() => {
    if (value) {
      let name = value.value.label;
      geocodeByAddress(value.value.description)
        .then((results) => {
          name = results[0].formatted_address;
          value.value.address_components = parseAdressComponents(
            results[0].address_components
          );
          return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
          let loc = {
            name: value.label || name,
            place_id: value.value.place_id,
            coordinates: {
              lat: lat,
              long: lng,
            },

            components: value.value.address_components,
          };

          dispatch(setSelectedLocation({ ...loc, radius: radius }));
          close();
        })
        .catch((err) => {});
    }
  }, [value]);

  return (
    <div className="mobile_location">
      <div className="selections">
        {" "}
        {/* <MyAutocomplete
          loc={selectedLocation?.name}
          value={value}
          setValue={setValue}
          // types={["locality", "administrative_area_level_1", "country"]}
        >
          {" "}
        </MyAutocomplete> */}
        <GooglePlacesAutocomplete
          autocompletionRequest={{
            componentRestrictions: {
              country: ["ca"],
            },
          }}
          apiKey={MAP_API_KEY}
          selectProps={{
            value,
            onChange: (e) => {
              setValue(e);
            },
            placeholder: "Enter your location...",
            styles: {
              control: (provided, state) => {
                return {
                  ...provided,
                  border: "none",
                  borderColor: state.isFocused ? "none" : "none",
                  boxShadow: "none",
                };
              },
            },
          }}
        />
        <div className="current_loc">
          <div>
            <MyLocationIcon className="curr_icon" />
          </div>
          <div
            className="text_box"
            onClick={() => {
              dispatch(
                setSelectedLocation({ ...currentLocation, radius: radius })
              );
              close();
            }}
          >
            <p>My Current Location</p>
            <p className="curr_loc_text">
              {currentLocation?.name ||
                "Please allow location access to use current location"}
            </p>
          </div>
          {/* <h4>Search Radius</h4> <input type="range" name="" id="" />
          <p>100km</p> */}
        </div>
        <div className="regions">
          {recentLocations && <h4 className="heading">Recent Locations</h4>}{" "}
          <div className="regions_container">
            {" "}
            <div className="region">
              {recentLocations &&
                recentLocations.map((recent) => (
                  <div
                    onClick={(e) => {
                      setShow(false);
                      dispatch(
                        setSelectedLocation({ ...recent, radius: radius })
                      );
                      close();
                    }}
                    key={recent.place_id}
                    className="recent"
                  >
                    <p className="region_text">
                      {" "}
                      {recent?.description ||
                        recent?.name ||
                        recent?.components?.locality?.long_name}
                    </p>
                    <KeyboardArrowRightOutlinedIcon className="arrow_icon" />
                  </div>
                ))}
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              {!province && provinces && (
                <div className="provinces">
                  <div className="choose_city">
                    <h4 className="heading">Choose Region</h4>
                    <p></p>
                  </div>
                  <div className="regions_container">
                    <div className="region">
                      {provinces?.map((item) => {
                        return (
                          <div
                            onClick={() => {
                              setProvince(item);
                            }}
                          >
                            <p className="region_text">{item.name}</p>
                            <KeyboardArrowRightOutlinedIcon className="arrow_icon" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {province && province.cities && (
                <div>
                  <div className="choose_city">
                    <h4 className="heading">Choose City</h4>
                    <p
                      className="change_province"
                      onClick={() => {
                        setProvince(null);
                      }}
                    >
                      Change Province
                    </p>
                  </div>
                  <div className="regions_container">
                    <div className="region">
                      {province?.cities?.map((item) => {
                        return (
                          <div
                            onClick={() => {
                              setShow(false);
                              dispatch(
                                setSelectedLocation({ ...item, radius: radius })
                              );
                              setProvince(null);
                              close();
                            }}
                          >
                            <p className="region_text">{item.name}</p>
                            <KeyboardArrowRightOutlinedIcon className="arrow_icon" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
