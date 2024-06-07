import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Stepper.css";

const Stepper = ({ steps, current, onClick }) => {
  return (
    <div className="stepper_container">
      {steps.map((step, index) => (
        <div className="stepper" key={index}>
          <div
            onClick={() => onClick(index + 1)}
            className={`step_circle ${index + 1 === current ? "" : "disabled"}`}
          >
            {index + 1}
          </div>
          <div
            onClick={() => onClick(index + 1)}
            className={`step_title ${index + 1 === current ? "" : "disabled"}`}
          >
            {step.step}
          </div>
          {index + 1 !== steps.length && (
            <div
              className={`step_icon_cont ${
                index + 1 === current ? "" : "disabled"
              }`}
            >
              <NavigateNextIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
