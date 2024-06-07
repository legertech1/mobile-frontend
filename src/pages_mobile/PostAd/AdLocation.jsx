import React, { useEffect } from "react";
import {
  adLocationTypesExcluded,
  defaultMapProps,
  mapStyles,
} from "../../utils/constants";
import MyAutocomplete from "../../components/Autocomplete";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import parseAdressComponents from "../../utils/parseAdressComponents";
import Checkbox from "../../components_mobile/shared/Checkbox";
import { useSelector } from "react-redux";
import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import marker from "../../assets/images/marker.png";
import "./index.css";
import PremiumPackage from "./PremiumPackage";

export default function AdLocation({
  formData,
  handleFormData,
  categoryIndex,
}) {
  const { currentLocation } = useSelector((state) => state.location);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );

  let lat = formData?.location?.coordinates?.lat || defaultMapProps.center.lat;
  let lng = formData?.location?.coordinates?.long || defaultMapProps.center.lng;

  function getLocationData(value) {
    if (value) {
      geocodeByAddress(value.description || value.name).then(
        async (results) => {
          const { lat, lng } = await getLatLng(results[0]);
          let address_components = parseAdressComponents(
            results[0].address_components
          );

          let l = {
            formatted_address: results[0].formatted_address,
            types: results[0].types,
            name: value.description || value.name,
            place_id: value.place_id,
            coordinates: {
              lat: lat,
              long: lng,
            },
            components: address_components,
          };
          handleFormData("location", l);
        }
      );
    }
  }

  useEffect(() => {
    if (selectedLocation) {
      handleFormData("location", selectedLocation);
    }
  }, []);

  return (
    <div className="ad_location_card">
      <div>
        <PremiumPackage categoryIndex={categoryIndex} formData={formData} />
      </div>

      <>
        <div>
          <MyAutocomplete
            setValue={(e) => {
              getLocationData(e);
            }}
            loc={formData?.location?.name}
            excluded={adLocationTypesExcluded}
          ></MyAutocomplete>
        </div>
        <div className="current_loc">
          <MyLocationIcon className="curr_icon" />
          <div
            className="text_box"
            onClick={() => {
              handleFormData("location", currentLocation);
            }}
          >
            <p>Use Current Location</p>
            <p className="curr_loc_text">
              {currentLocation?.name ||
                "Please allow location access to use current location"}
            </p>
          </div>
        </div>
        <div className="map_container">
          <GoogleMap
            center={{
              lat: lat,
              lng: lng,
            }}
            zoom={defaultMapProps.zoom}
            mapContainerStyle={mapStyles}
            options={{
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              rotateControl: false,
              scaleControl: false,
            }}
          >
            {!formData?.showPreciseLocation && (
              <Circle
                center={{
                  lat: lat,
                  lng: lng,
                }}
                radius={2000} // in meters
                options={{
                  fillColor: "#2196f3", // fill color of the circle
                  fillOpacity: 0.4, // opacity of the fill
                  strokeColor: "#2196f3", // border color of the circle
                  strokeOpacity: 0.8, // opacity of the border
                  strokeWeight: 2, // border thickness
                }}
                // options={place.circle.options}
              />
            )}
            {formData?.showPreciseLocation && (
              <OverlayView
                position={{
                  lat: lat,
                  lng: lng,
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
        </div>
        <div className="location_option">
          <Checkbox
            checked={formData?.showPreciseLocation}
            setChecked={(v) => {
              handleFormData("showPreciseLocation", v);
            }}
          />{" "}
          Show my exact location on the map
        </div>
      </>
    </div>
  );
}
