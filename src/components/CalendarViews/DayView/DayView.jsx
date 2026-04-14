import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staticTimes } from "../../../constants/dateAndTimeConstants.js";
import { MdEventNote } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import DatesContext from "../../../context/DatesContext.jsx";
import InteractiveContext from "../../../context/InteractiveContext.jsx";
import UserContext from "../../../context/UserContext.jsx";
import { createPortal } from "react-dom";
import Reminder from "../../Reminders/Reminder.jsx";
import { useModalActions } from "../../../context/ContextHooks/ModalContext.jsx";
import EventCard from "../../Events/EventCard.jsx";

const DayView = ({ containerRef }) => {
  const { setEvent, setAddEventWithStartEndTime, setType, setAddNewEvent } =
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
        }
      }
    }
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
                className={`fixed bottom-6 right-[5%] lg:right-20 z-50 w-[90%] max-w-md p-4 rounded-2xl shadow-lg border
        ${
          preferences.darkMode
            ? "bg-[#1e1e1e]/90 border-gray-700 text-gray-100"
            : "bg-white/90 backdrop-blur-md border-gray-200 text-gray-900"
        }`}
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Create an event from
                </p>
                <p className="text-base font-semibold">
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {new Date(
                      `${theDay.toDateString()} ${findTime(times[0])}`,
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>{" "}
                  –{" "}
                  <span className="text-cyan-600 dark:text-cyan-400">
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
                  <span className="text-amber-600 dark:text-amber-400">
                    {new Date(theDay).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => createEvent()}
                    className="px-4 py-2 rounded-xl font-medium shadow-sm 
            bg-gradient-to-tr from-cyan-400 to-sky-500 text-white 
            hover:scale-105 transition"
                  >
                    Yes, Create
                  </button>
                  <button
                    onClick={() => setTimes([])}
                    className="px-4 py-2 rounded-xl font-medium shadow-sm 
            bg-gradient-to-tr from-rose-400 to-pink-500 text-white 
            hover:scale-105 transition"
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
      <div ref={dayViewContainer} className="text-sm min-h-[800vh] relative">
        {/* Timer */}
        {dateObj.toLocaleDateString() === theDay.toLocaleDateString() ? (
          <motion.div
            animate={{ top: `${height}px` }}
            transition={{ type: "tween", ease: "linear", duration: 0.25 }}
            className="absolute right-0 z-[200] translate-y-[-50%] pointer-events-none"
          >
            <div className="relative flex items-center justify-end">
              {/* Time label */}
              <div
                className={`
            absolute right-8 top-1/2 -translate-y-1/2
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

              {/* Line */}
              <div
                className={`
            absolute right-3 top-1/2 -translate-y-1/2
            h-[2px] w-20 rounded-full
            ${preferences.darkMode ? "bg-cyan-300/40" : "bg-cyan-500/35"}
          `}
              />

              {/* Dot */}
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
                {/* Glow ring */}
                <div
                  className={`
              absolute inset-0 rounded-full scale-[1.8]
              ${preferences.darkMode ? "bg-cyan-300/20" : "bg-cyan-400/20"}
            `}
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        <div>
          {/* Static Time Display On Side */}
          <div className="">
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
                      ? "#67e8f9"
                      : preferences.darkMode
                        ? "#222"
                        : "#fff"
                  }`,
                }}
                className={`${index === 0 ? "border-b border-t" : "border-b"} ${
                  times.includes(staticTime.string.trim())
                    ? "text-black"
                    : preferences.darkMode
                      ? "text-white"
                      : "text-black"
                }`}
              >
                <p className="text-[11px]">{staticTime.string}</p>
              </motion.div>
            ))}
          </div>

          {/* Events For The Day */}
          {todaysEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              styles={{
                height: `${calcDayEventHeight(
                  new Date(event.start.startTime),
                  new Date(event.end.endTime),
                )}px`,
                top: fromTop(new Date(event.start.startTime)),
              }}
            />
            // <div
            //   key={event.id}
            //   style={{
            //     height: `${calcDayEventHeight(
            //       new Date(event.start.startTime),
            //       new Date(event.end.endTime),
            //     )}px`,
            //     top: fromTop(new Date(event.start.startTime)),
            //   }}
            //   onClick={() => setEvent(event)}
            //   className="absolute right-5 left-20 p-3 rounded-2xl shadow-lg bg-white/70 backdrop-blur-sm border border-gray-200 transition hover:scale-[1.02] hover:shadow-xl cursor-pointer flex"
            // >
            //   {/* Colored accent bar */}
            //   <div className={`w-2 rounded-l-2xl ${event.color}`}></div>

            //   {/* Content */}
            //   <div className="flex-1 pl-3 flex flex-col justify-between">
            //     {/* Header */}
            //     <div className="flex justify-between items-center">
            //       <p className="font-semibold text-gray-800 truncate">
            //         {event.summary || event.title}
            //       </p>
            //       <div className="flex gap-2 text-gray-500 text-lg">
            //         {event.repeats?.repeat && (
            //           <FiRepeat className="hover:text-blue-500" />
            //         )}
            //         {event.reminders?.reminder && (
            //           <IoIosAlarm className="hover:text-red-500" />
            //         )}
            //         {event.location && (
            //           <MdLocationPin className="hover:text-green-500" />
            //         )}
            //         {event.title && (
            //           <MdEventNote className="hover:text-purple-500" />
            //         )}
            //       </div>
            //     </div>

            //     {/* Description */}
            //     {event.description && (
            //       <div className="mt-2 text-sm bg-gray-50/60 rounded-lg px-3 py-2 whitespace-pre-wrap text-gray-700 leading-relaxed">
            //         {event.description}
            //       </div>
            //     )}
            //   </div>
            // </div>
          ))}

          {/* Reminders for The Day */}
          {todaysReminders.map((reminder) => (
            <Reminder
              key={reminder.id}
              reminder={reminder}
              styles={{
                position: "abosulte",
                top: fromTop(new Date(reminder.time)),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
