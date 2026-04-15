import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staticTimes } from "../../constants/dateAndTimeConstants.js";
import UserContext from "../../context/UserContext.jsx";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillCalendarDayFill } from "react-icons/bs";
import {
  setStateAndPushWindowState,
  tailwindBgToHex,
} from "../../utils/helpers.js";
import { useModalActions } from "../../context/ContextHooks/ModalContext.jsx";

const WeekView = () => {
  const { events, preferences } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { currentWeek, setString, dateObj } = useContext(DatesContext);

  const { openModal } = useModalActions();

  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const dateContainerRefs = useRef([]);
  const containerWidth = useRef(null);

  const currentWeekday = dateObj.getDay();

  useEffect(() => {
    const matchingEvents = currentWeek.map((weekDay) =>
      events.filter((e) => e.date === weekDay.toLocaleDateString()),
    );
    setWeeklyEvents(matchingEvents);
  }, [currentWeek, events]);

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
    openModal();
  };

  const isEventAllDay = (event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const daysDifference = (endDate - startDate) / (24 * 60 * 60 * 1000);
    if (
      daysDifference >= 1 ||
      event.end.endTime === null ||
      event.start.startTime === null
    ) {
      return true;
    }
    return false;
  };

  return (
    <section className="relative flex flex-col gap-5">
      {currentWeek.map((date, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className={`
        w-full rounded-3xl border shadow-sm overflow-hidden
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white border-black/10"
        }
      `}
        >
          {/* Day Header */}
          <div
            className={`
          w-full px-5 py-4 border-b
          ${
            preferences.darkMode
              ? "border-white/10 bg-white/[0.03]"
              : "border-black/10 bg-black/[0.02]"
          }
        `}
          >
            <div className="w-full flex justify-between items-center gap-3">
              <div className="min-w-0">
                <p
                  className={`text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  {date.getDay() === currentWeekday ? "Today" : "Day"}
                </p>

                <p className="font-semibold text-sm sm:text-base truncate">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex gap-2 items-center flex-shrink-0">
                <div
                  className={`
                grid place-items-center h-10 w-10 rounded-2xl border shadow-sm
                ${
                  date.getDay() === currentWeekday
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70"
                      : "bg-black/[0.03] border-black/10 text-slate-600"
                }
              `}
                >
                  <BsFillCalendarDayFill className="text-lg" />
                </div>

                <button
                  type="button"
                  onClick={() => addNewDataForDay(date)}
                  className={`
                grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                hover:shadow-md active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/20"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                }
              `}
                  aria-label="Add new event"
                >
                  <AiOutlinePlusCircle className="text-xl" />
                </button>
              </div>
            </div>

            {/* All Day Events */}
            <div className="mt-3 space-y-2">
              {weeklyEvents.length > 0 &&
                weeklyEvents[index].map((weekEvent) => {
                  if (!isEventAllDay(weekEvent)) return null;

                  return (
                    <motion.div
                      key={weekEvent.id}
                      style={{
                        color: tailwindBgToHex(weekEvent.color),
                      }}
                      whileHover={{ scale: 1.01, y: -1 }}
                      className={`
                    rounded-2xl border shadow-sm cursor-pointer relative overflow-hidden
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-black/10"
                    }
                  `}
                      onClick={setStateAndPushWindowState(() =>
                        setEvent(weekEvent),
                      )}
                    >
                      <div
                        className={`w-[10px] absolute left-0 top-0 bottom-0 ${weekEvent.color}`}
                      />
                      <div className="flex flex-col h-full px-4 py-3 pl-5">
                        <p className="text-[11px] font-semibold opacity-80">
                          All-day event
                        </p>
                        <p className="text-sm font-semibold leading-snug truncate mt-1">
                          {weekEvent.summary}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Events + Timeline */}
          <div className="relative">
            <div
              ref={(ref) => (dateContainerRefs.current[index] = ref)}
              className="overflow-x-auto scrollbar-hide"
            >
              <div
                ref={containerWidth}
                className={`
              relative flex w-[800vw]
              ${preferences.darkMode ? "bg-[#101010]/30" : "bg-black/[0.015]"}
            `}
              >
                {staticTimes.map((time, timeIndex) => (
                  <motion.div
                    key={time.string}
                    whileTap={{ scale: 0.995 }}
                    className={`
                  relative h-[30vh] w-[200px] flex justify-start items-start px-3 pt-3 text-[11px]
                  border-l first:border-l-0
                  ${
                    preferences.darkMode
                      ? "bg-transparent border-white/10 text-white/55"
                      : "bg-transparent border-black/10 text-slate-500"
                  }
                `}
                  >
                    <p className="font-semibold">{time.string}</p>

                    {/* subtle vertical lane emphasis */}
                    <div
                      className={`
                    absolute top-0 bottom-0 right-0 w-px
                    ${preferences.darkMode ? "bg-white/5" : "bg-black/[0.04]"}
                  `}
                    />
                  </motion.div>
                ))}

                {/* Events */}
                {weeklyEvents.length > 0 &&
                  weeklyEvents[index].map((weekEvent) => {
                    const start = new Date(weekEvent?.start?.startTime);
                    const end = new Date(weekEvent?.end?.endTime);

                    if (isEventAllDay(weekEvent)) return null;

                    return (
                      <motion.div
                        key={weekEvent.id}
                        style={{
                          width: `${calcDayEventWidth(start, end)}px`,
                          left: fromLeft(start),
                          color: tailwindBgToHex(weekEvent.color),
                        }}
                        whileHover={{ scale: 1.015, y: -2 }}
                        className={`
                      absolute top-5 bottom-2 rounded-2xl shadow-lg cursor-pointer overflow-hidden
                      ${weekEvent.color}
                    `}
                        onClick={setStateAndPushWindowState(() =>
                          setEvent(weekEvent),
                        )}
                      >
                        <div className="flex flex-col h-full px-3 py-2">
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

                          <p className="mt-1 text-sm font-semibold leading-snug truncate">
                            {weekEvent.summary}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default WeekView;
