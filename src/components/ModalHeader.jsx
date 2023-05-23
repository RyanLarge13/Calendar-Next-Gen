import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { deleteEvent } from "../utils/api.js";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Confirm from "./Confirm";

const ModalHeader = ({ addEvent, allDayEvents, event, setEvent }) => {
  const { string } = useContext(DatesContext);
  const { user, events, setEvents, holidays } = useContext(UserContext);
  const { confirm, setConfirm } = useState(false);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);
  const [x, setX] = useState("100%");

  useEffect(() => {
    setTimeout(() => {
      setX(0);
    }, 750);
  }, []);

  useEffect(() => {
    event || addEvent ? setShowAllDayEvents(false) : setShowAllDayEvents(true);
  }, [event, addEvent]);

  const deleteAnEvent = () => {
    setConfirm(false);
    const authToken = localStorage.getItem("authToken");
    deleteEvent(user.username, event.id, authToken)
      .then((res) => {
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        const newStore = storedEvents.filter((e) => e.id !== res.data.eventId);
        localStorage.setItem("events", JSON.stringify(newStore));
        const filteredEvents = events.filter((e) => e.id !== res.data.eventId);
        setEvent(null);
        setEvents(filteredEvents);
        if (allDayEvents.length > 0) {
          setShowAllDayEvents(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <motion.div
      animate={event && !addEvent ? { left: 5 } : { left: "36%", x: x }}
      className="bg-white z-[999] p-2 font-bold shadow-md fixed top-1 right-1 rounded-md"
    >
      <div className="flex justify-between items-center">
        <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {string}
        </h2>
        <div className="flex gap-x-3">
          {allDayEvents.length > 0 && (
            <div>
              {showAllDayEvents ? (
                <BsFillArrowUpCircleFill
                  onClick={() => setShowAllDayEvents(false)}
                />
              ) : (
                <BsFillArrowDownCircleFill
                  onClick={() => setShowAllDayEvents(true)}
                />
              )}
            </div>
          )}
          {event && (
            <>
              {!holidays.includes(event) && (
                <>
                  <BsFillShareFill />
                  <BsFillPenFill />
                  <BsFillTrashFill onClick={() => setConfirm(true)} />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <motion.div
        animate={showAllDayEvents ? { height: "max-content" } : { height: 0 }}
      >
        {allDayEvents.map((event, index) => (
          <motion.div
            animate={
              showAllDayEvents
                ? { opacity: 1, y: 0, transition: { delay: 0.25 } }
                : { opacity: 0, y: -50 }
            }
            key={event.id}
            className={`py-1 px-2 rounded-md shadow-sm flex justify-between ${
              event.color
            } ${index === 0 && !showAllDayEvents ? "mt-0" : "mt-2"}`}
          >
            <p onClick={() => setEvent(event)}>{event.summary}</p>
          </motion.div>
        ))}
      </motion.div>
      {confirm && <Confirm func={deleteAnEvent} />}
    </motion.div>
  );
};

export default ModalHeader;
