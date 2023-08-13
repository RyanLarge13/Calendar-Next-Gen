import { createContext, useState, useEffect } from "react";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [filters, setFilters] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [view, setView] = useState("month");
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [type, setType] = useState(null);
  const [listUpdate, setListUpdate] = useState([]);
  const [event, setEvent] = useState(null);
  const [showCategory, setShowCategory] = useState(null);

  return (
    <InteractiveContext.Provider
      value={{
        menu,
        showLogin,
        view,
        addNewEvent,
        type,
        showNotifs,
        listUpdate,
        event,
        filters,
        showCategory,
        setShowCategory,
        setFilters,
        setEvent,
        setListUpdate,
        setShowNotifs,
        setType,
        setAddNewEvent,
        setView,
        setMenu,
        setShowLogin,
      }}
    >
      {children}
    </InteractiveContext.Provider>
  );
};

export default InteractiveContext;
