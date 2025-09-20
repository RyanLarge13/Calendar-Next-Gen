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
      className={`absolute p-2 z-[900] shadow-lg rounded-md min-h-[100px] max-h-40 overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
      onWheel={(e) => e.stopPropagation()}
    >
      <p
        className={`${
          preferences.darkMode
            ? "text-white bg-black"
            : "text-black bg-slate-100"
        } text-sm p-1 rounded-md mb-2 font-semibold`}
      >
        {formatTime(new Date(day))}
      </p>
      {eventsToRender && eventsToRender.length > 0 ? (
        eventsToRender.map((event) => (
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
      ) : (
        <p
          className={`text-xs p-1 ${
            preferences.darkMode ? "text-white" : "text-black"
          }`}
        >
          No Events Today
        </p>
      )}
      <div className="flex justify-start items-center gap-x-1">
        <button
          onClick={() => openModalAndSetType("event")}
          className={`${
            preferences.darkMode
              ? "rounded-md p-3"
              : "text-black rounded-md p-3"
          } text-sm hover:scale-[1.05] duration-200 bg-gradient-to-tr from-orange-300 to-amber-300`}
        >
          <BsFillCalendar2EventFill />
        </button>
        <button
          onClick={() => openModalAndSetType("reminder")}
          className={`${
            preferences.darkMode
              ? "rounded-md p-3"
              : "text-black rounded-md p-3"
          } text-sm hover:scale-[1.05] duration-200 bg-gradient-to-tr from-red-300 to-rose-300`}
        >
          <BsAlarmFill />
        </button>
        <button
          onClick={() => openModalAndSetType("task")}
          className={`${
            preferences.darkMode
              ? "rounded-md p-3"
              : "text-black rounded-md p-3"
          } text-sm hover:scale-[1.05] duration-200 bg-gradient-to-tr from-cyan-300 to-sky-300`}
        >
          <BsListTask />
        </button>
      </div>
    </motion.div>
  );
};

export default PopUpMonthViewWindow;
