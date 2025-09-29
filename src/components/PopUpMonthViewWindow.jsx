import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { formatDbText, formatTime } from "../utils/helpers";
import {
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListTask,
  BsFillPenFill,
} from "react-icons/bs";
import { BiAlarmSnooze, BiCalendarEvent } from "react-icons/bi";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import { MdOpenInNew } from "react-icons/md";

const PopUpMonthViewWindow = ({
  positions,
  remindersToRender,
  eventsToRender,
  day,
}) => {
  const { preferences } = useContext(UserContext);
  const { setString, setOpenModal, dateObj } = useContext(DatesContext);
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

  const openReminders = () => {};

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
        className={`text-sm font-semibold mb-3 px-4 py-2 w-fit rounded-lg
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
        <div className="grid grid-cols-2 gap-3 my-5">
          {remindersToRender.map((reminder) => (
            <motion.div
              key={reminder.id}
              className={`${
                new Date(reminder.time) < dateObj
                  ? "border-l-4 border-rose-400"
                  : new Date(reminder.time).toLocaleDateString() ===
                    dateObj.toLocaleDateString()
                  ? "border-l-4 border-amber-400"
                  : "border-l-4 border-cyan-400"
              } min-w-[200px] max-w-[200px] shadow-lg p-4 rounded-2xl text-gray-900`}
            >
              <div className="space-y-3">
                {/* Time + Title */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    {/* Date Row */}
                    {reminder.eventRefId ? (
                      <BiCalendarEvent className="text-xl text-gray-500" />
                    ) : (
                      <BiAlarmSnooze className="text-xl text-gray-500" />
                    )}
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(reminder.time).toLocaleTimeString("en-US", {
                        timeZoneName: "short",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex-1 p-3 bg-gray-50 rounded-xl shadow-inner cursor-pointer">
                    <p className="text-sm font-semibold">{reminder.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Events list */}
      {eventsToRender && eventsToRender.length > 0 ? (
        <div className="space-y-3 mt-3">
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
                  <div className="text-xs leading-snug text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    <p>{event.description}</p>
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
