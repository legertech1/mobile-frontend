import React, { useState } from "react";
import "./index.css";
import Navbar from "../../components/Navbar";
import MyAccount from "./MyAccount";
import Footer from "../../components/Footer";

function Settings() {
  return (
    <>
      <div className="settings_container">
        <Navbar white={"true"}></Navbar>
        <div className="blob_2"></div>
        <div className="settings_main">
          <div className="row_cont">
            <div className="tab_content">
              <MyAccount />
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Settings;
