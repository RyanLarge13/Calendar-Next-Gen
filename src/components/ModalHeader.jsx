import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";

const ModalHeader = ({ allDayEvents }) => {
  const { string } = useContext(DatesContext);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);

  return (
    <div className="bg-white rounded-b-sm z-[999] p-2 sticky top-1 font-bold shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {string}
        </h2>
        {showAllDayEvents ? (
          <BsFillArrowUpCircleFill onClick={() => setShowAllDayEvents(false)} />
        ) : (
          <BsFillArrowDownCircleFill
            onClick={() => setShowAllDayEvents(true)}
          />
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
    </div>
  );
};

export default ModalHeader;
