import { motion } from "framer-motion";
import { useContext } from "react";
import { formatDbText } from "../utils/helpers";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const PopUpMonthViewWindow = ({ positions, eventsToRender, day }) => {
  const { preferences } = useContext(UserContext);
  const { setString, setOpenModal } = useContext(DatesContext);
  const { setMenu, setShowLogin, setAddNewEvent, setType } =
    useContext(InteractiveContext);

  const addEvent = () => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(day);
    setAddNewEvent(true);
    setType("event");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
        transform: "translate(-17vw, -17vh)",
      }}
      className={`absolute p-2 z-[900] shadow-lg rounded-md min-h-60 min-w-60 max-h-40 overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
    >
      {eventsToRender && eventsToRender.length > 0
        ? eventsToRender.map((event) => (
            <div
              key={event.id}
              className={`rounded-lg ${event.color} shadow-md p-2 my-2 w-40`}
            >
              <p className="text-sm font-semibold overflow-hidden">
                {event.summary}
              </p>
              <div>
                {formatDbText(event.description || "").map((text, index) => (
                  <p key={index} className="text-xs">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          ))
        : null}
      <button
        onClick={() => addEvent()}
        className={`${preferences.darkMode ? "text-white" : "text-black"}`}
      >
        Add event
      </button>
    </motion.div>
  );
};

export default PopUpMonthViewWindow;
