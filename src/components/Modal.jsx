import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { FaCalendarPlus } from "react-icons/fa";
import { staticTimes } from "../constants";
import DatesContext from "../context/DatesContext";
import DayEvent from "./DayEvent";
import AddEvent from "./AddEvent";
import CalendarEventTypeMenu from "./CalendarEventTypeMenu";
import Event from "./Event";
import UserContext from "../context/UserContext";
import ModalHeader from "./ModalHeader";
import AddReminder from "./AddReminder";
import AddList from "./AddList";
import AddKanban from "./AddKanban";
import AddTask from "./AddTask";

const Modal = () => {
  const { events, holidays } = useContext(UserContext);
  const { string, setOpenModal } = useContext(DatesContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [event, setEvent] = useState(null);
  const [type, setType] = useState("event");
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [addEventWithStartTime, setAddEventWithStartTime] = useState(null);
  const modalRef = useRef(0);

  useEffect(() => {
    if (string === new Date().toLocaleDateString()) {
      const todaysHours = new Date().getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, todaysHours * 240)
        : modalRef.current.scrollTo(0, 0);
    }
    addNewEvent && modalRef.current.scrollTo(0, 0);
    const eventsForDay = [...events, ...holidays].filter(
      (event) => new Date(event.date).toLocaleDateString() === string
    );
    const fullDayEvents = eventsForDay.filter(
      (event) =>
        new Date(event.end.endTime).getHours() -
          new Date(event.start.startTime).getHours() >=
          24 ||
        event.end.endTime === null ||
        event.start.startTime === null
    );
    const timedEvents = eventsForDay.filter(
      (event) =>
        event.start.startTime !== null &&
        event.end.endTime !== null &&
        new Date(event.end.endTime).getHours() -
          new Date(event.start.startTime).getHours() <=
          23
    );
    if (string !== new Date().toLocaleDateString() && timedEvents.length > 0) {
      const firstEventHour = new Date(
        timedEvents[0]?.start?.startTime
      ).getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, firstEventHour * 240)
        : modalRef.current.scrollTo(0, 0);
    }
    setDayEvents(timedEvents);
    setAllDayEvents(fullDayEvents);
  }, [string, events, addNewEvent]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setOpenModal(false)}
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex"
      ></motion.div>
      {addNewEvent && <CalendarEventTypeMenu type={type} setType={setType} />}
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        className={`bg-white rounded-md shadow-lg shadow-purple-200 px-2 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto scroll-smooth scrollbar-hide`}
        ref={modalRef}
      >
        <ModalHeader
          addEvent={addNewEvent}
          allDayEvents={allDayEvents}
          event={event}
          setEvent={setEvent}
        />
        {addNewEvent ? (
          <div className="mt-10">
            {type === "event" && (
              <AddEvent
                setAddNewEvent={setAddNewEvent}
                passedStartTime={addEventWithStartTime}
              />
            )}
            {type === "reminder" && <AddReminder />}
            {type === "todo-list" && <AddList />}
            {type === "kanban" && <AddKanban />}
            {type === "task" && <AddTask />}
          </div>
        ) : (
          <div className="w-full pl-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 pl-2 pt-[100px]">
              {staticTimes.map((timeObj, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setAddEventWithStartTime(timeObj.time);
                    setAddNewEvent(true);
                  }}
                  style={
                    index % 2 === 0
                      ? { fontSize: "15px" }
                      : { fontSize: "10px" }
                  }
                  className={`${index === 0 ? "mt-0" : "my-[100px]"} ${
                    index % 2 === 0 ? "after:w-[100%]" : "after:w-[70%]"
                  } relative after:left-0 after:bottom-0 after:h-[1px] after:absolute after:bg-slate-200`}
                >
                  {timeObj.string}
                </p>
              ))}
            </div>
            <div className="w-full">
              {dayEvents.map((event) => (
                <DayEvent key={event.id} event={event} setEvent={setEvent} />
              ))}
            </div>
            <motion.button
              initial={{ x: 100 }}
              animate={{ x: 0, transition: { delay: 1 } }}
              onClick={() => setAddNewEvent(true)}
              className="px-5 py-2 mt-5 fixed bottom-5 right-5 rounded-md shadow-md bg-gradient-to-r from-green-300 to-green-200 z-[999]"
            >
              <FaCalendarPlus />
            </motion.button>
          </div>
        )}
        {event && !addNewEvent && (
          <Event event={event} setEvent={setEvent} dayEvents={dayEvents} />
        )}
      </motion.div>
    </>
  );
};

export default Modal;
