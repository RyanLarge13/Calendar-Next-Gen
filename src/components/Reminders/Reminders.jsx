import { useState, useContext, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BiAlarmSnooze } from "react-icons/bi";
import { motion } from "framer-motion";
import UserContext from "../../context/UserContext.jsx";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import Reminder from "./Reminder.jsx";

const Reminders = ({ sort, sortOpt, search, searchTxt }) => {
  const { reminders, preferences } = useContext(UserContext);
  const { dateObj, string, setString, setOpenModal } = useContext(DatesContext);
  const { setType, setMenu, setAddNewEvent } = useContext(InteractiveContext);

  const [remindersToRender, setRemindersToRender] = useState(reminders);

  useEffect(() => {
    if (sort && sortOpt) {
      const now = new Date();
      const d = new Date();
      const startOfDay = d.setHours(0, 0, 0, 0);
      switch (sortOpt) {
        case "title":
          {
            const copy = [...reminders];
            const sortedByTitle = copy.sort((a, b) =>
              a.title.localeCompare(b.title),
            );
            setRemindersToRender(sortedByTitle);
          }
          break;
        case "important":
          {
            const d = new Date();
            const hourAgo = new Date(d.getTime() - 60 * 60 * 1000);
            const importantReminders = reminders.filter(
              (rem) => new Date(rem.time) >= hourAgo && new Date(rem.time) <= d,
            );
            setRemindersToRender(importantReminders);
          }
          break;
        case "event":
          {
            const copy = [...reminders];
            const eventCarryingRems = copy.filter(
              (rem) => rem.eventRefId !== null,
            );
            const sortedEventRems = eventCarryingRems.sort((a, b) =>
              a.title.localeCompare(b.title),
            );
            setRemindersToRender(sortedEventRems);
          }
          break;
        case "today":
          {
            const dayAhead = new Date();
            dayAhead.setTime(23, 59, 59, 999);
            const todaysRems = reminders.filter((rem) => {
              const remTime = new Date(rem.time);
              return remTime >= startOfDay && remTime <= dayAhead;
            });
            setRemindersToRender(todaysRems);
          }
          break;
        case "tomorrow":
          {
            const midnight = new Date(startOfDay);
            const midnightTomorrow = new Date(midnight);
            midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
            const endOfTomorrow = new Date(midnightTomorrow);
            endOfTomorrow.setHours(23, 59, 59, 999);
            const tomorrowsRems = reminders.filter((rem) => {
              const remTime = new Date(rem.time);
              return remTime >= midnightTomorrow && remTime <= endOfTomorrow;
            });
            setRemindersToRender(tomorrowsRems);
          }
          break;
        case "month":
          {
            const monthAhead = new Date(now.getMonth() + 1);
            const monthRems = reminders.filter((rem) => {
              const remTime = new Date(rem.time);
              return remTime <= monthAhead && remTime >= d;
            });
            setRemindersToRender(monthRems);
          }
          break;
        case "week":
          {
            const weekAhead = new Date(startOfDay);
            weekAhead.setDate(now.getDate() + 7);
            const weekRems = reminders.filter((rem) => {
              const remTime = new Date(rem.time);
              return remTime <= weekAhead && remTime >= now;
            });
            setRemindersToRender(weekRems);
          }
          break;
        case "past":
          {
            const pastRems = reminders.filter((rem) => {
              const remTime = new Date(rem.time);
              return remTime < now;
            });
            setRemindersToRender(pastRems);
          }
          break;
        default:
          setRemindersToRender(reminders);
      }
    } else {
      setRemindersToRender(reminders);
    }
  }, [sort, sortOpt, reminders]);

  useEffect(() => {
    if (search && searchTxt) {
      const filteredReminders = reminders.filter((rem) =>
        rem.title.toLowerCase().includes(searchTxt.toLowerCase()),
      );
      setRemindersToRender(filteredReminders);
    } else {
      setRemindersToRender(reminders);
    }
  }, [search, searchTxt]);

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("reminder");
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  return (
    <motion.div className="mt-6 px-3 sm:px-6">
      {/* Center container to prevent "stretching across the universe" */}
      <div className="mx-auto max-w-6xl">
        {remindersToRender.length < 1 ? (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-rose-500/15 border-rose-300/20 text-rose-100" : "bg-rose-50 border-rose-200 text-rose-700"}
                `}
                  >
                    <BiAlarmSnooze className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No upcoming reminders
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Create one and we’ll keep you on track.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModalAndSetType()}
                  className={`
                grid place-items-center h-11 w-11 rounded-2xl border shadow-md transition
                hover:scale-[1.02] active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/10 border-white/10 hover:bg-white/15 text-white" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"}
              `}
                  aria-label="Add reminder"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
          gap-4 sm:gap-5
        `}
          >
            {remindersToRender.map((r) => (
              <Reminder
                reminder={r}
                key={r.id || r._id || r.time || JSON.stringify(r)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reminders;
