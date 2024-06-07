import { useContext } from "react";
import { ConfirmDialogServiceContext } from "../services/confirmDialog";

const useConfirmDialog = () => {
  const confirmDialog = useContext(ConfirmDialogServiceContext);

  if (!confirmDialog) {
    throw new Error(
      "useConfirmDialog must be used within a ConfirmDialogServiceContext Provider"
    );
  }

  return confirmDialog;
};

export default useConfirmDialog;
