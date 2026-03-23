import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { weekDays } from "../../constants/dateAndTimeConstants";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import AgendaView from "../CalendarViews/AgendaView";
import DayView from "../CalendarViews/DayView";
import MasonryView from "../CalendarViews/MasonryView";
import MonthView from "../CalendarViews/MonthView";
import WeekView from "../CalendarViews/WeekView";
import DatePicker from "../DatePickers/DatePicker";
import FullDatePicker from "../DatePickers/FullDatePicker";
import Event from "../Events/Event";
import LoginLogout from "../UserModal/LoginLogout/LoginLogout";
import Menu from "../Menu/Menu";
import Modal from "../Modal/Modal";
import ModalHeader from "../Modal/ModalHeader";

const Calendar = () => {
  const { preferences } = useContext(UserContext);
  const { showFullDatePicker, view, setShowFullDatePicker } =
    useContext(InteractiveContext);
  const { loading, setOpenModal, setNav, setTheDay } = useContext(DatesContext);

  const containerRef = useRef(null);

  const checkScroll = (e) => {
    if (view !== "month") {
      return;
    }
    const offset = e.deltaY;
    if (offset > 0) {
      setNav((prev) => prev + 1);
      return;
    } else if (offset < 0) {
      setNav((prev) => prev - 1);
      return;
    }
  };

  const setSecondDateObject = (newString) => {
    setSecondString(newString);
    setShowFullDatePicker(false);
    setOpenModal(true);
    setType("event");
    setAddNewEvent(true);
  };

  const setDayViewDay = (newString) => {
    setTheDay(new Date(newString));
    setShowFullDatePicker(false);
  };

  const finish = (e, info) => {
    const dragDistance = info.offset.x;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setNav((prev) => prev - 1);
    } else if (dragDistance < -cancelThreshold) {
      setNav((prev) => prev + 1);
    }
  };

  return (
    <main
      ref={containerRef}
      className={`px-2 pt-[65px] h-screen overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
    >
      <section>
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {view === "month" &&
            weekDays.map((day) => (
              <p
                key={day}
                className={`${
                  preferences.darkMode ? "text-white" : "text-black"
                } mx-2 text-center font-bold`}
              >
                {day.split("")[0]}
              </p>
            ))}
        </div>
        <section>
          {!loading ? (
            <motion.div
              drag={view === "month" && "x"}
              onWheel={checkScroll}
              dragSnapToOrigin={true}
              dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
              onDragEnd={(e, info) => finish(e, info)}
              className="will-change-transform"
            >
              <div>
                {view === "month" && <MonthView />}
                {view === "day" && <DayView containerRef={containerRef} />}
                {view === "week" && <WeekView />}
                {view === "masonry" && (
                  <MasonryView containerRef={containerRef} />
                )}
                {view === "agenda" && <AgendaView />}
              </div>
            </motion.div>
          ) : null}
        </section>
        <DatePicker />
        {showFullDatePicker && (
          <FullDatePicker
            stateSetter={view === "day" ? setDayViewDay : setSecondDateObject}
          />
        )}
        <ModalHeader />
        <AnimatePresence>
          <Modal />
        </AnimatePresence>
        <Menu />
        <LoginLogout />
        <Event />
      </section>
    </main>
  );
};

export default Calendar;
