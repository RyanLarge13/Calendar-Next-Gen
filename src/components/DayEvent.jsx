import { motion } from "framer-motion";
import { MdEventAvailable, MdEventNote, MdEventRepeat } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { useState, useEffect } from "react";

const DayEvent = ({ event, setEvent }) => {
  const [margin, setMargin] = useState(0);
  const [height, setHeight] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    const hour = new Date(event.start.startTime).getHours();
    setZ(hour);
    if (event.start.startTime) {
      const startHours = new Date(event.start.startTime).getHours() * 241.5;
      const startMinutes = new Date(event.start.startTime).getMinutes();
      setMargin(() => startHours + 100 + (startMinutes === 30 ? 100 : 0));
    }
    if (event.end.endTime) {
      const startHours = new Date(event.start.startTime).getHours() * 241.5;
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const endHours = new Date(event.end.endTime).getHours() * 241.5;
      const endMinutes = new Date(event.end.endTime).getMinutes();
      const startHeight = startHours + 100 + (startMinutes === 30 ? 100 : 0);
      const endHeight = endHours + 100 + (endMinutes === 30 ? 100 : 0);
      setHeight(endHeight - startHeight);
    }
  }, []);

  return (
    <motion.div
      key={event.id}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ top: `${margin}px`, height: height, minHeight: 50, zIndex: z }}
      className={`p-3 rounded-md shadow-md w-[70%] absolute ${event.color} bg-opacity-10 hover:z-[998] hover:bg-opacity-50 duration-200`}
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
