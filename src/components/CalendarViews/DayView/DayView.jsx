import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staticTimes } from "../../../constants/dateAndTimeConstants.js";
import DatesContext from "../../../context/DatesContext.jsx";
import InteractiveContext from "../../../context/InteractiveContext.jsx";
import UserContext from "../../../context/UserContext.jsx";
import { createPortal } from "react-dom";
import Reminder from "../../Reminders/Reminder.jsx";
import { useModalActions } from "../../../context/ContextHooks/ModalContext.jsx";
import DayEvent from "../../Events/DayEvent.jsx";

const DayView = ({ containerRef }) => {
  const { setAddEventWithStartEndTime, setType, setAddNewEvent } =
    useContext(InteractiveContext);
  const { theDay, dateObj } = useContext(DatesContext);
  const { preferences, eventMap, reminders } = useContext(UserContext);

  const { openModal } = useModalActions();

  const [time, setTime] = useState(dateObj.toLocaleTimeString());
  const [height, setHeight] = useState(0);
  const [staticTimeHeight, setStaticTimeHeight] = useState(0);
  const [times, setTimes] = useState([]);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysReminders, setTodaysReminders] = useState([]);

  const dayViewContainer = useRef(null);
  let interval;

  useEffect(() => {
    const remindersToday = reminders.filter(
      (reminder) =>
        new Date(reminder.time).toLocaleDateString() ===
        theDay.toLocaleDateString(),
    );
    setTodaysReminders(remindersToday);
  }, [theDay, reminders]);

  // Calculate quickly which events belong to this day view based on current viewing day
  useEffect(() => {
    const key = `${theDay.getFullYear()}-${theDay.getMonth()}`;
    if (eventMap.has(key)) {
      const events = eventMap.get(key).events || [];
      if (events.length > 0) {
        const eventsForDay = events.filter(
          (e) =>
            new Date(e.date).toLocaleDateString() ===
            theDay.toLocaleDateString(),
        );
        if (eventsForDay.length > 0) {
          setTodaysEvents(eventsForDay);
          return;
        }
      }
    }
    setTodaysEvents([]);
  }, [theDay, eventMap]);

  useEffect(() => {
    if (times.length > 1) {
      setIsSettingTime(true);
    } else {
      setIsSettingTime(false);
    }
  }, [times]);

  useEffect(() => {
    getTime();
    return () => clearInterval(interval);
  }, []);

  const calcDayEventHeight = (start, end) => {
    if (!start || !end) {
      return 500;
    } else {
      if (dayViewContainer.current) {
        const duration = end.getTime() - start.getTime();
        const containerHeight = dayViewContainer.current.clientHeight;
        const componentHeight =
          (duration / (24 * 60 * 60 * 1000)) * containerHeight;
        if (componentHeight <= 0) {
          return 500;
        }
        return componentHeight;
      }
    }
  };

  const fromTop = (startTime) => {
    if (dayViewContainer.current) {
      const containerHeight = dayViewContainer.current.clientHeight;
      const timeInSeconds =
        startTime.getHours() * 3600 +
        startTime.getMinutes() * 60 +
        startTime.getSeconds();
      const percentage = (timeInSeconds / (24 * 3600)) * 100;
      if (percentage <= 0) {
        return 0;
      }
      return (percentage * containerHeight) / 100;
    }
    return 0;
  };

  useEffect(() => {
    if (containerRef.current && !scrolled) {
      containerRef.current.scrollTo({ top: height, behavior: "smooth" });

      setTimeout(() => {
        setScrolled(true);
      }, 3000);
    }
  }, [height, scrolled]);

  const getTime = () => {
    interval = setInterval(() => {
      const now = new Date();
      const percentageOfDay =
        (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) /
        (24 * 3600);
      const containerHeight = dayViewContainer.current.clientHeight;
      const newPosition = Math.floor(percentageOfDay * containerHeight);
      setHeight(newPosition);
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  };

  const getHeight = () => {
    if (staticTimeHeight !== 0) {
      return staticTimeHeight;
    }
    if (dayViewContainer.current) {
      const height = dayViewContainer.current.clientHeight / staticTimes.length;
      setStaticTimeHeight(height);
      return height;
    }
  };

  const findTime = (aTime) => {
    for (let i = 0; i < staticTimes.length; i++) {
      if (staticTimes[i].string === aTime) {
        return staticTimes[i].time;
      }
    }
    return "00:00:00";
  };

  const checkToSetTime = (e, staticString) => {
    const end = e.clientX;
    if (end > window.innerWidth / 1.5) {
      if (times.length === 0) {
        return setTimes([staticString]);
      }
      if (times.includes(staticString)) {
        const index = times.indexOf(staticString);
        const newStrings = times.slice(0, index);
        return setTimes(newStrings);
      }
      if (times.length > 0) {
        const currentSelection = new Date(
          `${theDay.toDateString()} ${findTime(times[0])}`,
        );
        const newSelection = new Date(
          `${theDay.toDateString()} ${findTime(staticString)}`,
        );
        if (
          isNaN(currentSelection.getTime()) ||
          isNaN(newSelection.getTime())
        ) {
          console.error("Invalid Date:", currentSelection, newSelection);
          return;
        }
        const [earlierTime, laterTime] = [currentSelection, newSelection].sort(
          (a, b) => a - b,
        );
        let timesArray = [];
        let startTime = new Date(earlierTime);
        while (startTime <= laterTime) {
          timesArray.push(
            startTime.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
          );
          startTime.setMinutes(startTime.getMinutes() + 30);
        }
        return setTimes(timesArray);
      }
    }
  };

  const createEvent = () => {
    setAddEventWithStartEndTime({
      start: findTime(times[0]),
      end: findTime(times[times.length - 1]),
    });
    setType("event");
    setAddNewEvent(true);
    openModal();
    setTimes([]);
  };

  return (
    <div className="py-20">
      {/* Timer Setter */}
      {isSettingTime
        ? createPortal(
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`
              fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              w-[92vw] max-w-md p-4 rounded-3xl shadow-2xl border
              ${
                preferences.darkMode
                  ? "bg-[#161616]/90 border-white/10 text-white"
                  : "bg-white/90 border-black/10 text-slate-900"
              }
              backdrop-blur-md
            `}
              >
                <p
                  className={`text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Create Event
                </p>

                <p className="mt-2 text-sm font-semibold leading-relaxed">
                  <span
                    className={
                      preferences.darkMode ? "text-cyan-200" : "text-cyan-700"
                    }
                  >
                    {new Date(
                      `${theDay.toDateString()} ${findTime(times[0])}`,
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>{" "}
                  –{" "}
                  <span
                    className={
                      preferences.darkMode ? "text-cyan-200" : "text-cyan-700"
                    }
                  >
                    {new Date(
                      `${theDay.toDateString()} ${findTime(
                        times[times.length - 1],
                      )}`,
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>{" "}
                  on{" "}
                  <span
                    className={
                      preferences.darkMode ? "text-amber-200" : "text-amber-700"
                    }
                  >
                    {new Date(theDay).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => createEvent()}
                    className="px-4 py-2 rounded-2xl font-semibold shadow-sm bg-gradient-to-r from-cyan-500 to-cyan-400 text-white hover:shadow-md active:scale-[0.97] transition"
                  >
                    Yes, Create
                  </button>
                  <button
                    onClick={() => setTimes([])}
                    className={`
                  px-4 py-2 rounded-2xl font-semibold shadow-sm border transition active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-700 hover:bg-black/[0.06]"
                  }
                `}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}

      {/* Day View Container */}
      <div
        ref={dayViewContainer}
        className={`
      relative min-h-[800vh] rounded-3xl border shadow-sm overflow-hidden
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
      >
        {/* Layout shell */}
        <div className="grid grid-cols-[72px_1fr] min-h-[800vh]">
          {/* Left time rail */}
          <div
            className={`
          relative border-r
          ${preferences.darkMode ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-black/[0.02]"}
        `}
          >
            {staticTimes.map((staticTime, index) => (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0 }}
                dragSnapToOrigin={true}
                onDragEnd={(e) => checkToSetTime(e, staticTime.string.trim())}
                key={index}
                style={{ height: `${getHeight()}px` }}
                animate={{
                  backgroundColor: `${
                    times.includes(staticTime.string.trim())
                      ? preferences.darkMode
                        ? "rgba(34,211,238,0.18)"
                        : "rgba(34,211,238,0.16)"
                      : "transparent"
                  }`,
                }}
                className={`
              relative border-b px-2 pt-1
              ${
                preferences.darkMode
                  ? "border-white/10 text-white/60"
                  : "border-black/10 text-slate-500"
              }
            `}
              >
                <p className="text-[11px] font-semibold">{staticTime.string}</p>
              </motion.div>
            ))}
          </div>

          {/* Main timeline lane */}
          <div className="relative min-w-0">
            {/* Background time rows */}
            {staticTimes.map((staticTime, index) => (
              <div
                key={index}
                style={{ height: `${getHeight()}px` }}
                className={`
              relative border-b
              ${
                times.includes(staticTime.string.trim())
                  ? preferences.darkMode
                    ? "bg-cyan-500/10 border-white/10"
                    : "bg-cyan-50/70 border-black/10"
                  : preferences.darkMode
                    ? "border-white/10"
                    : "border-black/10"
              }
            `}
              >
                {/* subtle center guide */}
                <div
                  className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px ${
                    preferences.darkMode ? "bg-white/[0.04]" : "bg-black/[0.04]"
                  }`}
                />
              </div>
            ))}

            {/* Current time tracker */}
            {dateObj.toLocaleDateString() === theDay.toLocaleDateString() ? (
              <motion.div
                animate={{ top: `${height}px` }}
                transition={{ type: "tween", ease: "linear", duration: 0.25 }}
                className="absolute inset-x-0 z-[200] translate-y-[-50%] pointer-events-none"
              >
                <div className="relative flex items-center">
                  {/* line across timeline */}
                  <div
                    className={`
                  absolute left-0 right-0 h-[2px]
                  ${preferences.darkMode ? "bg-cyan-300/40" : "bg-cyan-500/35"}
                `}
                  />

                  {/* time chip */}
                  <div
                    className={`
                  absolute left-3 -top-4
                  px-2 py-1 rounded-2xl border shadow-sm text-[11px] font-semibold whitespace-nowrap
                  ${
                    preferences.darkMode
                      ? "bg-[#161616]/90 border-white/10 text-white/80"
                      : "bg-white/90 border-black/10 text-slate-700"
                  }
                  backdrop-blur-md
                `}
                  >
                    {time}
                  </div>

                  {/* dot */}
                  <div className="absolute right-3">
                    <div
                      className={`
                    relative h-5 w-5 rounded-full shadow-md
                    ${
                      preferences.darkMode
                        ? "bg-cyan-300 border border-cyan-100/30"
                        : "bg-cyan-400 border border-white"
                    }
                  `}
                    >
                      <div
                        className={`
                      absolute inset-0 rounded-full scale-[1.8]
                      ${preferences.darkMode ? "bg-cyan-300/20" : "bg-cyan-400/20"}
                    `}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Event lane */}
            {todaysEvents.map((event) => (
              <DayEvent
                key={event.id}
                dayEvent={event}
                setDayEvents={() => {}}
                height={`${calcDayEventHeight(
                  new Date(event.start.startTime),
                  new Date(event.end.endTime),
                )}px`}
                top={fromTop(new Date(event.start.startTime))}
                thirtyMinuteHeight={0}
                styleOverrides={{ left: 10 }}
              />
            ))}

            {/* Reminder lane */}
            {todaysReminders.map((reminder, i) => (
              <Reminder
                key={reminder.id}
                reminder={reminder}
                styles={{
                  position: "absolute",
                  top: `${fromTop(new Date(reminder.time))}px`,
                  right: `${12 + (i % 2) * 12}px`,
                  width: "min(280px, calc(100% - 24px))",
                  zIndex: 120 + i,
                  margin: 0,
                }}
                simpleView={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
