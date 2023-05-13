import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaCalendarPlus } from "react-icons/fa";
import { staticTimes } from "../constants";
import DatesContext from "../context/DatesContext";
import DayEvent from "./DayEvent";
import AddEvent from "./AddEvent";
import Event from "./Event";
import UserContext from "../context/UserContext";

const Modal = () => {
  const { events, holidays } = useContext(UserContext);
  const { string, setOpenModal } = useContext(DatesContext);

  const [dayEvents, setDayEvents] = useState([]);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [event, setEvent] = useState(false);

  useEffect(() => {
    const eventsForDay = [...events, ...holidays].filter(
      (event) => new Date(event.date).toLocaleDateString() === string
    );
    setDayEvents(eventsForDay);
  }, [string, events]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setOpenModal(false)}
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex"
      ></motion.div>
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        className={`bg-white rounded-md shadow-lg shadow-purple-200 px-2 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto`}
      >
        <div className="bg-white rounded-sm z-[999] p-2 fixed top-0 right-0 font-bold shadow-sm">
          <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            {string}
          </h2>
        </div>
        {addNewEvent ? (
          <AddEvent setAddNewEvent={setAddNewEvent} />
        ) : (
          <div className="w-full pl-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 pl-2">
              {staticTimes.map((timeObj, index) => (
                <p
                  key={index}
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
