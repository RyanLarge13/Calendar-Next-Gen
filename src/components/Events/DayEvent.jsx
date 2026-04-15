import { motion, useDragControls } from "framer-motion";
import { useContext, useState } from "react";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import {
  MdEventAvailable,
  MdEventNote,
  MdEventRepeat,
  MdLocationPin,
} from "react-icons/md";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import { updateStartAndEndTimeOnEvent } from "../../utils/api.js";
import {
  formatDbText,
  setStateAndPushWindowState,
  tailwindBgToHex,
} from "../../utils/helpers.js";
import UserContext from "../../context/UserContext.jsx";

const DayEvent = ({
  dayEvent,
  setDayEvents,
  height,
  top,
  thirtyMinuteHeight,
  styleOverrides = {},
}) => {
  const { preferences } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);

  const [start, setStart] = useState(0);
  const [fromTop, setFromTop] = useState(top);

  const dragControls = useDragControls();

  const startDrag = (e) => {
    setStart(e.clientY);
    dragControls.start(e);
  };

  const updateTimeOnEvent = (amount) => {
    const token = localStorage.getItem("authToken");
    updateStartAndEndTimeOnEvent(dayEvent.id, amount, token)
      .then((res) => {
        const start = new Date(dayEvent.start.startTime);
        const end = new Date(dayEvent.end.endTime);
        const newStart = start.setMinutes(start.getMinutes() + amount * 30);
        const newEnd = end.setMinutes(start.getMinutes() + amount * 30);
        setDayEvents((prev) => {
          return prev.map((item) => {
            if (item.id === dayEvent.id) {
              return {
                ...item,
                startDate: newStart,
                start: { ...item.start, startTime: newStart },
                end: { ...item.end, endTime: newEnd },
              };
            } else {
              return item;
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkTime = (e) => {
    if (thirtyMinuteHeight !== 0) {
      const end = e.clientY;
      const diff = end - start;
      if (diff === 0) {
        return;
      }
      const amountInChange = Math.round(diff / thirtyMinuteHeight);
      const newTop = fromTop + (thirtyMinuteHeight * amountInChange - diff);
      setFromTop(newTop);
      if (amountInChange !== 0) {
        updateTimeOnEvent(amountInChange);
      }
    }
  };

  return (
    <motion.div
      key={dayEvent.id}
      drag="y"
      dragSnapToOrigin={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      onDragEnd={(e) => checkTime(e)}
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      style={{ height: height, top: fromTop, ...styleOverrides }}
      onTap={() => setStateAndPushWindowState(() => setEvent(dayEvent))}
      className={`
    group absolute cursor-pointer right-3 z-[120]
    w-[min(72%,420px)]
    rounded-3xl border shadow-sm overflow-hidden
    transition-all duration-200
    hover:shadow-md hover:z-[998]
    ${preferences.darkMode ? "bg-[#161616]/88 border-white/10" : "bg-white/92 border-black/10"}
    backdrop-blur-md
  `}
    >
      {/* Left accent rail */}
      <div
        className={`${dayEvent.color} absolute left-0 top-0 bottom-0 w-[10px]`}
      />

      <div className="h-full px-4 py-3 pl-5 flex flex-col">
        {/* Drag / header area */}
        <div
          onPointerDown={(e) => startDrag(e)}
          style={{ touchAction: "none" }}
          className="flex items-start justify-between gap-3"
        >
          <div className="min-w-0">
            <p
              className={`text-[10px] font-semibold tracking-wide ${
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              {dayEvent.kind || "Event"}
            </p>

            <h3 className="text-sm font-bold leading-tight truncate mt-1 cursor-pointer">
              {dayEvent.summary}
            </h3>
          </div>

          {/* Meta icons */}
          <div
            className={`
          flex items-center gap-1.5 flex-shrink-0
          ${preferences.darkMode ? "text-white/55" : "text-slate-500"}
        `}
          >
            {dayEvent.kind === "Event" && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <MdEventNote className="text-sm" />
              </span>
            )}

            {dayEvent.kind === "Reminder" && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <MdEventAvailable className="text-sm" />
              </span>
            )}

            {dayEvent.kind === "Repeat" && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <MdEventRepeat className="text-sm" />
              </span>
            )}

            {dayEvent.repeats.repeat && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <FiRepeat className="text-sm" />
              </span>
            )}

            {dayEvent.reminders.reminder && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <IoIosAlarm className="text-sm" />
              </span>
            )}

            {dayEvent.location && (
              <span
                className={`
              grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
              >
                <MdLocationPin className="text-sm" />
              </span>
            )}
          </div>
        </div>

        {/* Description / body */}
        <div
          className={`
        mt-3 flex-1 rounded-2xl border px-3 py-2 overflow-hidden
        ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
      `}
        >
          <div
            className={`
          text-xs leading-relaxed pr-1
          ${preferences.darkMode ? "text-white/75" : "text-slate-700"}
        `}
          >
            {formatDbText(dayEvent.description)
              .slice(0, 4)
              .map((text, index) => (
                <p key={index} className="truncate">
                  {text}
                </p>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayEvent;
