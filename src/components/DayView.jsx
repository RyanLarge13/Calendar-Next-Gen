import { useEffect, useRef, useState, useContext } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants.js";
import { formatDbText } from "../utils/helpers.js";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const DayView = ({ todaysEvents, todaysReminders }) => {
  const { setEvent } = useContext(InteractiveContext);
  const { theDay, dateObj } = useContext(DatesContext);
  const [time, setTime] = useState(dateObj.toLocaleTimeString());
  const [height, setheight] = useState(0);
  const [combinedArray, setCombinedArray] = useState([]);
  const [times, setTimes] = useState([]);
  const dayViewContainer = useRef(null);
  let interval;

  useEffect(() => {
    const combined = [...todaysEvents, ...todaysReminders];
    combined.sort((a, b) => {
      const dateA = new Date((a.start && a.start.startTime) || a.time);
      const dateB = new Date((b.start && b.start.startTime) || b.time);
      return dateA - dateB;
    });
    setCombinedArray(combined);
    if (theDay.toLocaleDateString() === dateObj.toLocaleDateString()) {
      getTime();
    }
    return () => clearInterval(interval);
  }, [todaysEvents, todaysReminders]);

  const calcDayEventHeight = (start, end) => {
    if (!start || !end) {
      return null;
    } else {
      if (dayViewContainer.current) {
        const duration = end.getTime() - start.getTime();
        const containerHeight = dayViewContainer.current.clientHeight;
        const componentHeight =
          (duration / (24 * 60 * 60 * 1000)) * containerHeight;
        return componentHeight;
      }
    }
  };

  const fromTop = (startTime) => {
    if (dayViewContainer.current) {
      const containerHeight = dayViewContainer.current.clientHeight;
      const timeInSeconds =
        startTime.getHours() * 3600 +
        startTime.getMinutes() * 60 +
        startTime.getSeconds();
      const percentage = (timeInSeconds / (24 * 3600)) * 100;
      return (percentage * containerHeight) / 100;
    }
    return 0;
  };

  useEffect(() => {
    return window.scrollTo({ top: height, behavior: "smooth" });
  }, [height]);

  const getTime = () => {
    interval = setInterval(() => {
      const percentageOfDay =
        (dateObj.getHours() * 3600 +
          dateObj.getMinutes() * 60 +
          dateObj.getSeconds()) /
        (24 * 3600);
      const containerHeight = dayViewContainer.current.clientHeight;
      const newPosition = Math.floor(percentageOfDay * containerHeight);
      setheight(newPosition);
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  };

  const getHeight = () => {
    if (dayViewContainer.current) {
      const height = dayViewContainer.current.clientHeight / staticTimes.length;
      return height;
    }
  };

  const checkToSetTime = (e, staticString) => {
    if (times.includes(staticString)) {
      const newStrings = times.filter((time) => time !== staticString);
      return setTimes(newStrings);
    }
    const end = e.clientX;
    if (end > window.innerWidth / 1.5) {
      setTimes((prev) => [...prev, staticString]);
    }
  };

  return (
    <div className="py-20">
      <div ref={dayViewContainer} className="text-sm min-h-[400vh] relative">
        {dateObj.toLocaleDateString() === theDay.toLocaleDateString() ? (
          <motion.div
            animate={{ top: height }}
            className="absolute right-0 z-[200] translate-y-[-50%]"
          >
            <div className="w-[20px] h-[20px] rounded-full shadow-md bg-lime-200 after:w-20 after:h-[2px] after:bg-black after:absolute after:top-[50%] after:z-[-1] after:left-[-350%]">
              <p className="absolute px-1 shadow-md bg-white rounded-md left-[-375%] top-[-50%]">
                {time}
              </p>
            </div>
          </motion.div>
        ) : (
          <p className=""></p>
        )}
        <div>
          <div className="">
            {staticTimes.map((staticTime, index) => (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0 }}
                dragSnapToOrigin={true}
                onDragEnd={(e) => checkToSetTime(e, staticTime.string.trim())}
                //whileHover={{ backgroundColor: "#ddd" }}
                key={index}
                style={{ height: `${getHeight()}px` }}
                animate={{
                  backgroundColor: `${
                    times.includes(staticTime.string.trim())
                      ? "#67e8f9"
                      : "#fff"
                  }`,
                }}
                className={`${index === 0 ? "border-b border-t" : "border-b"}`}
              >
                <p className="text-[11px]">{staticTime.string}</p>
              </motion.div>
            ))}
          </div>
          {combinedArray.map((item) => (
            <div
              key={item.id}
              style={
                item.start
                  ? {
                      height: `${calcDayEventHeight(
                        new Date(item.start.startTime),
                        new Date(item.end.endTime)
                      )}px`,
                      top: fromTop(new Date(item.start.startTime)),
                    }
                  : {
                      height: `${getHeight()}px`,
                      top: fromTop(new Date(item.time)),
                    }
              }
              onClick={() => (item.start ? setEvent(item) : null)}
              className={`${item.color || "bg-slate-200"} ${
                item.start ? "z-[10]" : "z-[50]"
              } absolute right-5 left-20 bg-opacity-70 p-2 rounded-md shadow-md`}
            >
              <p className="font-bold bg-white bg-opacity-50 p-2 rounded-md">
                {item.summary || item.title}
              </p>
              <p className="mr-5 text-sm bg-white bg-opacity-30 rounded-md p-2 w-full mt-2">
                {item.description
                  ? formatDbText(item.description).map((text, index) => (
                      <p key={index} className="text-[14px]">
                        {text}
                      </p>
                    ))
                  : "" || item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
