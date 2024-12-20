import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Stepper.css";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ripple from "../utils/ripple";

const Stepper = ({ steps, current, onClick, onExit = (f) => f() }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  return (
    <div className="__stepp">
      <div className="stepper_container">
        {width > 400 && (
          <button
            className="step_circle back"
            onClick={(e) =>
              ripple(e, {
                dur: 1,
                cb: () => {
                  onExit(() => navigate("/"));
                },
              })
            }
          >
            <ArrowBack />
          </button>
        )}
        {steps.map((step, index) => (
          <div
            onClick={(e) => ripple(e, { dur: 1, cb: () => onClick(index + 1) })}
            className={"step_circle" + (index + 1 == current ? " active" : "")}
          >
            {index + 1}

            <div
              className={
                `step_title` + (index + 1 == current ? " visible" : "")
              }
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
