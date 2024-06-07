import React from "react";
import "./CTA.css";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();
  return (
    <div className="cta">
      <div className="cta_main">
        <h1>BorrowBe's better when you're a member</h1>
        <p>
          See more relevant listings, find what you're looking for quicker, and
          more!{" "}
        </p>
      </div>
      <button className="btn_classic" onClick={() => navigate("/register")}>
        Sign Up for Free
      </button>
    </div>
  );
}

export default CTA;
