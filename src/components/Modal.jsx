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

const Modal = () => {
  const { events, holidays } = useContext(UserContext);
  const { string, setOpenModal } = useContext(DatesContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [event, setEvent] = useState(false);
  const [type, setType] = useState("event");
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [addEventWithStartTime, setAddEventWithStartTime] = useState(null);
  const modalRef = useRef(0);

  useEffect(() => {
    if (string === new Date().toLocaleDateString()) {
      const todaysHours = new Date().getHours();
      !addNewEvent
        ? modalRef.current.scroll(0, todaysHours * 240)
        : modalRef.current.scrollTo(0, 0);
    }
    addNewEvent && modalRef.current.scrollTo(0, 0);
    const eventsForDay = [...events, ...holidays].filter(
      (event) => new Date(event.date).toLocaleDateString() === string
    );
    const fullDayEvents = eventsForDay.filter(
      (event) =>
        new Date(event.start.startTime).getHours() === 0 ||
        (new Date(event.end.endTime).getHours() === 23 &&
          new Date(event.end.endTime).getMinutes() >= 30) ||
        event.end.endTime === null ||
        event.start.startTime === null
    );
    const timedEvents = eventsForDay.filter(
      (event) => event.start.startTime !== null || event.end.endTime !== null
    );
    // setDayEvents(eventsForDay);
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
      {addNewEvent && (
        <CalendarEventTypeMenu type={type} allDayEvents={allDayEvents} />
      )}
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        className={`bg-white rounded-md shadow-lg shadow-purple-200 px-2 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto scroll-smooth`}
        ref={modalRef}
      >
        {!addNewEvent && <ModalHeader allDayEvents={allDayEvents} />}
        {addNewEvent ? (
          <AddEvent
            setAddNewEvent={setAddNewEvent}
            passedStartTime={addEventWithStartTime}
          />
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
                  className={`${index === 0 ? "mt-0" : "my-[100px]"} ${
                    index % 2 === 0 ? "text-md" : "text-xs"
                  } relative after:left-0 after:bottom-0 after:w-full after:h-[1px] after:absolute after:bg-slate-200`}
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
            <button
              onClick={() => setAddNewEvent(true)}
              className="px-5 py-2 mt-5 fixed bottom-5 right-5 rounded-md shadow-md bg-gradient-to-r from-green-300 to-green-200 z-[999]"
            >
              <FaCalendarPlus />
            </button>
          </div>
        )}
        {event && <Event event={event} />}
      </motion.div>
    </>
  );
};

export default Modal;
