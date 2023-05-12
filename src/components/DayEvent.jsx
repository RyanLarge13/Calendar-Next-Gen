import { motion } from "framer-motion";
import { MdEventAvailable, MdEventNote, MdEventRepeat } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";

const DayEvent = ({ event, setEvent }) => {
  return (
    <motion.div
      key={event.id}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`p-3 my-2 rounded-md shadow-md w-full`}
    >
      <div
        className={`${event.color} px-3 py-1 rounded-md font-extrabold mb-5 shadow-sm justify-between flex items-start`}
      >
        <h3 onClick={() => setEvent(event)} className="text-sm">
          {event.summary}
        </h3>
        <div className="flex">
          <p>
            {(event.kind === "Event" && <MdEventNote />) ||
              (event.kind === "Reminder" && <MdEventAvailable />) ||
              (event.kind === "Repeat" && <MdEventRepeat />)}
          </p>
          <p>{event.repeats.repeat && <FiRepeat />}</p>
          <p>{event.reminders.reminder && <IoIosAlarm />}</p>
          <p>{event.location && <MdLocationPin />}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DayEvent;
