import { useState, useContext, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import Menu from "./Menu";
import LoginLogout from "./LoginLogout";
import Event from "./Event";
import MonthView from "./MonthView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MasonryView from "./MasonryView";
import AgendaView from "./AgendaView";
import DatePicker from "./DatePicker";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import FullDatePicker from "./FullDatePicker";

const Calendar = () => {
  const { events, holidays, reminders, weekDays, preferences } =
    useContext(UserContext);
  const {
    showDatePicker,
    showFullDatePicker,
    view,
    event,
    setShowFullDatePicker,
  } = useContext(InteractiveContext);
  const {
    finish,
    loading,
    theDay,
    openModal,
    dateString,
    setOpenModal,
    setNav,
    string,
    dateObj,
    setTheDay,
  } = useContext(DatesContext);

  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysReminders, setTodaysReminder] = useState([]);
  const [remindersOfDay, setRemindersOfDay] = useState([]);
  const [allDayEvents, setAllDayEvents] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (event || view === "day") {
      const eventsToday = [...events, ...holidays].filter(
        (item) =>
          new Date(item.date).toLocaleDateString() ===
          theDay.toLocaleDateString()
      );
      setTodaysEvents(eventsToday);
    }
  }, [event, view, theDay]);

  useEffect(() => {
    if (string) {
      const eventsForDay = [...events, ...holidays].filter((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        for (
          let currentDate = startDate;
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 1)
        ) {
          if (currentDate.toLocaleDateString() === string) {
            return true;
          }
        }
        return false;
      });
      const fullDayEvents = eventsForDay.filter((event) => {
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
      });
      setAllDayEvents(fullDayEvents);
    }
    const remindersToday = reminders.filter(
      (reminder) =>
        new Date(reminder.time).toLocaleDateString() ===
        theDay.toLocaleDateString()
    );
    const remindersOfTheDay = reminders.filter(
      (r) => new Date(r.time).toLocaleDateString() === string
    );
    setTodaysReminder(remindersToday);
    setRemindersOfDay(remindersOfTheDay);
  }, [theDay, events, reminders, string]);

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
                {view === "day" && (
                  <DayView
                    todaysEvents={todaysEvents}
                    todaysReminders={todaysReminders}
                    containerRef={containerRef}
                  />
                )}
                {view === "week" && <WeekView />}
                {view === "masonry" && (
                  <MasonryView containerRef={containerRef} />
                )}
                {view === "agenda" && <AgendaView />}
              </div>
            </motion.div>
          ) : null}
        </section>
        {showDatePicker && <DatePicker />}
        {showFullDatePicker && (
          <FullDatePicker
            stateSetter={view === "day" ? setDayViewDay : setSecondDateObject}
          />
        )}
        {openModal || event ? (
          <ModalHeader allDayEvents={allDayEvents} />
        ) : null}
        <AnimatePresence>
          {openModal && (
            <Modal
              allDayEvents={allDayEvents}
              todaysReminders={remindersOfDay}
            />
          )}
        </AnimatePresence>
        <Menu />
        <LoginLogout />
        {event && <Event dayEvents={todaysEvents} />}
      </section>
    </main>
  );
};

export default Calendar;
