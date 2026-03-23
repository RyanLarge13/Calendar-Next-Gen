import { createContext, useContext, useState, useCallback } from "react";

const ModalStateContext = createContext(null);
const ModalActionsContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ModalActionsContext.Provider value={{ openModal, closeModal }}>
      <ModalStateContext.Provider value={open}>
        {children}
      </ModalStateContext.Provider>
    </ModalActionsContext.Provider>
  );
};

export const useModalState = () => {
  return useContext(ModalStateContext);
};

export const useModalActions = () => {
  return useContext(ModalActionsContext);
};
