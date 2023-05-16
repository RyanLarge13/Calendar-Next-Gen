import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";

const ModalHeader = ({ allDayEvents, event }) => {
  const { string } = useContext(DatesContext);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);
  const [x, setX] = useState("100%");

  useEffect(() => {
    setTimeout(() => {
      setX(0);
    }, 750);
  }, []);

  return (
    <motion.div
      animate={event ? { left: 5 } : { left: "36%", x: x }}
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
              <BsFillShareFill />
              <BsFillPenFill />
              <BsFillTrashFill />
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
            <p>{event.summary}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ModalHeader;
