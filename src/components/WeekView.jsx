import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants.js";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillCalendarDayFill } from "react-icons/bs";

const WeekView = () => {
  const { events, holidays } = useContext(UserContext);
  const { setEvent, setAddNewEvent, setType } = useContext(InteractiveContext);
  const {
    currentWeek,
    setCurrentWeek,
    string,
    setString,
    setOpenModal,
    dateObj,
  } = useContext(DatesContext);

  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const dateContainerRefs = useRef([]);
  const containerWidth = useRef(null);

  const currentWeekday = dateObj.getDay();

  useEffect(() => {
    const matchingEvents = currentWeek.map((weekDay) =>
      [...events, ...holidays].filter(
        (e) => e.date === weekDay.toLocaleDateString()
      )
    );
    setWeeklyEvents(matchingEvents);
  }, [currentWeek]);

  useEffect(() => {
    // Function to find the first event of the week and scroll to it
    const scrollToFirstEvent = () => {
      for (let index = 0; index < weeklyEvents.length; index++) {
        const eventsForDate = weeklyEvents[index];
        if (eventsForDate.length > 0) {
          const firstEventElement =
            dateContainerRefs.current[index]?.querySelector(".event-item");
          if (firstEventElement) {
            setTimeout(() => {
              dateContainerRefs.current[index]?.scrollTo({
                left: firstEventElement.offsetLeft - 50,
                behavior: "smooth",
              });
            }, 500);
          }
        }
      }
    };

    // Scroll to the first event when weeklyEvents data updates
    scrollToFirstEvent();
  }, [weeklyEvents]);

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
  };

  return (
    <section className="relative flex flex-col justify-between items-start">
      {currentWeek.map((date, index) => (
        <div key={index} className={`w-full border-r border-l rounded-t-lg`}>
          <div
            className={`w-full flex justify-between items-center rounded-full shadow-md p-2 text-[14px] mb-1 ${
              date.getDay() === currentWeekday
                ? "bg-purple-300"
                : "bg-purple-100"
            }`}
          >
            <p>
              {date.toLocaleDateString("en-US", { weekday: "long" })} -{" "}
              {date.toLocaleDateString()}
            </p>
            <div className="flex gap-x-3">
              <BsFillCalendarDayFill />
              <AiOutlinePlusCircle
                className="text-lg"
                onClick={() => {
                  setOpenModal(true);
                  setString(date);
                  setType("event");
                  setAddNewEvent(true);
                }}
              />
            </div>
          </div>
          <div>
            <div
              ref={(ref) => (dateContainerRefs.current[index] = ref)}
              className="overflow-x-auto"
            >
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
                {weeklyEvents.length > 0 &&
                  weeklyEvents[index].map((weekEvent) => (
                    <div
                      key={weekEvent.id}
                      style={{
                        width: `${calcDayEventWidth(
                          new Date(weekEvent.start.startTime),
                          new Date(weekEvent.end.endTime)
                        )}px`,
                        left: fromLeft(new Date(weekEvent.start.startTime)),
                      }}
                      className={`absolute top-5 bottom-2 event-item rounded-md shadow-md p-2 ${weekEvent.color}`}
                      onClick={() => setEvent(weekEvent)}
                    >
                      <p>{weekEvent.summary}</p>
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
