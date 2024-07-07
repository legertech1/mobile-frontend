// import HelpIcon from "../../assets/images/questionMark.png";
import React, { useState } from "react";
import "./index.css";
import { Help, HelpOutline, QuestionMarkRounded } from "@mui/icons-material";
import { QuestionMarkCircleOutline } from "@styled-icons/evaicons-outline/QuestionMarkCircleOutline";
import Modal from "../../components_mobile/Modal";
import { InformationCircle } from "@styled-icons/heroicons-outline/InformationCircle";

function Info({ info, heading }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="_info" onClick={(e) => setOpen(true)}>
        <QuestionMarkCircleOutline />
      </div>
      {open && (
        <Modal
          close={(e) => setOpen(false)}
          heading={
            <span>
              <InformationCircle
                style={{
                  color: "var(--blue)",
                  fill: "none",
                  strokeWidth: "2px",
                  stroke: "var(--blue)",
                }}
              />{" "}
              {heading}
            </span>
          }
        >
          <p className="_info_info">{info}</p>
        </Modal>
      )}
    </>
  );
}

export default Info;
