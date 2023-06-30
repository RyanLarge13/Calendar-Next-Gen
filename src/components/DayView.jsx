import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Event from "./Event";

const DayView = ({ todaysEvents, todaysReminders }) => {
  const [event, setEvent] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [height, setheight] = useState(0);
  const dayViewContainer = useRef(null);
  let interval;

  useEffect(() => {
    getTime();
    return () => clearInterval(interval);
  }, []);

  const calcDayEventHeight = (start, end) => {
    if (!start || !end) {
      return null;
    } else {
      const duration = end.getTime() - start.getTime();
      const containerHeight = dayViewContainer.current.clientHeight;
      const componentHeight =
        (duration / (24 * 60 * 60 * 1000)) * containerHeight;
      return componentHeight;
    }
  };

  const fromTop = (startTime) => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - startTime.getTime();
    const containerHeight = dayViewContainer.current.clientHeight;
    const distanceFromTop =
      (timeDifference / (24 * 60 * 60 * 1000)) * containerHeight;
    return distanceFromTop;
  };

  const getTime = () => {
    interval = setInterval(() => {
      const now = new Date();
      const percentageOfDay =
        (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) /
        (24 * 3600);
      const containerHeight = dayViewContainer.current.clientHeight;
      const newPosition = Math.floor(percentageOfDay * containerHeight);
      setheight(newPosition);
      setTime(now.toLocaleTimeString());
    }, 1000);
  };

  return (
    <div ref={dayViewContainer} className="text-sm min-h-screen">
      {todaysEvents.length > 0 ? (
        <motion.div animate={{ top: height }} className="absolute right-0">
          <div className="w-[20px] h-[20px] rounded-full shadow-md bg-lime-200 after:w-20 after:h-[2px] after:bg-black after:absolute after:top-[50%] after:z-[-1] after:left-[-350%]">
            <p className="absolute px-1 shadow-md bg-white rounded-md left-[-375%] top-[-50%]">
              {time}
            </p>
          </div>
        </motion.div>
      ) : (
        <p className="text-center">No Events Today</p>
      )}
      <div className="mt-5">
        {[...todaysEvents, ...todaysReminders].map((item) => {
         return item.hasOwnProperty("description") ? (
            <div
              key={item.id}
              // style={{
              //   height: `${calcDayEventHeight(
              //     new Date(event.start.startTime),
              //     new Date(event.end.endTime)
              //   )}px`,
              //   top: fromTop(new Date(event.start.startTime)),
              // }}
              onClick={() => setEvent(item)}
              className={`${item.color} bg-opacity-70 p-5 rounded-md shadow-md my-5`}
            >
              <p className="font-bold">{item.summary}</p>
              <p className="mr-5 text-sm">{item.description}</p>
            </div>
          ) : (
            <div key={item.id}>
              <p>{item.title}</p>
            </div>
          );
        })}
      </div>
      {event && (
        <Event event={event} setEvent={setEvent} dayEvents={todaysEvents} />
      )}
    </div>
  );
};

export default DayView;
