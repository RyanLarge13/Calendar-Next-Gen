import { useContext } from "react";
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
  } = useContext(DatesContext);

  const addEvent = (date) => {
    setOpenModal(true);
    setString(date);
  };

  return (
    <main className="px-2">
      <section
        onTouchStart={(e) => setStart(e.touches[0].clientX)}
        onTouchMove={(e) => moveCalendar(e)}
        onTouchEnd={(e) => finish()}
      >
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {weekDays.map((day) => (
            <p key={day} className="mx-2 text-center">
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
                className="grid grid-cols-7 gap-1 h-[78vh]"
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
                    className={`w-full min-h-[12vh] max-h-[12vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start overflow-hidden cursor-pointer ${
                      index - paddingDays + 1 === day &&
                      month === new Date().getMonth() &&
                      year === new Date().getFullYear() &&
                      "shadow-green-400 shadow-md"
                    }`}
                  >
                    <div
                      className={`text-center text-sm my-1 ${
                        index - paddingDays + 1 === day &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear() &&
                        "w-[25px] h-[25px] rounded-full bg-green-100 shadow-sm"
                      }`}
                    >
                      <p>{index >= paddingDays && index - paddingDays + 1}</p>
                    </div>
                    {[...events, ...holidays].map(
                      (event) =>
                        new Date(event.date).toLocaleDateString() ===
                          `${month + 1}/${index - paddingDays + 1}/${year}` && (
                          <motion.div
                            key={event.userId}
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
                              {event.event}
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

export default Calendar;
