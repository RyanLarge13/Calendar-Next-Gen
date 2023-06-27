import { useState, useContext, memo } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
import { calendar, calendarBlocks } from "../motion";
import Modal from "./Modal";
import Menu from "./Menu";
import Event from "./Event";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Calendar = () => {
  const { events, holidays, weekDays } = useContext(UserContext);
  const { menu, setMenu, setShowLogin, view } = useContext(InteractiveContext);
  const {
    setOpenModal,
    setString,
    setStart,
    moveCalendar,
    finish,
    loading,
    paddingDays,
    daysInMonth,
    month,
    year,
    theDay, 
    setTheDay, 
    day,
    openModal,
    diff,
    dateString,
    rowDays,
    columnDays,
  } = useContext(DatesContext);

  const [event, setEvent] = useState(null);

  const addEvent = (date) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  const calcDayEventHeight = (start, end) => {
    if (!start || !end) {
      return null;
    } else {
      const hours = new Date(end).getHours();
      const minutes = new Date(end).getMinutes();
      const hourHeight = 10 * hours;
      const minuteHeight = 5 * minutes;
      return hourHeight + minuteHeight;
    }
  };

  return (
    <main className="px-2">
      <section
        onTouchStart={(e) => {
          if (!openModal && !menu && view === "month")
            return setStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (!openModal && !menu && view === "month") return moveCalendar(e);
        }}
        onTouchEnd={() => {
          if (!openModal && !menu && view === "month") return finish();
        }}
      >
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {view === "month" &&
            weekDays.map((day, index) => (
              <p
                key={day}
                className={`${
                  index === new Date().getDay() &&
                  new Date(dateString).getMonth() === new Date().getMonth() &&
                  new Date(dateString).getYear() === new Date().getYear()
                    ? "bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent font-semibold border-b-2 rounded-md"
                    : ""
                } mx-2 text-center`}
              >
                {day.split("")[0]}
              </p>
            ))}
        </div>
        <section>
          {!loading ? (
            <div
              style={{ transform: `translateX(${diff}px)` }}
              className="duration-100"
            >
              <motion.div
                variants={calendar}
                initial="hidden"
                animate="show"
                className={`${
                  view === "month"
                    ? "grid grid-cols-7 gap-1 min-h-[76vh] overflow-hidden"
                    : ""
                }`}
              >
                {view === "month" &&
                  [...Array(paddingDays + daysInMonth)].map((abs, index) => (
                    <motion.div
                      variants={calendarBlocks}
                      onClick={() =>
                        index >= paddingDays &&
                        addEvent(
                          `${month + 1}/${index - paddingDays + 1}/${year}`
                        )
                      }
                      key={index}
                      style={
                        new Date(dateString).getMonth() ===
                          new Date().getMonth() &&
                        new Date(dateString).getYear() === new Date().getYear()
                          ? index === rowDays[0] ||
                            index === rowDays[1] ||
                            index === rowDays[2] ||
                            index === rowDays[3] ||
                            index === rowDays[4] ||
                            index === rowDays[5] ||
                            index === rowDays[6] ||
                            index === columnDays[0] ||
                            index === columnDays[1] ||
                            index === columnDays[2] ||
                            index === columnDays[3] ||
                            index === columnDays[4] ||
                            index === columnDays[5] ||
                            index === columnDays[6]
                            ? { backgroundColor: "rgba(0,0,0,0.1)" }
                            : { backgroundColor: "#fff" }
                          : { backgroundColor: "#fff" }
                      }
                      className={`relative w-full min-h-[12vh] max-h-[15vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 overflow-hidden cursor-pointer ${
                        index - paddingDays + 1 === day &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear() &&
                        "shadow-cyan-400 shadow-md"
                      }`}
                    >
                      <div
                        className={`text-center text-sm my-1 ${
                          index - paddingDays + 1 === day &&
                          month === new Date().getMonth() &&
                          year === new Date().getFullYear() &&
                          "w-[25px] h-[25px] rounded-full bg-cyan-100 shadow-sm"
                        }`}
                      >
                        <p>{index >= paddingDays && index - paddingDays + 1}</p>
                      </div>
                      <div className="w-full overflow-y-hidden absolute inset-0 pt-8">
                        {[...events, ...holidays].map(
                          (event) =>
                            new Date(event.date).toLocaleDateString() ===
                              `${month + 1}/${
                                index - paddingDays + 1
                              }/${year}` && (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: -50 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: {
                                    delay: 0.8,
                                    type: "spring",
                                    stiffness: 200,
                                  },
                                }}
                                className={`rounded-lg ${event.color} shadow-md p-1 w-[95%] my-1 mx-auto`}
                              >
                                <p
                                  className={`whitespace-nowrap text-xs overflow-hidden ${
                                    event.color === "bg-black"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {event.summary}
                                </p>
                              </motion.div>
                            )
                        )}
                      </div>
                    </motion.div>
                  ))}
                {view === "day" && (
                  <div className="text-sm">
                    <div className="mt-10">
                      {[...events, ...holidays].map(
                        (event) =>
                          new Date(event.date).toLocaleDateString() ===
                            theDay.toLocaleDateString() && (
                            <div
                              key={event.id}
                              style={{
                                height: `${calcDayEventHeight(
                                  event.start.startTime,
                                  event.end.endTime
                                )}px`,
                              }}
                              onClick={() => setEvent(event)}
                              className={`${event.color} bg-opacity-70 p-5 rounded-md shadow-md my-5`}
                            >
                              <p className="font-bold">{event.summary}</p>
                              <p className="mr-5 text-sm">
                                {event.description}
                              </p>
                            </div>
                          )
                      )}
                    </div>
                    {event && (
                      <Event
                        event={event}
                        setEvent={setEvent}
                        dayEvents={events.filter(
                          (e) => new Date(e.date) === new Date()
                        )}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <Dna
                visible={loading}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
        </section>
        <Modal />
        <Menu />
      </section>
    </main>
  );
};

export default memo(Calendar);
