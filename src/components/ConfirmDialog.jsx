import React, { useState, useEffect } from "react";
import "./ConfirmDialog.css";
import { ErrorOutlineOutlined } from "@mui/icons-material";

const ConfirmDialog = ({ message, onConfirm, onCancel, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    return () => {
      setVisible(false);
    };
  }, []);

  const confirm = () => {
    setVisible(false);
    if (onConfirm) {
      onConfirm();
    }
    document.body.classList.remove("no-scroll");
  };

  const cancel = () => {
    setVisible(false);
    if (onCancel) {
      onCancel();
    }
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
      setVisible(false);
    };
  }, []);

  const closeDialog = () => {
    return;
    document.body.classList.remove("no-scroll");
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return visible ? (
    <div>
      <div className="confirm-dialog-container" onClick={closeDialog}>
        <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-message">
            {/* <ErrorOutlineOutlined /> */}
            {message}
          </div>
          <div className="button-container">
            <button className="btn_blue_m" onClick={cancel}>
              Cancel
            </button>
            <button className="btn_red_m" onClick={confirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmDialog;
