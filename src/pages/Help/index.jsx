import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HelpCards from "./HelpCards";
import "./index.css";

function Help() {
  return (
    <>
      <div className="help_container">
        <Navbar white={"true"}></Navbar>
        <div className="bg_blob"></div>
        <div className="content">
          <HelpCards />
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Help;
