import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apis from "../services/api";

export function updateRecentLocations(location) {
  if (!location) return;
  let recents = JSON.parse(window.localStorage.getItem("recentLocations"));
  if (!recents) recents = [];
  recents = recents?.filter((r) => r?.name != location?.name);
  if (recents?.length > 2) recents.pop();

  window.localStorage.setItem(
    "recentLocations",
    JSON.stringify([location, ...recents])
  );
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }),
        (error) => {
          // alert(error.message);
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by your browser"));
    }
  });
}

export const fetchCurrentLocation = createAsyncThunk(
  "fetchCurrentLocation",
  async () => {
    try {
      const coordinates = await getLocation();
      if (!coordinates) {
        // alert(coordinates.message);
        throw new Error("");
      }
      let loc = await axios.get(apis.findMyLocation, {
        params: coordinates,
      });

      return { currentLocation: loc.data, selectedLocation: loc.data };
    } catch (error) {
      const res = await fetch("https://ipinfo.io/json");
      const data = await res.json();

      if (data.country == "US") {
        return {
          selectedLocation: {
            name: "United States",
            place_id: "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
            coordinates: {
              lat: 37.09024,
              long: -95.712891,
            },
            components: {
              country: {
                short_name: "US",
                long_name: "United States",
              },
            },
          },
          currentLocation: null,
        };
      } else {
        return {
          selectedLocation: {
            name: "Canada",
            place_id: "ChIJ2WrMN9MDDUsRpY9Doiq3aJk",
            coordinates: {
              lat: 56.130366,
              long: -106.346771,
            },
            components: {
              country: {
                short_name: "CA",
                long_name: "Canada",
              },
            },
          },
          currentLocation: null,
        };
      }
    }
  }
);

const locationSlice = createSlice({
  initialState: {
    selectedLocation: null,
    currentLocation: null,
  },
  name: "location",
  reducers: {
    setSelectedLocation: (state, action) => {
      updateRecentLocations(action.payload);
      return { ...state, selectedLocation: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentLocation.fulfilled, (state, action) => {
      if (!state.selectedLocation) {
        updateRecentLocations(action.payload.selectedLocation);
        return action.payload;
      } else
        return { ...state, currentLocation: action.payload.currentLocation };
    });
  },
});

export default locationSlice;
export const { setSelectedLocation } = locationSlice.actions;
