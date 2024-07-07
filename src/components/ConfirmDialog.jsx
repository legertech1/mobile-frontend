import React, { useState, useEffect } from "react";
import "./ConfirmDialog.css";
import Modal from "../components_mobile/Modal";
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

  return visible ? (
    <div className="_confirm">
      <Modal close={cancel} className={confirm} headerHidden={true}>
        <div className="confirm_dialog">
          <p className="message">{message}</p>
          <div className="buttons">
            <button className="cancel" onClick={cancel}>
              Cancel
            </button>
            <button onClick={confirm}>Confirm </button>
          </div>
        </div>
      </Modal>
    </div>
  ) : null;
};

export default ConfirmDialog;
