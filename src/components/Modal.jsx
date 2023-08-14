import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staticTimes } from "../constants";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DayEvent from "./DayEvent";
import AddEvent from "./AddEvent";
import ModalHeader from "./ModalHeader";
import AddReminder from "./AddReminder";
import AddList from "./AddList";
import AddKanban from "./AddKanban";
import AddTask from "./AddTask";

const Modal = () => {
  const { events, holidays } = useContext(UserContext);
  const { string, setOpenModal, openModal, dateObj } = useContext(DatesContext);
  const { addNewEvent, setAddNewEvent, type, setType } =
    useContext(InteractiveContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [addEventWithStartTime, setAddEventWithStartTime] = useState(null);
  const modalRef = useRef(0);

  useEffect(() => {
    if (string === dateObj.toLocaleDateString()) {
      const todaysHours = dateObj.getHours();
      !addNewEvent
        ? modalRef.current.scrollTo(0, todaysHours * 237)
        : modalRef.current.scrollTo(0, 0);
    }
    addNewEvent && modalRef.current.scrollTo(0, 0);
    const eventsForDay = [...events, ...holidays].filter(
      (event) => new Date(event.date).toLocaleDateString() === string
    );
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
            className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex z-[10]"
          ></motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            exit={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`bg-white z-[600] rounded-md shadow-lg shadow-purple-200 px-2 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto scroll-smooth scrollbar-hide`}
            ref={modalRef}
          >
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
                        setType("event");
                        setAddNewEvent(true);
                      }}
                      style={
                        index % 2 === 0
                          ? { fontSize: "15px" }
                          : { fontSize: "10px" }
                      }
                      className={`${index === 0 ? "mt-0" : "my-[100px]"} ${
                        index % 2 === 0 ? "after:w-[100%]" : "after:w-[70%]"
                      } relative cursor-pointer after:left-0 after:bottom-0 after:h-[1px] after:absolute after:bg-slate-200`}
                    >
                      {timeObj.string}
                    </p>
                  ))}
                </div>
                <div className="w-full">
                  {dayEvents.map((event) => (
                    <DayEvent key={event.id} dayEvent={event} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
