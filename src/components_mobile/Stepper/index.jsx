import React from "react";
import "./index.css";

export default function MobileStepper({ steps, current, onClick }) {
  let currentStep = steps[current - 1];
  return (
    <div className="mobile_steps">
      <div className="step">
        <div className="step_no">{current}</div>
        <div className="step_title">{currentStep.step}</div>
      </div>
    </div>
  );
}
