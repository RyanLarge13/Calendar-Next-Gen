import { motion } from "framer-motion";
import { useContext } from "react";
import { formatDbText, formatTime } from "../utils/helpers";
import {
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListTask,
} from "react-icons/bs";
import UserContext, { UserProvider } from "../context/UserContext";
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
      className={`absolute p-2 z-[900] shadow-lg rounded-md min-h-[100px] min-w-80 max-h-40 overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
    >
      <p
        className={`${
          preferences.darkMode
            ? "text-white bg-black"
            : "text-black bg-slate-100"
        } text-sm p-1 rounded-md mb-2`}
      >
        {formatTime(new Date(day))}
      </p>
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
