import { createContext, useState, useEffect } from "react";

const InteractiveContext = createContext({});

export const InteractiveProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [confirm, setConfirm] = useState({ show: false, func: null });
  const [view, setView] = useState("month");
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [type, setType] = useState(null);
  const [listUpdate, setListUpdate] = useState([]);
  const [event, setEvent] = useState(null);

  return (
    <InteractiveContext.Provider
      value={{
        menu,
        showLogin,
        confirm,
        view,
        addNewEvent,
        type,
        showNotifs,
        listUpdate,
        event,
        setEvent,
        setListUpdate,
        setShowNotifs,
        setType,
        setAddNewEvent,
        setView,
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
