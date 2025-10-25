import { useState, useContext, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BiAlarmSnooze } from "react-icons/bi";
import { motion } from "framer-motion";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import InteractiveContext from "../context/InteractiveContext";
import Reminder from "./Reminder.jsx";

const Reminders = ({ sort, sortOpt, search, searchTxt }) => {
  const { reminders } = useContext(UserContext);
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
              a.title.localeCompare(b.title)
            );
            setRemindersToRender(sortedByTitle);
          }
          break;
        case "important":
          {
            const d = new Date();
            const hourAgo = new Date(d.getTime() - 60 * 60 * 1000);
            const importantReminders = reminders.filter(
              (rem) => new Date(rem.time) >= hourAgo && new Date(rem.time) <= d
            );
            setRemindersToRender(importantReminders);
          }
          break;
        case "event":
          {
            const copy = [...reminders];
            const eventCarryingRems = copy.filter(
              (rem) => rem.eventRefId !== null
            );
            const sortedEventRems = eventCarryingRems.sort((a, b) =>
              a.title.localeCompare(b.title)
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
        rem.title.toLowerCase().includes(searchTxt.toLowerCase())
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
    <motion.div
      className={`${
        remindersToRender.length < 1 ? "" : "grid"
      } grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-5 mt-5`}
    >
      {remindersToRender.length < 1 && (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="w-80 rounded-2xl p-5 shadow-lg my-5 bg-gradient-to-r from-red-300 via-rose-300 to-fuchsia-300 text-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <h2 className="text-lg font-semibold mb-2">
                  No upcoming reminders
                </h2>
                <BiAlarmSnooze className="text-3xl opacity-80" />
              </div>
              <button
                onClick={() => openModalAndSetType()}
                className="text-3xl p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <IoIosAddCircle className="text-white drop-shadow" />
              </button>
            </div>
          </div>
        </div>
      )}
      {remindersToRender.map((r) => (
        <Reminder reminder={r} />
      ))}
    </motion.div>
  );
};

export default Reminders;
