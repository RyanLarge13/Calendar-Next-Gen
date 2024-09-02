import { useEffect, useRef, useState, useContext } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants.js";
import { formatDbText } from "../utils/helpers.js";
import { MdEventAvailable, MdEventNote, MdEventRepeat } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext.jsx";

const DayView = ({ todaysEvents, todaysReminders, containerRef }) => {
  const { setEvent, setAddEventWithStartEndTime, setType, setAddNewEvent } =
    useContext(InteractiveContext);
  const { theDay, dateObj, setOpenModal } = useContext(DatesContext);
  const { preferences, events } = useContext(UserContext);

  const [time, setTime] = useState(dateObj.toLocaleTimeString());
  const [height, setHeight] = useState(0);
  const [staticTimeHeight, setStaticTimeHeight] = useState(0);
  const [combinedArray, setCombinedArray] = useState([]);
  const [times, setTimes] = useState([]);
  const [isSettingTime, setIsSettingTime] = useState(false);

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
    const combined = [...todaysEvents, ...todaysReminders];
    combined.sort((a, b) => {
      const dateA = new Date((a.start && a.start.startTime) || a.time);
      const dateB = new Date((b.start && b.start.startTime) || b.time);
      return dateA - dateB;
    });
    setCombinedArray(combined);
    if (theDay.toLocaleDateString() === dateObj.toLocaleDateString()) {
      getTime();
    }
    return () => clearInterval(interval);
  }, [todaysEvents, todaysReminders]);

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
    return containerRef.current.scrollTo({ top: height, behavior: "smooth" });
  }, [height]);

  const getTime = () => {
    interval = setInterval(() => {
      const percentageOfDay =
        (dateObj.getHours() * 3600 +
          dateObj.getMinutes() * 60 +
          dateObj.getSeconds()) /
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

  const getColorReminder = (reminder) => {
    if (reminder.eventRef) {
      const eventAttached = events.filter((e) => e.id === reminder.eventRef)[0];
      if (!eventAttached) {
        return "bg-cyan-200";
      }
      return eventAttached.color;
    } else {
      return "bg-cyan-200";
    }
  };

  return (
    <div className="py-20">
      {isSettingTime ? (
        <div className="sticky top-5 w-fit left-5 z-40 bg-white rounded-md shadow-md p-3">
          <p>Create an event from</p>
          <p>
            <span className="font-semibold">
              {new Date(
                `${theDay.toDateString()} ${findTime(times[0])}`
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {new Date(
                `${theDay.toDateString()} ${findTime(times[times.length - 1])}`
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>{" "}
            on{" "}
            {new Date(theDay).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => createEvent()}
              className="px-3 py-2 rounded-md bg-cyan-200 shadow-md"
            >
              Yes
            </button>
            <button
              onClick={() => setTimes([])}
              className="px-3 py-2 rounded-md bg-rose-200 shadow-md"
            >
              No
            </button>
          </div>
        </div>
      ) : null}
      <div ref={dayViewContainer} className="text-sm min-h-[800vh] relative">
        {dateObj.toLocaleDateString() === theDay.toLocaleDateString() ? (
          <motion.div
            animate={{ top: height }}
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
          {combinedArray.map((item) => (
            <div
              key={item.id}
              style={
                item.start
                  ? {
                      height: `${calcDayEventHeight(
                        new Date(item.start.startTime),
                        new Date(item.end.endTime)
                      )}px`,
                      top: fromTop(new Date(item.start.startTime)),
                    }
                  : {
                      top: fromTop(new Date(item.time)),
                    }
              }
              onClick={() => (item.start ? setEvent(item) : null)}
              className={`${item.color || getColorReminder(item)} ${
                item.start ? "z-[10]" : "z-[50]"
              } absolute right-5 p-2 rounded-md shadow-md left-20`}
            >
              <div className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-md">
                <p className="font-bold">{item.summary || item.title}</p>
                <div className="flex">
                  <p>
                    {(item?.kind === "Event" && <MdEventNote />) ||
                      (item?.kind === "Reminder" && <MdEventAvailable />) ||
                      (item?.kind === "Repeat" && <MdEventRepeat />)}
                  </p>
                  <p>{item?.repeats?.repeat && <FiRepeat />}</p>
                  <p>{item?.reminders?.reminder && <IoIosAlarm />}</p>
                  <p>{item?.location && <MdLocationPin />}</p>
                  <p>{item.title ? <IoIosAlarm /> : null}</p>
                </div>
              </div>
              <div className="mr-5 text-sm bg-white bg-opacity-30 rounded-md p-2 w-full mt-2">
                {formatDbText(item.description || item.notes || "").map(
                  (text, index) => (
                    <p key={index} className="text-[14px]">
                      {text}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
