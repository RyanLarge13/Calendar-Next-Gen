import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../constants.js";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillCalendarDayFill } from "react-icons/bs";

const WeekView = () => {
  const { events, holidays, preferences } = useContext(UserContext);
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
  }, [currentWeek, events, holidays]);

  useEffect(() => {
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
    scrollToFirstEvent();
  }, [weeklyEvents]);

  const calcDayEventWidth = (start, end) => {
    if (!start || !end) return 200;
    if (containerWidth.current) {
      const duration = end.getTime() - start.getTime();
      const width = containerWidth.current.clientWidth;
      const componentWidth = (duration / (24 * 60 * 60 * 1000)) * width;
      return componentWidth <= 0 ? 100 : componentWidth;
    }
  };

  const fromLeft = (startTime) => {
    if (!startTime) return 0;
    if (containerWidth.current) {
      const width = containerWidth.current.clientWidth;
      const timeInSeconds =
        startTime.getHours() * 3600 +
        startTime.getMinutes() * 60 +
        startTime.getSeconds();
      const percentage = (timeInSeconds / (24 * 3600)) * 100;
      return (percentage * width) / 100;
    }
  };

  const addNewDataForDay = (date) => {
    setString(date.toLocaleDateString());
    setOpenModal(true);
  };

  return (
    <section className="relative flex flex-col gap-6">
      {currentWeek.map((date, index) => (
        <div
          key={index}
          className="w-full rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-purple-50 to-white dark:from-[#222] dark:to-[#333]"
        >
          {/* Day Header */}
          <div
            className={`w-full flex justify-between items-center px-4 py-2 rounded-t-2xl shadow-sm ${
              date.getDay() === currentWeekday
                ? "bg-purple-500 text-white"
                : "bg-purple-100 dark:bg-[#444] dark:text-white"
            }`}
          >
            <p className="font-semibold text-sm">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-x-4 items-center">
              <BsFillCalendarDayFill className="text-lg" />
              <AiOutlinePlusCircle
                className="text-xl cursor-pointer hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                onClick={() => addNewDataForDay(date)}
              />
            </div>
          </div>

          {/* Events + Timeline */}
          <div className="relative">
            <div
              ref={(ref) => (dateContainerRefs.current[index] = ref)}
              className="overflow-x-auto scrollbar-hide"
            >
              <div ref={containerWidth} className="flex relative w-[800vw]">
                {staticTimes.map((time) => (
                  <motion.div
                    key={time.string}
                    whileTap={{ backgroundColor: "#eee" }}
                    className={`border-l h-[20vh] flex justify-start items-start px-2 text-[11px] w-full 
                      ${
                        preferences.darkMode
                          ? "bg-[#222] text-slate-200"
                          : "bg-white text-slate-600"
                      }`}
                  >
                    <p>{time.string}</p>
                  </motion.div>
                ))}

                {/* Events */}
                {weeklyEvents.length > 0 &&
                  weeklyEvents[index].map((weekEvent) => {
                    const start = new Date(weekEvent?.start?.startTime);
                    const end = new Date(weekEvent?.end?.endTime);

                    return (
                      <motion.div
                        key={weekEvent.id}
                        style={{
                          width: `${calcDayEventWidth(start, end)}px`,
                          left: fromLeft(start),
                        }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className={`absolute top-5 bottom-2 event-item rounded-xl shadow-md cursor-pointer 
          bg-gradient-to-r from-purple-400 to-purple-600 text-white`}
                        onClick={() => setEvent(weekEvent)}
                      >
                        <div className="flex flex-col h-full p-2">
                          {/* Time */}
                          <span className="text-[10px] font-semibold opacity-90">
                            {start.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {end.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {/* Summary */}
                          <p className="mt-1 text-sm font-medium leading-snug truncate">
                            {weekEvent.summary}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default WeekView;
