import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Event = ({ event, setEvent }) => {
  const [start, setStart] = useState(0);
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    let interval;
    let timeLeftInterval;
    if (
      event &&
      new Date(event.date).toLocaleDateString() ===
        new Date().toLocaleDateString()
    ) {
      const startHourMinutes = new Date(event.start.startTime).getHours() * 60;
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const totalMinutesToStart = startHourMinutes + startMinutes;
      timeLeftInterval = setInterval(() => {
        checkTimeLeft();
      }, 1000);
      interval = setInterval(() => {
        calcTime(totalMinutesToStart);
      }, 1000);
    }

    const checkTimeLeft = () => {
      const startHours = new Date(event.start.startTime).getHours();
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const startSeconds = new Date(event.start.startTime).getSeconds();
      const currentHours = new Date().getHours();
      const currentMinutes = new Date().getMinutes();
      const currentSeconds = new Date().getSeconds();
      const hoursLeft = startHours - currentHours;
      const minutesLeft = (currentMinutes - (startMinutes + 60)) * -1;
      const secondsLeft = (currentSeconds - (startSeconds + 60)) * -1;
      const timeString = `${hoursLeft - 1}:${
        minutesLeft < 11 ? `0${minutesLeft - 1}` : minutesLeft - 1
      }:${secondsLeft < 11 ? `0${secondsLeft - 1}` : secondsLeft - 1}`;
      setTimeLeft(hours < 0 ? null : timeString);
    };

    const calcTime = (start) => {
      const currentHourMinutes = new Date().getHours() * 60;
      const currentMinutes = new Date().getMinutes();
      const now = currentMinutes + currentHourMinutes;
      const first = start - now;
      const decimal = first / start;
      const final = 100 - Math.round(decimal * 100);
      if (final >= 100) {
        clearInterval(interval);
        return setWidth(100 - 2);
      }
      if (final < 100) {
        return setWidth(final - 2);
      }
    };
    if (!event) return () => clearInterval(interval);
  }, [event]);

  const checkToClose = (e) => {
    const end = e.clientY;
    if (end - start > window.innerHeight / 2.75) {
      setOpen(false);
      setTimeout(() => {
        setEvent(null);
      }, 100);
    }
  };

  return (
    <motion.div
      drag="y"
      dragSnapToOrigin="true"
      dragConstraints={{ top: 0 }}
      onDragStart={(e) => setStart(e.clientY)}
      onDragEnd={(e) => checkToClose(e)}
      initial={{ y: "100%" }}
      animate={open ? { y: 0 } : { y: "100%" }}
      className="fixed inset-3 top-[7%] rounded-md z-50 bg-white"
    >
      <div
        className={`w-full h-full rounded-md bg-opacity-20 p-3 ${event.color}`}
      >
        <div className={`p-2 rounded-md shadow-sm font-bold ${event.color}`}>
          <h1>{event.summary}</h1>
        </div>
        <div
          className={`p-2 mt-2 rounded-md shadow-sm font-bold ${event.color} bg-opacity-50`}
        >
          <p>{event.description}</p>
        </div>
        <div className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full justify-between items-center bg-white">
          <motion.div
            animate={{
              width: `${width}%`,
              transition: { duration: 0.1, type: "spring", stiffness: 400 },
            }}
            className={`absolute left-1 top-1 bottom-1 ${event.color} bg-opacity-50 rounded-3xl`}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5 } }}
            className="z-10 font-bold"
          >
            {timeLeft}
          </motion.p>
          <p className="z-10">
            {new Date(event.start.startTime).toLocaleTimeString()}
          </p>
        </div>
        <p></p>
      </div>
    </motion.div>
  );
};

export default Event;
