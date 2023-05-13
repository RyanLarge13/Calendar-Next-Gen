import { useContext, memo } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
import { calendar, calendarBlocks } from "../motion";
import Modal from "./Modal";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";

const Calendar = () => {
  const { events, holidays, weekDays } = useContext(UserContext);
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
    day,
    openModal,
    diff,
    dateString,
    dayOfWeekDays,
    rowDays,
  } = useContext(DatesContext);

  const addEvent = (date) => {
    setOpenModal(true);
    setString(date);
  };

  return (
    <main className="px-2">
      <section
        onTouchStart={(e) => !openModal && setStart(e.touches[0].clientX)}
        onTouchMove={(e) => !openModal && moveCalendar(e)}
        onTouchEnd={(e) => !openModal && finish()}
      >
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {weekDays.map((day, index) => (
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
              className="duration-200"
            >
              <motion.div
                variants={calendar}
                initial="hidden"
                animate="show"
                className="grid grid-cols-7 gap-1 h-[76vh] overflow-hidden"
              >
                {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
                  <motion.div
                    variants={calendarBlocks}
                    onClick={() =>
                      index >= paddingDays &&
                      addEvent(
                        `${month + 1}/${index - paddingDays + 1}/${year}`
                      )
                    }
                    key={index}
                    className={`${
                      new Date(dateString).getMonth() ===
                        new Date().getMonth() &&
                      new Date(dateString).getYear() === new Date().getYear()
                        ? index === dayOfWeekDays[0] ||
                          index === dayOfWeekDays[1] ||
                          index === dayOfWeekDays[2] ||
                          index === dayOfWeekDays[3] ||
                          index === dayOfWeekDays[4] ||
                          index === dayOfWeekDays[5]
                          ? "bg-slate-100"
                          : "bg-white"
                        : "bg-white"
                    } ${
                      new Date(dateString).getMonth() ===
                        new Date().getMonth() &&
                      new Date(dateString).getYear() === new Date().getYear()
                        ? index === rowDays[0] ||
                          index === rowDays[1] ||
                          index === rowDays[2] ||
                          index === rowDays[3] ||
                          index === rowDays[4] ||
                          index === rowDays[5] ||
                          index === rowDays[6]
                          ? "bg-slate-100"
                          : "bg-white"
                        : "bg-white"
                    } w-full min-h-[12vh] max-h-[15vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start overflow-hidden cursor-pointer ${
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
                    {[...events, ...holidays].map(
                      (event) =>
                        new Date(event.date).toLocaleDateString() ===
                          `${month + 1}/${index - paddingDays + 1}/${year}` && (
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
                            className={`rounded-lg ${event.color} shadow-md px-2 py-1 mx-2 my-1 w-full`}
                          >
                            <p className="whitespace-nowrap text-xs">
                              {event.summary}
                            </p>
                          </motion.div>
                        )
                    )}
                  </motion.div>
                ))}
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
        {openModal && <Modal />}
      </section>
    </main>
  );
};

export default memo(Calendar);
