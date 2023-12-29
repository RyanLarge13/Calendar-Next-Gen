import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
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

const Modal = () => {
  const { events, holidays } = useContext(UserContext);
  const { string, setOpenModal, dateObj, setSecondString } =
    useContext(DatesContext);
  const { addNewEvent, setAddNewEvent, type, setType } =
    useContext(InteractiveContext);

  const navigate = useNavigate();

  const [dayEvents, setDayEvents] = useState([]);
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => {
          setAddNewEvent(false);
          setOpenModal(false);
          setType(null);
          navigate("/");
        }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex z-[10]"
      ></motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`bg-white z-[600] rounded-md shadow-lg shadow-purple-200 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto scroll-smooth scrollbar-hide`}
        ref={modalRef}
      >
        {addNewEvent ? (
          <div className="mt-10 mx-2">
            {type === "event" && <AddEvent />}
            {type === "reminder" && <AddReminder />}
            {type === "todo-list" && <AddList />}
            {type === "kanban" && <AddKanban />}
            {type === "task" && <AddTask />}
            {type === "stickynote" && <AddSticky />}
          </div>
        ) : (
          <div className="w-full pl-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 pl-2 pt-[100px]">
              {staticTimes.map((timeObj, index) => (
                <p
                  key={index}
                  onClick={() => {
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
        <Outlet />
      </motion.div>
    </>
  );
};

export default Modal;
