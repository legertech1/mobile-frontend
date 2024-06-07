import React from "react";
import { useSelector } from "react-redux";
import haversine from "../../utils/haversineFormula";
import "./index.css";

export default function RadiusBadge({ location }) {
  const { selectedLocation } = useSelector((state) => state.location);
  return (
    <div className="info mobile_radius_badge">
      {location && selectedLocation && (
        <div className="distance">
          {haversine(
            location?.coordinates.lat,
            location?.coordinates.long,
            selectedLocation.coordinates.lat,
            selectedLocation.coordinates.long
          ).toFixed(0)}{" "}
          ~Km
        </div>
      )}
    </div>
  );
}
