import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaCalendarPlus } from "react-icons/fa";
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
        className={`bg-white rounded-md shadow-lg shadow-purple-200 px-2 py-5 fixed top-0 bottom-0 right-0 w-[65%] overflow-y-auto flex flex-col justify-between items-center`}
      >
        <h2 className="font-bold text-2xl text-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {string}
        </h2>
        {addNewEvent ? (
          <AddEvent setAddNewEvent={setAddNewEvent} />
        ) : (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center w-full">
              {dayEvents.map((event) => (
                <DayEvent key={event.id} event={event} setEvent={setEvent} />
              ))}
            </div>
            <button
              onClick={() => setAddNewEvent(true)}
              className="px-5 py-2 mt-5 w-full rounded-md shadow-md bg-gradient-to-r from-green-300 to-green-200"
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
