import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants.js";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

const WeekView = () => {
  const { events, holidays } = useContext(UserContext);
  const { currentWeek, setCurrentWeek } = useContext(DatesContext);
  const currentWeekday = new Date().getDay();
  const [timeWidth, setTimeWidth] = useState(0);
  const containerWidth = useRef(null);

  const getElemWidth = () => {
    if (containerWidth.current) {
      const widthOfContainer =
        containerWidth.current.clientWidth / staticTimes.length;
      return widthOfContainer;
    }
    return 600;
  };

  const eventsForDay = (date) => {
    const dayEvents = events.filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === date.toLocaleDateString()
    );
    return dayEvents;
  };

  const calcDayEventWidth = (start, end) => {
    if (!start || !end) {
      return null;
    } else {
      if (containerWidth.current) {
        const duration = end.getTime() - start.getTime();
        const width = containerWidth.current.clientWidth;
        const componentWidth = (duration / (24 * 60 * 60 * 1000)) * width;
        return componentWidth;
      }
      return 0;
    }
  };

  const fromLeft = (startTime) => {
    if (containerWidth.current) {
      const width = containerWidth.current.clientWidth;
      const timeInSeconds =
        startTime.getHours() * 3600 +
        startTime.getMinutes() * 60 +
        startTime.getSeconds();
      const percentage = (timeInSeconds / (24 * 3600)) * 100;
      const result = (percentage * width) / 100;
      return result;
    }
    return 0;
  };

  return (
    <section className="relative flex flex-col justify-between items-start">
      {currentWeek.map((date, index) => (
        <div key={index} className="w-full border-r border-l rounded-t-lg">
          <p
            className={`rounded-full shadow-md p-2 text-[14px] ${
              date.getDay() === currentWeekday ? "bg-teal-300" : "bg-teal-100"
            }`}
          >
            {date.toLocaleDateString("en-US", { weekday: "long" })} -{" "}
            {date.toLocaleDateString()}
          </p>
          <div>
            <div className="overflow-x-auto">
              <div ref={containerWidth} className="flex relative w-[800vw]">
                {staticTimes.map((time) => (
                  <motion.div
                    key={time.string}
                    whileTap={{ backgroundColor: "#ddd" }}
                    className="border-l h-[20vh] flex justify-start items-start text-[11px] w-full"
                  >
                    <p>{time.string}</p>
                  </motion.div>
                ))}
                {eventsForDay(date).map((weekDayEvent) => (
                  <div
                    key={weekDayEvent.id}
                    style={{
                      width: `${calcDayEventWidth(
                        new Date(weekDayEvent.start.startTime),
                        new Date(weekDayEvent.end.endTime)
                      )}px`,
                      left: fromLeft(new Date(weekDayEvent.start.startTime)),
                    }}
                    className={`absolute top-5 bottom-2 rounded-md shadow-md p-2 ${weekDayEvent.color}`}
                  >
                    <p>{weekDayEvent.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default WeekView;
