import { useState, useContext, memo, useEffect } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
import { calendar } from "../motion";
import Modal from "./Modal";
import Menu from "./Menu";
import MonthView from "./MonthView";
import DayView from "./DayView";
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
    theDay,
    openModal,
    diff,
    dateString,
  } = useContext(DatesContext);

  const [todaysEvents, setTodaysEvents] = useState([]);

  useEffect(() => {
    const eventsToday = [...events, ...holidays].filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === theDay.toLocaleDateString()
    );
    setTodaysEvents(eventsToday);
  }, [theDay]);

  const addEvent = (date) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  return (
    <main className="px-2 mt-20">
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
                {view === "month" && <MonthView />}
                {view === "day" && <DayView todaysEvents={todaysEvents} />}
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
