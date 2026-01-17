import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staticTimes } from "../constants.js";
import {
  MdEventAvailable,
  MdEventNote,
  MdEventRepeat,
  MdOpenInNew,
} from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext.jsx";
// import Reminder from "./Reminder.jsx";
import { createPortal } from "react-dom";
import { BiAlarmSnooze, BiCalendarEvent } from "react-icons/bi";
import { BsFillPenFill, BsAlarmFill } from "react-icons/bs";
import { formatTime } from "../utils/helpers";

const DayView = ({ todaysEvents, todaysReminders, containerRef }) => {
  const { setEvent, setAddEventWithStartEndTime, setType, setAddNewEvent } =
    useContext(InteractiveContext);
  const { theDay, dateObj, setOpenModal } = useContext(DatesContext);
  const { preferences, events } = useContext(UserContext);

  const [time, setTime] = useState(dateObj.toLocaleTimeString());
  const [height, setHeight] = useState(0);
  const [staticTimeHeight, setStaticTimeHeight] = useState(0);
  const [times, setTimes] = useState([]);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dayViewContainer = useRef(null);
  let interval;

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

  const openRelatedEvent = (eventRefId) => {
    const eventOfReminder =
      events.find((event) => event.id === eventRefId) || null;

    if (eventOfReminder !== null) {
      setEvent(eventOfReminder[0]);
    }
  };

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
          `${theDay.toDateString()} ${findTime(times[0])}`
        );
        const newSelection = new Date(
          `${theDay.toDateString()} ${findTime(staticString)}`
        );
        if (
          isNaN(currentSelection.getTime()) ||
          isNaN(newSelection.getTime())
        ) {
          console.error("Invalid Date:", currentSelection, newSelection);
          return;
        }
        const [earlierTime, laterTime] = [currentSelection, newSelection].sort(
          (a, b) => a - b
        );
        let timesArray = [];
        let startTime = new Date(earlierTime);
        while (startTime <= laterTime) {
          timesArray.push(
            startTime.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })
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
    setOpenModal(true);
    setTimes([]);
  };

  // const getColorReminder = (reminder) => {
  //   if (reminder.eventRef) {
  //     const eventAttached = events.filter((e) => e.id === reminder.eventRef)[0];
  //     if (!eventAttached) {
  //       return "bg-cyan-200";
  //     }
  //     return eventAttached.color;
  //   } else {
  //     return "bg-cyan-200";
  //   }
  // };

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
                      `${theDay.toDateString()} ${findTime(times[0])}`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>{" "}
                  –{" "}
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {new Date(
                      `${theDay.toDateString()} ${findTime(
                        times[times.length - 1]
                      )}`
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
            document.body
          )
        : null}

      {/* Day View Container */}
      <div ref={dayViewContainer} className="text-sm min-h-[800vh] relative">
        {/* Timer */}
        {dateObj.toLocaleDateString() === theDay.toLocaleDateString() ? (
          <motion.div
            animate={{ top: `${height}px` }}
            className="absolute right-0 z-[200] translate-y-[-50%]"
          >
            <div className="w-[20px] h-[20px] rounded-full shadow-md bg-cyan-300 after:w-20 after:h-[2px] after:bg-black after:absolute after:top-[50%] after:z-[-1] after:left-[-350%]">
              <p className="absolute px-1 shadow-md bg-white rounded-md left-[-375%] top-[-50%]">
                {time}
              </p>
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
            <div
              key={event.id}
              style={{
                height: `${calcDayEventHeight(
                  new Date(event.start.startTime),
                  new Date(event.end.endTime)
                )}px`,
                top: fromTop(new Date(event.start.startTime)),
              }}
              onClick={() => setEvent(event)}
              className="absolute right-5 left-20 p-3 rounded-2xl shadow-lg bg-white/70 backdrop-blur-sm border border-gray-200 transition hover:scale-[1.02] hover:shadow-xl cursor-pointer flex"
            >
              {/* Colored accent bar */}
              <div className={`w-2 rounded-l-2xl ${event.color}`}></div>

              {/* Content */}
              <div className="flex-1 pl-3 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 truncate">
                    {event.summary || event.title}
                  </p>
                  <div className="flex gap-2 text-gray-500 text-lg">
                    {event.repeats?.repeat && (
                      <FiRepeat className="hover:text-blue-500" />
                    )}
                    {event.reminders?.reminder && (
                      <IoIosAlarm className="hover:text-red-500" />
                    )}
                    {event.location && (
                      <MdLocationPin className="hover:text-green-500" />
                    )}
                    {event.title && (
                      <MdEventNote className="hover:text-purple-500" />
                    )}
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <div className="mt-2 text-sm bg-gray-50/60 rounded-lg px-3 py-2 whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Reminders for The Day */}
          {todaysReminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              style={{
                top: fromTop(new Date(reminder.time)),
              }}
              className={`${
                new Date(reminder.time) < dateObj
                  ? "border-l-4 border-rose-400"
                  : new Date(reminder.time).toLocaleDateString() ===
                    dateObj.toLocaleDateString()
                  ? "border-l-4 border-amber-400"
                  : "border-l-4 border-cyan-400"
              } absolute left-20 p-4 my-3 rounded-2xl text-gray-900`}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
