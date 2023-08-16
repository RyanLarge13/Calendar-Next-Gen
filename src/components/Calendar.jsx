import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Dna } from "react-loader-spinner";
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
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Calendar = () => {
  const { events, holidays, reminders, weekDays } = useContext(UserContext);
  const { menu, view, event } = useContext(InteractiveContext);
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
      const eventsForDay = [...events, ...holidays].filter(
        (event) => new Date(event.date).toLocaleDateString() === string
      );
      const fullDayEvents = eventsForDay.filter(
        (event) =>
          new Date(event.end.endTime).getHours() -
            new Date(event.start.startTime).getHours() >=
            24 ||
          event.end.endTime === null ||
          event.start.startTime === null
      );
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
    <main className="px-2 mt-20">
      <section>
        <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
          {view === "month" &&
            weekDays.map((day, index) => (
              <p
                key={day}
                className={`${
                  index === new Date().getDay() &&
                  new Date(dateString).getMonth() === dateObj.getMonth() &&
                  new Date(dateString).getYear() === dateObj.getYear()
                    ? "bg-cyan-400 bg-clip-text text-transparent font-semibold border-b-2 rounded-md"
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
        {openModal && <ModalHeader allDayEvents={allDayEvents} />}
        <Modal />
        <Menu />
        <LoginLogout />
        {event && <Event dayEvents={todaysEvents} />}
      </section>
    </main>
  );
};

export default Calendar;
