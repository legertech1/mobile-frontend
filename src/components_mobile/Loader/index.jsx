import React from "react";
import "./index.css";

export default function Index({ title }) {
  return (
    <div className="mobile_loader_container">
      <div className="loader"></div>
      <div className="loader_title">{title}</div>
    </div>
  );
}
