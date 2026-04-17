import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { staticTimes } from "../../constants/dateAndTimeConstants";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import AddEvent from "../AddData/AddEvent";
import AddKanban from "../AddData/AddKanban";
import AddList from "../AddData/AddList";
import AddReminder from "../AddData/AddReminder";
import AddSticky from "../AddData/AddSticky";
import DayEvent from "../Events/DayEvent";
import Portal from "../Misc/Portal";
import AddTask from "../AddData/AddTask";
import Reminder from "../Reminders/Reminder";
import { eventIsAllDay } from "../../utils/helpers";
import {
  useModalActions,
  useModalState,
} from "../../context/ContextHooks/ModalContext";
import AddTimer from "../AddData/AddTimer";

const Modal = () => {
  const { events, preferences, reminders } = useContext(UserContext);
  const { string, dateObj, theDay, setSecondString } = useContext(DatesContext);
  const {
    addNewEvent,
    setAddNewEvent,
    type,
    setType,
    setAddEventWithStartEndTime,
    setEvent,
  } = useContext(InteractiveContext);

  const { closeModal } = useModalActions();
  const open = useModalState();

  const [dayEvents, setDayEvents] = useState([]);
  const [staticTimeHeight, setStaticTimeHeight] = useState(0);
  const [todaysReminders, setTodaysReminders] = useState([]);
  const [allDayEvents, setAllDayEvents] = useState([]);

  const staticTimesContainerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => {
      closeModal();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const remindersToday = reminders.filter(
      (reminder) =>
        new Date(reminder.time).toLocaleDateString() ===
        theDay.toLocaleDateString(),
    );
    setTodaysReminders(remindersToday);
  }, []);

  useEffect(() => {
    const eventsForDay = events.filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        if (currentDate.toLocaleDateString() === string) {
          return true;
        }
      }
      return false;
    });
    const eventsAllDay = eventsForDay.filter((e) => eventIsAllDay(e));
    setAllDayEvents(eventsAllDay);
  }, [theDay, events, string]);

  useEffect(() => {
    if (string === dateObj.toLocaleDateString()) {
      const todaysHours = dateObj.getHours();
      if (modalRef.current) {
        !addNewEvent
          ? modalRef.current.scrollTo(0, todaysHours * 240)
          : modalRef.current.scrollTo(0, 0);
      }
      addNewEvent && modalRef.current.scrollTo(0, 0);
    }
    const eventsForDay = events.filter((event) => {
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
          23,
    );
    if (string !== dateObj.toLocaleDateString() && timedEvents.length > 0) {
      const firstEventHour = new Date(
        timedEvents[0]?.start?.startTime,
      ).getHours();
      if (modalRef.current) {
        !addNewEvent
          ? modalRef.current.scrollTo(0, firstEventHour * 240)
          : modalRef.current.scrollTo(0, 0);
      }
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

  return open ? (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      exit={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`${
        preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      } z-[600] rounded-md shadow-lg shadow-purple-200 fixed top-0 bottom-0 right-0 w-full lg:w-[30%] overflow-y-auto scroll-smooth scrollbar-hide`}
      ref={modalRef}
    >
      {/* Backdrop */}
      <Portal>
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setAddNewEvent(false);
            closeModal();
            setType(null);
            setEvent(null);
          }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex z-[10]"
        ></motion.div>
      </Portal>

      {addNewEvent ? (
        <div>
          {type === "event" ? <AddEvent /> : null}
          {type === "reminder" ? <AddReminder /> : null}
          {type === "todo-list" ? (
            <AddList eventsForDay={[...dayEvents, ...allDayEvents]} />
          ) : null}
          {type === "kanban" ? <AddKanban /> : null}
          {type === "task" ? <AddTask /> : null}
          {type === "stickynote" ? <AddSticky /> : null}
          {type === "timer" ? <AddTimer /> : null}

          {/* To be added with time */}
          {/* {type === "appointment" ? <AddAppointment /> : null}
          {type === "group" ? <AddGroupEvent /> : null}
          {type === "project" ? <AddProject /> : null}
          {type === "custom" ? <AddCustom /> : null}
          {type === "habbit" ? <AddHabbits /> : null} */}
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0 p-4 h-[800vh]"
            ref={staticTimesContainerRef}
          >
            {staticTimes.map((timeObj, index) => (
              <div
                key={index}
                onClick={() => {
                  setAddEventWithStartEndTime({
                    start: timeObj,
                    end: staticTimes[index + 1],
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
                new Date(event.end.endTime),
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
            {todaysReminders.map((r) => {
              const top = fromTop(new Date(r.time));

              return (
                <Reminder
                  reminder={r}
                  styles={{ top: top, maxWidth: "70%", right: 0, left: "26%" }}
                />
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  ) : null;
};

export default Modal;
