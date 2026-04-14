import { motion } from "framer-motion";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import {
  MdEventAvailable,
  MdEventNote,
  MdEventRepeat,
  MdLocationPin,
} from "react-icons/md";
import { tailwindBgToHex } from "../../utils/helpers.js";

const EventCard = ({ event, styles = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      style={styles}
      whileInView={{ opacity: 1 }}
      className={`p-3 rounded-md shadow-md duration-200 ${event.color} mt-5 cursor-pointer bg-opacity-10 hover:bg-opacity-50 right-0`}
    >
      <div
        style={{
          touchAction: "none",
          color: tailwindBgToHex(event.color),
        }}
        className={`${event.color} px-3 py-1 rounded-md font-extrabold mb-5 shadow-sm justify-between flex items-start`}
      >
        <h3 className="text-sm">{event.summary}</h3>
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
      <div className="text-sm bg-white bg-opacity-40 break-words rounded-md p-2 mt-2">
        {event.description}
      </div>
    </motion.div>
  );
};

export default EventCard;
