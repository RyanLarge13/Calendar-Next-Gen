import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { formatDbText, formatTime } from "../utils/helpers";
import {
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListTask,
} from "react-icons/bs";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const PopUpMonthViewWindow = ({
  positions,
  remindersToRender,
  eventsToRender,
  day,
}) => {
  const { preferences } = useContext(UserContext);
  const { setString, setOpenModal } = useContext(DatesContext);
  const { setMenu, setShowLogin, setAddNewEvent, setType, setEvent } =
    useContext(InteractiveContext);

  useEffect(() => {
    console.log(positions);
  }, []);

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        top: `${positions.y - 200}px`,
        left: `${positions.x - 400}px`,
      }}
      className={`absolute p-4 z-[900] rounded-2xl min-h-[120px] max-h-80 overflow-y-auto scrollbar-hide shadow-xl border
        ${
          preferences.darkMode
            ? "bg-[#1e1e1e] border-gray-700 text-gray-100"
            : "bg-white/90 backdrop-blur-md border-gray-200 text-gray-900"
        }`}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Date heading */}
      <p
        className={`text-sm font-semibold mb-3 px-3 py-1 w-fit rounded-lg
          ${
            preferences.darkMode
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
      >
        {new Date(day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        - {formatTime(new Date(day))}
      </p>

      {/* Reminder Grid */}
      {remindersToRender && remindersToRender.length > 0 ? (
        <div className="grid grid-cols-2 gap-1 mb-3">
          {remindersToRender.map((r) => (
            <div className="flex w-full aspect-square rounded-xl shadow-sm border overflow-hidden transition hover:shadow-md cursor-pointer">
              <p className="text-center text-xs">
                <BsAlarmFill />
              </p>
              <p className="text-sm font-semibold text-amber-500 truncate whitespace-pre-wrap mt-1">
                {r.title}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Events list */}
      {eventsToRender && eventsToRender.length > 0 ? (
        <div className="space-y-3">
          {eventsToRender.map((event) => {
            const start = new Date(event.start.startTime);
            const end = new Date(event.end.endTime);

            return (
              <div
                key={event.id}
                onClick={() => setEvent(event)}
                className="flex rounded-xl shadow-sm border transition hover:shadow-md cursor-pointer"
              >
                {/* Accent bar */}
                <div className={`w-2 rounded-l-xl ${event.color}`}></div>

                {/* Event content */}
                <div className="flex-1 p-3">
                  <p className="text-sm font-semibold truncate">
                    {event.summary}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {start.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {end.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="text-xs leading-snug text-gray-700 dark:text-gray-300">
                    {formatDbText(event.description || "").map(
                      (text, index) => (
                        <p key={index}>{text}</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs italic text-gray-500">No Events Today</p>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => openModalAndSetType("event")}
          className="p-3 rounded-xl text-white shadow-md bg-gradient-to-tr from-orange-400 to-amber-400 hover:scale-105 transition"
          title="Add Event"
        >
          <BsFillCalendar2EventFill />
        </button>
        <button
          onClick={() => openModalAndSetType("reminder")}
          className="p-3 rounded-xl text-white shadow-md bg-gradient-to-tr from-rose-400 to-red-400 hover:scale-105 transition"
          title="Add Reminder"
        >
          <BsAlarmFill />
        </button>
        <button
          onClick={() => openModalAndSetType("task")}
          className="p-3 rounded-xl text-white shadow-md bg-gradient-to-tr from-sky-400 to-cyan-400 hover:scale-105 transition"
          title="Add Task"
        >
          <BsListTask />
        </button>
      </div>
    </motion.div>
  );
};

export default PopUpMonthViewWindow;
