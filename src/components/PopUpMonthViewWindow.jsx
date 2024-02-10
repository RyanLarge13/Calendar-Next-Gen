import { motion } from "framer-motion";
import { useContext } from "react";
import { formatDbText } from "../utils/helpers";
import {
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListTask,
} from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const PopUpMonthViewWindow = ({ positions, eventsToRender, day }) => {
  const { preferences } = useContext(UserContext);
  const { setString, setOpenModal } = useContext(DatesContext);
  const { setMenu, setShowLogin, setAddNewEvent, setType } =
    useContext(InteractiveContext);

  const openModalAndSetType = (type) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(day);
    setAddNewEvent(true);
    setType(type);
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
      <Tooltip id="add-btn" />
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
      <div className="flex justify-start items-center gap-x-1">
        <button
          data-tooltip-id="add-btn"
          data-tooltip-content="add event"
          onClick={() => openModalAndSetType("event")}
          className={`${
            preferences.darkMode
              ? "text-white bg-black rounded-md p-3"
              : "text-black bg-slate-100 rounded-md p-3"
          } text-sm`}
        >
          <BsFillCalendar2EventFill />
        </button>
        <button
          data-tooltip-id="add-btn"
          data-tooltip-content="add reminder"
          onClick={() => openModalAndSetType("reminder")}
          className={`${
            preferences.darkMode
              ? "text-white bg-black rounded-md p-3"
              : "text-black bg-slate-100 rounded-md p-3"
          } text-sm`}
        >
          <BsAlarmFill />
        </button>
        <button
          data-tooltip-id="add-btn"
          data-tooltip-content="add tasks"
          onClick={() => openModalAndSetType("task")}
          className={`${
            preferences.darkMode
              ? "text-white bg-black rounded-md p-3"
              : "text-black bg-slate-100 rounded-md p-3"
          } text-sm`}
        >
          <BsListTask />
        </button>
      </div>
    </motion.div>
  );
};

export default PopUpMonthViewWindow;
