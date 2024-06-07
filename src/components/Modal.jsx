//portal any component into a modal

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Close from '@mui/icons-material/CloseRounded';
import "./Modal.css";

function Modal({ children, close, className, closeOutside = true }) {
  const closeOnOutsideClick = (e) => {
    if (e.target.className === "modal_overlay") {
      closeOutside && close();
    }
  };
  useEffect(() => {
  
    if (document.querySelectorAll(".modal_overlay").length > 1) return;
    document.querySelector("#root").style.filter = "blur(5px)";
    document.body.style.overflow = "hidden";
    document.addEventListener("click", closeOnOutsideClick, false);

    return () => {
      if (document.querySelectorAll(".modal_overlay").length > 1) return;
      document.removeEventListener("click", closeOnOutsideClick, false);

      document.querySelector("#root").style.filter = "unset";
      document.body.style.overflow = "scroll";
    };
  }, []);
  const escFunction = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
  return (
    <>
      {createPortal(
        <div className={"modal_overlay " + (className ? className : "")} onScroll={(e) => e.stopPropagation()}>
          <div className={"modal " + (className ? className : "")}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="close"
            >
              <Close />
            </button>
            {children}
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </>
  );
}

export default Modal;
