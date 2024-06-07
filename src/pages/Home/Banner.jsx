import React from "react";
import "./Banner.css";
import phoneImg from "../../assets/images/phone.png";
import appStore from "../../assets/images/appStore.png";
import playStore from "../../assets/images/playStore.png";

function Banner() {
  return (
    <div className="banner">
      <div className="main">
        <h1> Lorem ipsum dolor sit amet, consectetur.</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio nulla
          asperiores eligendi inventore, animi odit temporibus?
        </p>
        <div className="buttons">
          <img src={appStore} alt="" />
          <img src={playStore} alt="" />
        </div>
      </div>
      <img src={phoneImg} alt="" />
    </div>
  );
}

export default Banner;
