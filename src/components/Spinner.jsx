import React from "react";
import "./Spinner.css";

function Spinner({ loading, children, title }) {
  return (
    <div className="overlay-spinner-container">
      {loading && (
        <div className="overlay-spinner">
          <div className="spinner"></div>
          <div className="spinner-text">{title || "qjwbuqwbuwqbou"}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export default Spinner;
