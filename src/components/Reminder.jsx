import React from "react";
import { motion } from "framer-motion";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const Reminder = (reminder) => {
  const { dateObj } = useContext(DatesContext);
  const { setEvent } = useContext(InteractiveContext);

  const openRelatedEvent = (eventRefId) => {
    const eventOfReminder =
      events.find((event) => event.id === eventRefId) || null;
    setEvent(eventOfReminder[0]);
  };

  return (
    <motion.div
      key={reminder.id}
      className={`${
        new Date(reminder.time) < dateObj
          ? "border-l-4 border-rose-400"
          : new Date(reminder.time).toLocaleDateString() ===
            dateObj.toLocaleDateString()
          ? "border-l-4 border-amber-400"
          : "border-l-4 border-cyan-400"
      } p-4 my-3 rounded-2xl relative text-gray-900`}
    >
      <div className="space-y-3">
        {/* Date Row */}
        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
          <p>
            {new Date(reminder.time).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {reminder.eventRefId ? (
            <BiCalendarEvent className="text-xl text-gray-500" />
          ) : (
            <BiAlarmSnooze className="text-xl text-gray-500" />
          )}
        </div>

        {/* Time + Title */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-700">
              @{" "}
              {new Date(reminder.time).toLocaleTimeString("en-US", {
                timeZoneName: "short",
              })}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BsAlarmFill className="text-gray-400" />
              <p>{formatTime(new Date(reminder.time))}</p>
            </div>
          </div>

          <div className="flex-1 p-3 bg-gray-50 rounded-xl shadow-inner cursor-pointer">
            <p className="text-base font-semibold">{reminder.title}</p>
          </div>
        </div>

        {/* Notes */}
        {reminder.notes && (
          <div className="p-3 bg-gray-50 rounded-xl shadow-inner flex justify-between items-start text-xs text-gray-600">
            <p className="whitespace-pre-wrap">{reminder.notes}</p>
            <BsFillPenFill className="text-gray-400 ml-2 shrink-0" />
          </div>
        )}

        {/* Open Event Button */}
        {reminder.eventRefId && (
          <button
            onClick={() => openRelatedEvent(reminder.eventRefId)}
            className="w-full px-4 py-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors duration-200"
          >
            Open Event
            <MdOpenInNew />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Reminder;
