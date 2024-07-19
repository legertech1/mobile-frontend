import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Stepper.css";

const Stepper = ({ steps, current, onClick }) => {
  return (
    <div className="__stepp">
      <div className="stepper_container">
        {steps.map((step, index) => (
          <div
            onClick={() => onClick(index + 1)}
            className={"step_circle" + (index + 1 == current ? " active" : "")}
          >
            {index + 1}

            <div
              className={
                `step_title` + (index + 1 == current ? " visible" : "")
              }
            >
              {step.step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
