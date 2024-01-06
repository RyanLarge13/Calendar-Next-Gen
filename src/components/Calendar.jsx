import { useState, useContext, useEffect } from "react";
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
  const { showDatePicker, showFullDatePicker, view, event } =
    useContext(InteractiveContext);
  const { finish, loading, theDay, openModal, dateString, string, dateObj } =
    useContext(DatesContext);

  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysReminders, setTodaysReminder] = useState([]);
  const [allDayEvents, setAllDayEvents] = useState([]);

  useEffect(() => {
    const eventsToday = [...events, ...holidays].filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === theDay.toLocaleDateString()
    );
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
            return true; // Event includes the 'string' date
          }
        }
        return false; // Event does not include the 'string' date
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
    setTodaysEvents(eventsToday);
    const remindersToday = reminders.filter(
      (reminder) =>
        new Date(reminder.time).toLocaleDateString() ===
        theDay.toLocaleDateString()
    );
    setTodaysReminder(remindersToday);
  }, [theDay, events, reminders, string]);

  return (
    <main
      className={`px-2 pt-[65px] h-screen overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
    >
      <section>
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {view === "month" &&
            weekDays.map((day, index) => (
              <p
                key={day}
                className={`${
                  preferences.darkMode ? "text-white" : "text-black"
                } ${
                  index === new Date().getDay() &&
                  new Date(dateString).getMonth() === dateObj.getMonth() &&
                  new Date(dateString).getYear() === dateObj.getYear()
                    ? "text-cyan-300 font-semibold border-b-2 rounded-md"
                    : ""
                } mx-2 text-center`}
              >
                {day.split("")[0]}
              </p>
            ))}
        </div>
        <section>
          {!loading ? (
            <motion.div
              drag={view === "month" && "x"}
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
                  />
                )}
                {view === "week" && <WeekView />}
                {view === "masonry" && <MasonryView />}
                {view === "agenda" && <AgendaView />}
              </div>
            </motion.div>
          ) : (
            <></>
          )}
        </section>
        {showDatePicker && <DatePicker />}
        {showFullDatePicker && <FullDatePicker />}
        {openModal || event ? (
          <ModalHeader allDayEvents={allDayEvents} />
        ) : null}
        <AnimatePresence>{openModal && <Modal />}</AnimatePresence>
        <Menu />
        <LoginLogout />
        {event && <Event dayEvents={todaysEvents} />}
      </section>
    </main>
  );
};

export default Calendar;
