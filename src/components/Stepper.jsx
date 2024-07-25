import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Stepper.css";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ripple from "../utils/ripple";

const Stepper = ({ steps, current, onClick }) => {
  const navigate = useNavigate();
  return (
    <div className="__stepp">
      <div className="stepper_container">
        <button
          className="back"
          onClick={(e) => ripple(e, { dur: 1, cb: () => navigate("/") })}
        >
          <ArrowBack />
        </button>
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
