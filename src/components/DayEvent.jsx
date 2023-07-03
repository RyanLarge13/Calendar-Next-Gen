import { useState, useEffect, useContext } from "react";
import { motion, useDragControls } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";
import { MdEventAvailable, MdEventNote, MdEventRepeat } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";

const DayEvent = ({ dayEvent }) => {
  const { setEvent } = useContext(InteractiveContext);
  const [margin, setMargin] = useState(0);
  const [height, setHeight] = useState(0);
  const [z, setZ] = useState(0);
  const [start, setStart] = useState(0);

  const dragControls = useDragControls();

  useEffect(() => {
    const hour = new Date(dayEvent.start.startTime).getHours();
    setZ(hour);
    if (dayEvent.start.startTime) {
      const startHours = new Date(dayEvent.start.startTime).getHours() * 237;
      const startMinutes = new Date(dayEvent.start.startTime).getMinutes();
      setMargin(() => startHours + 118.5 + (startMinutes === 30 ? 118.5 : 0));
    }
    if (dayEvent.end.endTime) {
      const startHours = new Date(dayEvent.start.startTime).getHours() * 237;
      const startMinutes = new Date(dayEvent.start.startTime).getMinutes();
      const endHours = new Date(dayEvent.end.endTime).getHours() * 237;
      const endMinutes = new Date(dayEvent.end.endTime).getMinutes();
      const startHeight =
        startHours + 118.5 + (startMinutes === 30 ? 118.5 : 0);
      const endHeight = endHours + 118.5 + (endMinutes === 30 ? 118.5 : 0);
      setHeight(endHeight - startHeight);
    }
  }, []);

  const startDrag = (e) => {
    setStart(e.clientY);
    dragControls.start(e);
  };

  const checkTime = (e) => {
    const end = e.clientY;
    const diff = end - start;
    if (diff < 0) {
      const marginLeft = Math.round(diff + 118.5);
      setMargin((prev) => prev + -marginLeft);
    }
    if (diff > 0) {
      const marginLeft = Math.round(diff - 118.5);
      setMargin((prev) => prev + -marginLeft);
    }
    if (diff === 0) {
      setMargin((prev) => prev + 0);
    }
  };

  return (
    <motion.div
      key={dayEvent.id}
      drag="y"
      dragSnapToOrigin={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      onDragEnd={(e) => checkTime(e)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      style={{ top: `${margin}px`, height: height, minHeight: 50, zIndex: z }}
      className={`p-3 rounded-md shadow-md w-[70%] duration-200 absolute ${
        dayEvent.color
      } ${
        dayEvent.color === "bg-black" ? "text-white" : "text-black"
      } bg-opacity-10 hover:z-[998] hover:bg-opacity-50 right-0`}
    >
      <div
        onPointerDown={(e) => startDrag(e)}
        style={{
          touchAction: "none",
        }}
        className={`${dayEvent.color} px-3 py-1 rounded-md font-extrabold mb-5 shadow-sm justify-between flex items-start`}
      >
        <h3
          onClick={() => setEvent(dayEvent)}
          className="text-sm cursor-pointer"
        >
          {dayEvent.summary}
        </h3>
        <div className="flex">
          <p>
            {(dayEvent.kind === "Event" && <MdEventNote />) ||
              (dayEvent.kind === "Reminder" && <MdEventAvailable />) ||
              (dayEvent.kind === "Repeat" && <MdEventRepeat />)}
          </p>
          <p>{dayEvent.repeats.repeat && <FiRepeat />}</p>
          <p>{dayEvent.reminders.reminder && <IoIosAlarm />}</p>
          <p>{dayEvent.location && <MdLocationPin />}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DayEvent;
