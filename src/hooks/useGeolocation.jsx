import { useState, useEffect } from "react";

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestGeolocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude, accuracy });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    requestGeolocationPermission(); // Automatically request permission when the hook is first used.
  }, []);

  return { location, error, requestGeolocationPermission };
}

export default useGeolocation;
