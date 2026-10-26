import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import {
  BsAlarmFill,
  BsFillCalendar2EventFill,
  BsListTask,
} from "react-icons/bs";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import Reminder from "../Reminders/Reminder";
import {
  formatRelativeTime,
  setStateAndPushWindowState,
} from "../../utils/helpers";
import { useModalActions } from "../../context/ContextHooks/ModalContext";

const PopUpMonthViewWindow = ({
  positions,
  remindersToRender,
  eventsToRender,
  day,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { preferences } = useContext(UserContext);
  const { setString } = useContext(DatesContext);
  const { setMenu, setShowLogin, setAddNewEvent, setType, setEvent } =
    useContext(InteractiveContext);

  const { openModal } = useModalActions();

  const openModalAndSetType = (type) => {
    setMenu(false);
    setShowLogin(false);
    openModal();
    setString(day);
    setAddNewEvent(true);
    setType(type);
  };

  const openReminders = () => {};
  // A portal avoids clipping by the swipe track. Anchor its edge directly to
  // the hovered cell, not to the mouse coordinates.
  const popupWidth = 400;
  const popupHeight = 320;
  const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 768 : window.innerHeight;
  const rightSpace = Math.max(0, viewportWidth - positions.right - 1);
  const leftSpace = Math.max(0, positions.left - 1);
  const placeRight = rightSpace >= popupWidth || rightSpace >= leftSpace;
  const availableWidth = placeRight ? rightSpace : leftSpace;
  const width = Math.max(1, Math.min(popupWidth, availableWidth));
  const left = placeRight ? positions.right + 1 : positions.left - width - 1;
  const maxHeight = Math.min(popupHeight, viewportHeight - 24);
  const top = Math.max(12, Math.min(positions.top, viewportHeight - maxHeight - 12));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${maxHeight}px`,
      }}
      className={`hidden md:block fixed p-4 z-[900] rounded-2xl min-h-[120px] max-h-80 overflow-y-auto scrollbar-hide shadow-xl border
        ${
          preferences.darkMode
            ? "bg-[#1e1e1e] border-gray-700 text-gray-100"
            : "bg-white/90 backdrop-blur-md border-gray-200 text-gray-900"
        }`}
      data-month-popup="true"
      onWheel={(e) => e.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
        - {formatRelativeTime(new Date(day))}
      </p>

      {/* Reminder Grid */}
      {remindersToRender && remindersToRender.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 my-5">
          {remindersToRender.map((reminder) => (
            <Reminder key={reminder.id} reminder={reminder} />
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
                onClick={(e) => {
                  e.stopPropagation();
                  setStateAndPushWindowState(() => setEvent(event));
                }}
                className="flex rounded-xl shadow-sm border transition hover:shadow-md cursor-pointer"
              >
                {/* Accent bar */}
                <div className={`w-2 rounded-l-xl ${event.color}`}></div>

                {/* Event content */}
                <div className="flex-1 p-3">
                  <p className="text-sm font-semibold truncate">
                    {event.summary}
                  </p>
                  {event.start.startTime && event.end.endTime ? (
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
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      All Day Event
                    </p>
                  )}
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
