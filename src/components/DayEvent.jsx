import { motion } from "framer-motion";

const DayEvent = ({ event, setEvent }) => {
  return (
    <motion.div
      key={event.id}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`p-3 my-2 rounded-md shadow-md w-full`}
    >
      <h3
        onClick={() => setEvent(event)}
        className={`${event.color} px-3 py-1 rounded-md font-extrabold mb-5 shadow-sm`}
      >
        {event.event}
      </h3>
    </motion.div>
  );
};

export default DayEvent;
