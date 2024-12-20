import React from "react";
import "./index.css";
import ripple from "../../utils/ripple";
import { KeyboardArrowDown } from "@mui/icons-material";
function ModalSelector({ items, state, setState, close }) {
  return (
    <div className="_modal-selector">
      {items?.length
        ? items.map((i, ind) => (
            <div
              key={ind}
              className="option"
              onClick={(e) => {
                ripple(e, {
                  cb: () => {
                    setState(i);
                    close();
                  },
                  fast: true,
                  dur: 2,
                });
              }}
            >
              {i.icon &&
                (typeof i.icon == "string" ? <img src={i.icon} /> : i.icon)}
              {i.name || i.text || i.value || i}
            </div>
          ))
        : "No data"}
    </div>
  );
}

export default ModalSelector;
