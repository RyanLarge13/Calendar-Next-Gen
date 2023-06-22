import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarPlus } from "react-icons/fa";
import { staticTimes } from "../constants";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DayEvent from "./DayEvent";
import AddEvent from "./AddEvent";
import Event from "./Event";
import ModalHeader from "./ModalHeader";
import AddReminder from "./AddReminder";
import AddList from "./AddList";
import AddKanban from "./AddKanban";
import AddTask from "./AddTask";

const Modal = () => {
  const { events, holidays, reminders } = useContext(UserContext);
  const { string, setOpenModal, openModal } = useContext(DatesContext);
  const { addNewEvent, setAddNewEvent, type, setType } =
    useContext(InteractiveContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [addEventWithStartTime, setAddEventWithStartTime] = useState(null);
  const modalRef = useRef(0);

  useEffect(() => {
    if (string === new Date().toLocaleDateString()) {
      const todaysHours = new Date().getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, todaysHours * 237)
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
        ? modalRef.current.scrollTo(0, firstEventHour * 237)
        : modalRef.current.scrollTo(0, 0);
    }
    setDayEvents(timedEvents);
    setAllDayEvents(fullDayEvents);
  }, [string, events, addNewEvent]);

  return (
    <AnimatePresence>
      {openModal && (
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
            className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex"
          ></motion.div>
          <motion.div
            initial={{ x: 1000 }}
            exit={{ x: 1000 }}
            animate={{ x: 0 }}
            className={`bg-white rounded-md shadow-lg shadow-purple-200 px-2 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto scroll-smooth scrollbar-hide`}
            ref={modalRef}
          >
            <ModalHeader
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
                    <DayEvent
                      key={event.id}
                      event={event}
                      setEvent={setEvent}
                    />
                  ))}
                </div>
              </div>
            )}
            {event && !addNewEvent && (
              <Event event={event} setEvent={setEvent} dayEvents={dayEvents} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
