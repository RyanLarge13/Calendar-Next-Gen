import { createContext, useState } from "react";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [Confirm, setConfirm] = useState(false);

  return (
    <InteractiveContext.Provider
      value={{
        menu,
        showLogin,
        confirm, 
        setConfirm, 
        setMenu,
        setShowLogin,
      }}
    >
      {children}
    </InteractiveContext.Provider>
  );
};

export default InteractiveContext;
