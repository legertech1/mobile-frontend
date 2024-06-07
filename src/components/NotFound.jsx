import React from "react";
import "./Spinner.css";
import { Link } from "@mui/material";

function NotFound({ loading, children, title }) {
  return (
    <div className="overlay-spinner-container">
      <div className="overlay-spinner">
        {/* <div className="spinner"></div> */}
        <div className="spinner-text">{title || "qwidnqwonjkqewb"}</div>
        <br />
        <div>
          <Link href="/">Go to home page</Link>
        </div>
      </div>
      {children}
    </div>
  );
}

export default NotFound;
