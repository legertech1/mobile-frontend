//portal any component into a modal

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import { ArrowBack, CloseRounded } from "@mui/icons-material";
import ripple from "../../utils/ripple";

function Modal({
  children,
  close,
  className,
  closeOutside = true,
  heading,
  headerHidden,
}) {
  const closeOnOutsideClick = (e) => {
    if (e.target.className === "modal_overlay") {
      closeOutside && close();
    }
  };

  useEffect(() => {
    window.history.pushState({ page: "" }, "", window.location.href);
  }, []);

  const ref = useRef();
  const container = useRef();
  return (
    <>
      {createPortal(
        <div
          className={"modal_overlay " + (className ? className : "")}
          onScroll={(e) => e.stopPropagation()}
          ref={container}
        >
          <div
            className={"mobile_modal " + (className ? className : "")}
            ref={ref}
          >
            <button
              className="modal_close"
              style={{ display: "none" }}
              onClick={(e) => {
                e.stopPropagation();
                ref.current.classList.add("closing");
                container.current.classList.add("closing");

                setTimeout(() => close(), 200);
              }}
            ></button>
            {!headerHidden && (
              <div
                className="header"
                style={className == "gallery" ? { color: "white" } : {}}
              >
                {heading || <p></p>}{" "}
                <div
                  className="close"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (className == "ad") {
                      return ripple(e, {
                        dur: 1,
                        cb: () => {
                          ref.current.classList.add("closing");
                          container.current.classList.add("closing");
                          window.history.back();
                          // ripple(e, {
                          //   cb: () => {
                          //     close();
                          //   },
                          //   dur: 2,
                          // });

                          setTimeout(() => close(), 200);
                        },
                      });
                    }
                    ref.current.classList.add("closing");
                    container.current.classList.add("closing");
                    window.history.back();
                    // ripple(e, {
                    //   cb: () => {
                    //     close();
                    //   },
                    //   dur: 2,
                    // });

                    setTimeout(() => close(), 200);
                  }}
                >
                  {["ad", "gallery"].includes(className) ? (
                    <ArrowBack />
                  ) : (
                    <CloseRounded />
                  )}
                </div>
              </div>
            )}

            <div className="content"> {children}</div>
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </>
  );
}

export default Modal;
