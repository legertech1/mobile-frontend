// ConfirmDialogService.js
import React, { useState, useRef } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import { createPortal } from "react-dom";

const ConfirmDialogServiceContext = React.createContext();

const ConfirmDialogService = ({ children }) => {
  const [dialog, setDialog] = useState([]);
  const dialogRef = useRef();

  const openDialog = (message, onConfirm, onCancel) => {
    const key = new Date().getTime();

    const closeDialog = () => {
      setDialog((prevDialogs) => prevDialogs.filter((d) => d.key !== key));
    };

    const dialogComponent = (
      <ConfirmDialog
        key={key}
        message={message}
        onConfirm={() => {
          closeDialog();
          onConfirm && onConfirm();
        }}
        onCancel={() => {
          closeDialog();
          onCancel && onCancel();
        }}
        onClose={closeDialog}
      />
    );

    setDialog((prevDialogs) => [...prevDialogs, dialogComponent]);
  };

  return (
    <>
      {" "}
      <ConfirmDialogServiceContext.Provider value={{ openDialog }}>
        {children}
        {createPortal(
          <div className="confirm-dialogs-container" ref={dialogRef}>
            {dialog}
          </div>,
          document.getElementById("portal")
        )}
      </ConfirmDialogServiceContext.Provider>
    </>
  );
};

export { ConfirmDialogService as default, ConfirmDialogServiceContext };
