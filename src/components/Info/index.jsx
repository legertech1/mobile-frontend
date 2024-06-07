import HelpIcon from "../../assets/images/questionMark.png";
import React from "react";
import "./index.css";

function Info({ info }) {
  return (
    <div className="_info">
      <img src={HelpIcon} />
      <p>{info}</p>
    </div>
  );
}

export default Info;
