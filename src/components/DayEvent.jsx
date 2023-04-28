import { motion } from "framer-motion";
import Toggle from "./Toggle";

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
      <div className="my-2">
        <div className="flex justify-between items-center">
          <p>Repeats:</p>
          <Toggle condition={event.repeat.active} setCondition={null} />
        </div>
        {event.repeat.active && (
          <div className="text-xs">
            <p className="text-purple-400">{event.repeat.occurance},</p>
            <p onClick={() => setDate(event.repeat.next)}>
              Next Event: {event.repeat.next}
            </p>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mt-2">
          <p>Reminders:</p>
          <Toggle condition={event.reminder.reminder} setCondition={null} />
        </div>
        <p className="text-xs">{event.reminder.when}</p>
      </div>
      <div>
        <div className="flex justify-between items-center mt-2">
          <p>Time:</p>
          <Toggle condition={event.time.time} setCondition={null} />
        </div>
        <p className="text-xs">{event.time.timeDateString}</p>
      </div>
    </motion.div>
  );
};

export default DayEvent;
