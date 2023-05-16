import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";

const ModalHeader = ({ allDayEvents, event }) => {
  const { string } = useContext(DatesContext);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);

  return (
    <motion.div
      animate={event ? { position: "fixed", left: "36%"} : {}}
      className="bg-white z-[999] p-2 font-bold shadow-sm sticky top-1 left-1 right-1 rounded-md"
    >
      <div className="flex justify-between items-center">
        <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {string}
        </h2>
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
      </div>
      {showAllDayEvents && (
        <motion.div
          initial={{ y: -100 }}
          animate={showAllDayEvents ? { y: 0 } : { y: -100 }}
        >
          {allDayEvents.map((event) => (
            <div
              key={event.id}
              className={`py-1 px-2 mt-2 rounded-md shadow-sm flex justify-between items-center ${event.color}`}
            >
              <p>{event.summary}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModalHeader;
