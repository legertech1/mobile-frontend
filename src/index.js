import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import NotificationService from "./services/notification";
import ConfirmDialogService from "./services/confirmDialog";
import { LoadScript } from "@react-google-maps/api";
import { BASE_URL, MAP_API_KEY, mapLibraries } from "./utils/constants";
import axios from "axios";
import apis from "./services/api";
import IconPlayer from "./components/IconPlayer";
import blackAnimatedLOGO from "./assets/animatedIcons/animated_black_LOGO.json";
import MobileApp from "./MobileApp";
function Root() {
  async function init() {
    await axios.get(apis.init);
  }
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(
    function (config) {
      // Modify request config to include the query parameter
      config.params = {
        ...config.params,
        country: JSON.parse(localStorage.country || JSON.stringify("")),
      };
      return config;
    }
    // function (error) {
    //   // Do something with request error
    //   return Promise.reject(error);
    // }
  );

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", function (event) {
      if (event.key === "logout" && event.newValue === "true") {
        localStorage.removeItem("logout");
        window.location.reload();
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <NotificationService>
        <ConfirmDialogService>
          <Provider store={store}>
            <LoadScript
              loadingElement={
                <div className="logo_loader">
                  <IconPlayer icon={blackAnimatedLOGO} />
                </div>
              }
              googleMapsApiKey={MAP_API_KEY}
              libraries={mapLibraries}
            >
              <MobileApp />
            </LoadScript>
          </Provider>
        </ConfirmDialogService>
      </NotificationService>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<Root />);
