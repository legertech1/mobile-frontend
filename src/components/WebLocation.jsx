import React, { useEffect, useRef, useState } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Loader from "../components/Loader";
import { defaultMapProps } from "../utils/constants";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import axios from "axios";
import apis from "../services/api";
import "./WebLocation.css";
import MyAutocomplete from "./Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import parseAdressComponents from "../utils/parseAdressComponents";
import { setSelectedLocation, setRadius } from "../store/locationSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import marker from "../assets/images/marker.png";
import Checkbox from "./Shared/Checkbox";
import { updatePlaces as setProvinces } from "../store/placesSlice";

export default function WebLocation({ close }) {
  const provinces = useSelector((state) => state.places);
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const mapView = useRef();
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

  const [value, setValue] = useState(null);
  const geocoder = new window.google.maps.Geocoder();
  function mapClick(event) {
    //
    setShow(false);
    geocoder.geocode({ location: event.latLng }, async (results, status) => {
      if (status === "OK") {
        setShow(false);
        if (results[0]) {
          const { lat, lng } = await getLatLng(results[0]);
          // setShow(false);
          dispatch(
            setSelectedLocation({
              name: results[0].formatted_address,
              place_id: results[0].place_id,
              types: results[0].types,
              components: parseAdressComponents(results[0].address_components),

              coordinates: {
                lat: lat,
                long: lng,
              },
              radius: radius,
            })
          );
        } else {
        }
      } else {
      }
    });
  }

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

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
      let name = value.label;
      geocodeByAddress(value.description)
        .then((results) => {
          name = results[0].formatted_address;
          value.address_components = parseAdressComponents(
            results[0].address_components
          );
          return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
          let loc = {
            name: name,
            place_id: value.place_id,
            coordinates: {
              lat: lat,
              long: lng,
            },

            components: value.address_components,
          };

          dispatch(setSelectedLocation({ ...loc, radius: radius }));
          // close();
        });
    }
  }, [value]);

  const componentKeys = Object.keys(selectedLocation?.components || {});
  const isCity = componentKeys?.includes("locality");
  const isProvince =
    componentKeys?.includes("administrative_area_level_1") &&
    !componentKeys?.includes("locality");
  const isCountry = !componentKeys?.includes("administrative_area_level_1");

  return (
    <div className="web_location">
      <div className="selections">
        {" "}
        <MyAutocomplete
          loc={selectedLocation?.name}
          value={value}
          setValue={setValue}
          // types={["locality", "administrative_area_level_1", "country"]}
        >
          {" "}
        </MyAutocomplete>
        <div className="current_loc f">
          <div>
            <MyLocationIcon className="curr_icon" />
          </div>
          <div
            className="text_box"
            onClick={() => {
              if (!currentLocation) return;
              setShow(false);
              dispatch(
                setSelectedLocation({ ...currentLocation, radius: radius })
              );
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
            <div className="loader_cont">
              <Loader />
            </div>
          ) : (
            <>
              {!province && provinces && (
                <div className="provinces">
                  <div className="choose_prpvince">
                    <h4 className="heading">Choose Region</h4>
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
                      Change Province/State
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
                              // close();
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
        <div className="current_loc select_range">
          {selectedLocation?.components &&
            componentKeys.includes(
              "country" || "administrative_area_level_1" || "locality"
            ) && (
              <div className="search_by_address">
                <Checkbox
                  checked={!radius}
                  setChecked={(v) => {
                    v ? _setRadius(null) : _setRadius(50);
                  }}
                ></Checkbox>
                <p>
                  {" "}
                  Search All of{" "}
                  <span style={{ fontWeight: 600, color: "#444" }}>
                    {selectedLocation?.components?.locality?.long_name ||
                      selectedLocation?.components.administrative_area_level_1
                        ?.long_name ||
                      selectedLocation?.components.country?.long_name}
                  </span>
                </p>
              </div>
            )}
          {componentKeys.includes(
            "country" || "administrative_area_level_1" || "locality"
          ) && <div className="or">-or-</div>}
          <div>
            {" "}
            <h4>Search Radius</h4>{" "}
            <input
              type="range"
              value={radius || 0}
              onChange={(e) => _setRadius(e.target.value)}
              min={10}
              max={1000}
              name=""
              id=""
              disabled={!radius}
            />
            <p>{radius || "--"} km</p>
          </div>
        </div>
      </div>
      <div className="map" ref={mapView}>
        <GoogleMap
          onLoad={onLoad}
          onUnmount={onUnmount}
          center={
            {
              lat: selectedLocation?.coordinates?.lat,
              lng: selectedLocation?.coordinates?.long,
            } || defaultMapProps.center
          }
          zoom={
            radius
              ? Math.round(Math.log2(40075017 / (radius * 1000)) - 1)
              : isCountry
              ? 4
              : isProvince
              ? 6
              : isCity
              ? 10
              : 10 || 10
          }
          mapContainerStyle={{ height: "100%", width: "100%" }}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            scaleControl: false,
          }}
          onClick={mapClick}
        >
          {selectedLocation && (
            <Circle
              center={{
                lat: selectedLocation?.coordinates?.lat,
                lng: selectedLocation?.coordinates?.long,
              }}
              radius={show ? radius * 1000 || 0 : 0} // in meters
              options={{
                fillColor: "#2196f3", // fill color of the circle
                fillOpacity: 0.4, // opacity of the fill
                strokeColor: "#2196f3", // border color of the circle
                strokeOpacity: 0.8, // opacity of the border
                strokeWeight: 2,
                className: "CIRCLE",
                clickable: false,
              }}
              // options={place.circle.options}
            />
          )}
          {show && selectedLocation && (
            <OverlayView
              position={{
                lat: selectedLocation?.coordinates?.lat,
                lng: selectedLocation?.coordinates?.long,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="map_marker">
                <img src={marker} alt="" />
                {/* <img src={shadow} alt="" className="shadow" /> */}
              </div>
            </OverlayView>
          )}
        </GoogleMap>
        {/* <div className="search_radius"></div> */}
      </div>
    </div>
  );
}
