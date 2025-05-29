import { useState, useContext } from "react";
import { motion, useDragControls } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";
import { MdEventAvailable, MdEventNote, MdEventRepeat } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import {tailwindBgToHex} from "../utils/helpers.js"
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { formatDbText } from "../utils/helpers";
import { updateStartAndEndTimeOnEvent } from "../utils/api";

const DayEvent = ({
  dayEvent,
  setDayEvents,
  height,
  top,
  thirtyMinuteHeight
}) => {
  const { setEvent } = useContext(InteractiveContext);

  const [start, setStart] = useState(0);
  const [fromTop, setFromTop] = useState(top);

  const dragControls = useDragControls();

  const startDrag = e => {
    setStart(e.clientY);
    dragControls.start(e);
  };

  const updateTimeOnEvent = amount => {
    const token = localStorage.getItem("authToken");
    updateStartAndEndTimeOnEvent(dayEvent.id, amount, token)
      .then(res => {
        const start = new Date(dayEvent.start.startTime);
        const end = new Date(dayEvent.end.endTime);
        const newStart = start.setMinutes(start.getMinutes() + amount * 30);
        const newEnd = end.setMinutes(start.getMinutes() + amount * 30);
        setDayEvents(prev => {
          return prev.map(item => {
            if (item.id === dayEvent.id) {
              return {
                ...item,
                startDate: newStart,
                start: { ...item.start, startTime: newStart },
                end: { ...item.end, endTime: newEnd }
              };
            } else {
              return item;
            }
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const checkTime = e => {
    if (thirtyMinuteHeight !== 0) {
      const end = e.clientY;
      const diff = end - start;
      if (diff === 0) {
        return;
      }
      const amountInChange = Math.round(diff / thirtyMinuteHeight);
      const newTop = fromTop + (thirtyMinuteHeight * amountInChange - diff);
      setFromTop(newTop);
      if (amountInChange !== 0) {
        updateTimeOnEvent(amountInChange);
      }
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
      onDragEnd={e => checkTime(e)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      style={{ height: height, top: fromTop }}
      onTap={() => setEvent(dayEvent)}
      className={`p-3 rounded-md shadow-md w-[70%] duration-200 absolute ${dayEvent.color} bg-opacity-10 hover:z-[998] overflow-hidden hover:bg-opacity-50 right-0`}
    >
      <div
        onPointerDown={e => startDrag(e)}
        style={{
          touchAction: "none",
          color: tailwindBgToHex(dayEvent.color)
        }}
        className={`${dayEvent.color} px-3 py-1 rounded-md font-extrabold mb-5 shadow-sm justify-between flex items-start`}
      >
        <h3 className="text-sm cursor-pointer">{dayEvent.summary}</h3>
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
      <div className="mr-5 text-sm bg-white bg-opacity-30 rounded-md p-2 w-full mt-2">
        {formatDbText(dayEvent.description).map((text, index) => (
          <p key={index} className="text-[14px]">
            {text}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default DayEvent;
