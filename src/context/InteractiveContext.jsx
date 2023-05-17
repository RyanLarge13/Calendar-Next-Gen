import { createContext, useState } from "react";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  return (
    <InteractiveContext.Provider value={{
    	menu, setMenu
    }}>
      {children}
    </InteractiveContext.Provider>
  );
};

export default InteractiveContext;
