import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HelpCards from "./HelpCards";
import "./index.css";

function Help({ setTab }) {
  return (
    <div className="_help help_container">
      <div className="content help_contant">
        <HelpCards setTab={setTab} />
      </div>
    </div>
  );
}

export default Help;
