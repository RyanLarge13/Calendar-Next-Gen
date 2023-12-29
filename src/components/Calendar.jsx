import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
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
  const { events, holidays, reminders, weekDays } = useContext(UserContext);
  const { showDatePicker, showFullDatePicker, view, event } =
    useContext(InteractiveContext);
  const { finish, loading, theDay, dateString, dateObj } =
    useContext(DatesContext);

  const [todaysEvents, setTodaysEvents] = useState([]);
  const [todaysReminders, setTodaysReminder] = useState([]);

  useEffect(() => {
    const eventsToday = [...events, ...holidays].filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === theDay.toLocaleDateString()
    );
    const remindersToday = reminders.filter(
      (reminder) =>
        new Date(reminder.time).toLocaleDateString() ===
        theDay.toLocaleDateString()
    );
    setTodaysEvents(eventsToday);
    setTodaysReminder(remindersToday);
  }, [theDay, events, reminders]);

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
        <LoginLogout />
        {event && <Event />}
      </section>
      <Outlet />
    </main>
  );
};

export default Calendar;
