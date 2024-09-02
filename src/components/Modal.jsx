import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DayEvent from "./DayEvent";
import AddEvent from "./AddEvent";
import AddReminder from "./AddReminder";
import AddList from "./AddList";
import AddKanban from "./AddKanban";
import AddTask from "./AddTask";
import AddSticky from "./AddSticky";

const Modal = ({ allDayEvents }) => {
  const { events, holidays, preferences } = useContext(UserContext);
  const { string, setOpenModal, dateObj, setSecondString } =
    useContext(DatesContext);
  const {
    addNewEvent,
    setAddNewEvent,
    type,
    setType,
    setAddEventWithStartEndTime,
  } = useContext(InteractiveContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [staticTimeHeight, setStaticTimeHeight] = useState(0);

  const staticTimesContainerRef = useRef(null);
  const modalRef = useRef(0);

  useEffect(() => {
    if (string === dateObj.toLocaleDateString()) {
      const todaysHours = dateObj.getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, todaysHours * 237)
        : modalRef.current.scrollTo(0, 0);
    }
    addNewEvent && modalRef.current.scrollTo(0, 0);
    const eventsForDay = [...events, ...holidays].filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const diff = (endDate - startDate) / (24 * 60 * 60 * 1000);
      if (event.date === string && diff < 1) {
        return event;
      }
    });
    const timedEvents = eventsForDay.filter(
      (event) =>
        event.start.startTime !== null &&
        event.end.endTime !== null &&
        new Date(event.end.endTime).getHours() -
          new Date(event.start.startTime).getHours() <=
          23
    );
    if (string !== dateObj.toLocaleDateString() && timedEvents.length > 0) {
      const firstEventHour = new Date(
        timedEvents[0]?.start?.startTime
      ).getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, firstEventHour * 237)
        : modalRef.current.scrollTo(0, 0);
    }
    setDayEvents(timedEvents);
    return () => setSecondString("");
  }, [string, events, addNewEvent]);

  const getHeight = () => {
    if (staticTimeHeight !== 0) {
      return staticTimeHeight;
    }
    if (staticTimesContainerRef.current) {
      const height =
        staticTimesContainerRef.current.clientHeight / staticTimes.length;
      setStaticTimeHeight(height);
      return height;
    }
  };

  const calcDayEventHeight = (start, end) => {
    if (!start || !end) {
      return 500;
    } else {
      if (staticTimesContainerRef.current) {
        const duration = end.getTime() - start.getTime();
        const containerHeight = staticTimesContainerRef.current.clientHeight;
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
    if (staticTimesContainerRef.current) {
      const containerHeight = staticTimesContainerRef.current.clientHeight;
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => {
          setAddNewEvent(false);
          setOpenModal(false);
          setType(null);
        }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex z-[10]"
      ></motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        exit={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${
          preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
        } z-[600] rounded-md shadow-lg shadow-purple-200 fixed top-0 bottom-0 right-0 w-[65%] lg:w-[30%] overflow-y-auto scroll-smooth scrollbar-hide`}
        ref={modalRef}
      >
        {addNewEvent ? (
          <div className="mt-10 mx-2">
            {type === "event" && <AddEvent />}
            {type === "reminder" && <AddReminder />}
            {type === "todo-list" && (
              <AddList eventsForDay={[...dayEvents, ...allDayEvents]} />
            )}
            {type === "kanban" && <AddKanban />}
            {type === "task" && <AddTask />}
            {type === "stickynote" && <AddSticky />}
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 pl-2 h-[800vh]"
              ref={staticTimesContainerRef}
            >
              {staticTimes.map((timeObj, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAddEventWithStartEndTime({
                      start: timeObj.time,
                      end: null,
                    });
                    setType("event");
                    setAddNewEvent(true);
                  }}
                  style={{
                    fontSize: index % 2 === 0 ? "15px" : "10px",
                    height: `${getHeight()}px`,
                  }}
                  className={`${
                    index % 2 === 0 ? "after:w-[100%]" : "after:w-[70%]"
                  } relative cursor-pointer after:left-0 after:bottom-0 after:h-[1px] after:absolute after:bg-slate-200`}
                >
                  <p className="absolute top-0 left-0">{timeObj.string}</p>
                </div>
              ))}
            </div>
            <div className="w-full">
              {dayEvents.map((event) => {
                const height = calcDayEventHeight(
                  new Date(event.start.startTime),
                  new Date(event.end.endTime)
                );
                const top = fromTop(new Date(event.start.startTime));
                return (
                  <DayEvent
                    key={event.id}
                    dayEvent={event}
                    setDayEvents={setDayEvents}
                    height={height}
                    top={top}
                    thirtyMinuteHeight={staticTimeHeight}
                  />
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default Modal;
