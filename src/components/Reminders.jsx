import React, { useState, useContext, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BiAlarmSnooze, BiCalendarEvent } from "react-icons/bi";
import { BsFillPenFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { deleteReminder } from "../utils/api.js";
import { formatTime } from "../utils/helpers.js";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import InteractiveContext from "../context/InteractiveContext";
import { BsAlarmFill } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";

const Reminders = ({ sort, sortOpt, search, searchTxt }) => {
  const { reminders, setReminders, user, events } = useContext(UserContext);
  const { dateObj, string, setString, setOpenModal } = useContext(DatesContext);
  const { setType, setMenu, setAddNewEvent, setEvent } =
    useContext(InteractiveContext);

  const [remindersToRender, setRemindersToRender] = useState(reminders);
  const [selected, setSelected] = useState([]);
  const [selectable, setSelectable] = useState(false);
  let timeout;

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

  const calcWidth = (time) => {
    if (new Date(time).toLocaleDateString() !== dateObj.toLocaleDateString()) {
      return 0;
    }
    const nowMinutes = dateObj.getMinutes();
    const reminderMinutes = new Date(time).getMinutes();
    const nowHours = dateObj.getHours() * 60;
    const reminderHours = new Date(time).getHours() * 60;
    const reminderTime = reminderMinutes + reminderHours;
    const now = nowMinutes + nowHours;
    const percentage = (now / reminderTime) * 100;
    if (percentage >= 100) {
      return 100;
    }
    return Math.floor(percentage);
  };

  const startTime = (id) => {
    if (selected.length > 1 && selected.includes(id)) {
      return removeSelected(id);
    }
    if (selected.length === 1 && selected.includes(id)) {
      setSelectable(false);
      return removeSelected(id);
    }
    if (selectable === true) {
      return addSelected(id);
    }
    timeout = setTimeout(() => {
      setSelectable(true);
      addSelected(id);
    }, 750);
  };

  const stopTime = (id) => {
    if (selectable === false) {
      clearTimeout(timeout);
    }
  };

  const addSelected = (id) => {
    setSelected((prev) => [...prev, id]);
  };

  const removeSelected = (id) => {
    const newList = selected.filter((item) => item !== id);
    setSelected(newList);
  };

  const deleteAReminder = (id) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      deleteReminder(user.username, id, token)
        .then((res) => {
          const newReminders = reminders.filter(
            (reminder) => reminder.id !== res.data.reminderId
          );
          setReminders(newReminders);
          const newSelected = selected.filter((item) => item.id !== id);
          setSelected(newSelected);
          if (newSelected.length < 1) {
            return setSelectable(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const openRelatedEvent = (eventRefId) => {
    const eventOfReminder = events.filter((event) => event.id === eventRefId);
    setEvent(eventOfReminder[0]);
  };

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
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-5 mt-5">
      {remindersToRender.length < 1 && (
        <div>
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">No Upcoming Reminders</h2>
              <BiAlarmSnooze />
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      )}
      {remindersToRender.map((reminder) => (
        <motion.div
          key={reminder.id}
          animate={
            selected.includes(reminder.id)
              ? {
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(59,130,246,0.4)", // blue glow
                  backgroundColor: "#f0f9ff",
                }
              : {
                  scale: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                }
          }
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className={`${
            new Date(reminder.time) < dateObj
              ? "border-l-4 border-rose-400"
              : new Date(reminder.time).toLocaleDateString() ===
                dateObj.toLocaleDateString()
              ? "border-l-4 border-amber-400"
              : "border-l-4 border-cyan-400"
          } p-4 my-3 rounded-2xl relative text-gray-900`}
          onPointerDown={() => startTime(reminder.id)}
          onPointerUp={() => stopTime(reminder.id)}
          onPointerCancel={() => clearTimeout(timeout)}
        >
          <div className="space-y-3">
            {/* Date Row */}
            <div className="flex justify-between items-center text-sm font-medium text-gray-600">
              <p>
                {new Date(reminder.time).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {reminder.eventRefId ? (
                <BiCalendarEvent className="text-xl text-gray-500" />
              ) : (
                <BiAlarmSnooze className="text-xl text-gray-500" />
              )}
            </div>

            {/* Time + Title */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700">
                  @{" "}
                  {new Date(reminder.time).toLocaleTimeString("en-US", {
                    timeZoneName: "short",
                  })}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BsAlarmFill className="text-gray-400" />
                  <p>{formatTime(new Date(reminder.time))}</p>
                </div>
              </div>

              <div className="flex-1 p-3 bg-gray-50 rounded-xl shadow-inner cursor-pointer">
                <p className="text-base font-semibold">{reminder.title}</p>
              </div>
            </div>

            {/* Notes */}
            {reminder.notes && (
              <div className="p-3 bg-gray-50 rounded-xl shadow-inner flex justify-between items-start text-xs text-gray-600">
                <p className="whitespace-pre-line">
                  {reminder.notes.split(/\|\|\||\n/).map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <BsFillPenFill className="text-gray-400 ml-2 shrink-0" />
              </div>
            )}

            {/* Open Event Button */}
            {reminder.eventRefId && (
              <button
                onClick={() => openRelatedEvent(reminder.eventRefId)}
                className="w-full px-4 py-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors duration-200"
              >
                Open Event
                <MdOpenInNew />
              </button>
            )}
          </div>

          {/* Delete Button */}
          {selected.includes(reminder.id) && (
            <motion.button
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 rounded-lg shadow-md bg-rose-500 text-white text-xs absolute right-2 top-2 hover:bg-rose-600 transition-colors"
              onPointerDown={(e) => {
                e.stopPropagation();
                deleteAReminder(reminder.id);
              }}
            >
              Delete
            </motion.button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Reminders;
