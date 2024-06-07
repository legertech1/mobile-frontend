import React from "react";
import "./index.css";
import ripple from "../../utils/ripple";
function ModalSelector({ items, state, setState, close }) {
  return (
    <div className="_modal-selector">
      {items?.length
        ? items.map((i) => (
            <div
              className="option"
              onClick={(e) => {
                setState(i);
                ripple(e);
                setTimeout(close, 300);
              }}
            >
              {i.icon && <img src={i.icon} />}
              {i.name || i.value || i}
            </div>
          ))
        : "No data"}
    </div>
  );
}

export default ModalSelector;
