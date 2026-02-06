import { useContext, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import {
  updateReminderComplete,
  updateReminderNotes,
  updateReminderTitle,
  deleteReminder,
} from "../utils/api";
import { motion } from "framer-motion";
import { BsAlarmFill, BsTrashFill } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";
import { formatTime } from "../utils/helpers.js";
import { BiAlarmSnooze, BiCalendarEvent } from "react-icons/bi";
import InteractiveContext from "../context/InteractiveContext.jsx";
import DatesContext from "../context/DatesContext.jsx";

const Reminder = ({ reminder, showOpenEvent = true }) => {
  const {
    reminders = [],
    events = [],
    setReminders,
    user,
    preferences,
  } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);

  const [originalReminderNote, setOriginalReminderNote] = useState(
    reminder.notes,
  );
  const [originalReminderTitle, setOriginalReminderTitle] = useState(
    reminder.title,
  );
  const [reminderNote, setReminderNote] = useState(reminder.notes);
  const [reminderTitle, setReminderTitle] = useState(reminder.title);
  const [selected, setSelected] = useState([]);
  const [selectable, setSelectable] = useState(false);
  let timeout = useRef(null);

  const saveReminderNote = async () => {
    if (originalReminderNote === reminderNote) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await updateReminderNotes(reminder.id, reminderNote, token);

      setOriginalReminderNote(reminderNote);

      setReminders((prev) =>
        prev.map((r) => {
          if (r.id === reminder.id) {
            return { ...r, notes: reminderNote };
          } else {
            return r;
          }
        }),
      );
    } catch (err) {
      console.log("Error trying to update reminder note");
      console.log(err);
    }
  };

  const saveReminderTitle = async () => {
    if (originalReminderTitle === reminderTitle) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await updateReminderTitle(reminder.id, reminderTitle, token);

      setReminders((prev) => {
        prev.map((r) => {
          if (r.id === reminder.id) {
            return { ...r, title: reminderTitle };
          } else {
            return r;
          }
        });
      });
    } catch (err) {
      console.log("Error trying to update reminder title");
      console.log(err);
    }
  };

  const toggleComplete = async (reminderInfo) => {
    const token = localStorage.getItem("authToken");
    try {
      await updateReminderComplete(reminderInfo, token);

      const newReminders = reminders.map((r) => {
        if (r.id === reminderInfo.reminderId) {
          return {
            ...r,
            completed: reminderInfo.completed,
          };
        } else {
          return r;
        }
      });

      setReminders(newReminders);
    } catch (err) {
      console.log(err);
    }
  };

  // const calcWidth = (time) => {
  //   if (new Date(time).toLocaleDateString() !== dateObj.toLocaleDateString()) {
  //     return 0;
  //   }
  //   const nowMinutes = dateObj.getMinutes();
  //   const reminderMinutes = new Date(time).getMinutes();
  //   const nowHours = dateObj.getHours() * 60;
  //   const reminderHours = new Date(time).getHours() * 60;
  //   const reminderTime = reminderMinutes + reminderHours;
  //   const now = nowMinutes + nowHours;
  //   const percentage = (now / reminderTime) * 100;
  //   if (percentage >= 100) {
  //     return 100;
  //   }
  //   return Math.floor(percentage);
  // };

  const openRelatedEvent = (eventRefId) => {
    const eventOfReminder = events.filter((event) => event.id === eventRefId);
    setEvent(eventOfReminder[0]);
  };

  const addSelected = (id) => {
    setSelected((prev) => [...prev, id]);
  };

  const removeSelected = (id) => {
    const newList = selected.filter((item) => item !== id);
    setSelected(newList);
  };

  const stopTime = (id) => {
    if (selectable === false) {
      clearTimeout(timeout.current);
    }
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
    timeout.current = setTimeout(() => {
      setSelectable(true);
      addSelected(id);
    }, 750);
  };

  const deleteAReminder = (id) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      deleteReminder(user.username, id, token)
        .then((res) => {
          const newReminders = reminders.filter(
            (reminder) => reminder.id !== res.data.reminderId,
          );
          setReminders(newReminders);
          const newSelected = selected.filter((itemId) => itemId !== id);
          setSelected(newSelected);
          if (newSelected.length < 1) {
            return setSelectable(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <motion.div
      key={reminder.id}
      animate={
        selected.includes(reminder.id)
          ? {
              scale: 1.02,
              boxShadow: "0 18px 55px rgba(0,0,0,0.16)",
            }
          : {
              scale: 1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
            }
      }
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`
    relative my-4 rounded-3xl border overflow-hidden
    backdrop-blur-md
    ${preferences.darkMode ? "bg-white/5 border-white/10 text-white" : "bg-white/85 border-black/10 text-slate-900"}
  `}
      onPointerDown={() => startTime(reminder.id)}
      onPointerUp={() => stopTime(reminder.id)}
      onPointerCancel={() => clearTimeout(timeout.current)}
    >
      {/* Left status rail */}
      <div
        className={`
      absolute left-0 top-0 bottom-0 w-[10px]
      ${
        new Date(reminder.time) < dateObj
          ? "bg-gradient-to-b from-rose-400 to-pink-400"
          : new Date(reminder.time).toLocaleDateString() ===
              dateObj.toLocaleDateString()
            ? "bg-gradient-to-b from-amber-400 to-orange-300"
            : "bg-gradient-to-b from-cyan-400 to-sky-400"
      }
    `}
      />

      <div className="px-5 py-4">
        {/* Top row: date + complete toggle */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p
              className={`text-xs font-semibold tracking-wide ${
                preferences.darkMode ? "text-white/60" : "text-slate-500"
              }`}
            >
              {new Date(reminder.time).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex flex-col">
                <p
                  className={`text-sm font-semibold ${preferences.darkMode ? "text-white/80" : "text-slate-700"}`}
                >
                  @{" "}
                  {new Date(reminder.time).toLocaleTimeString("en-US", {
                    timeZoneName: "short",
                  })}
                </p>

                <div
                  className={`mt-1 flex items-center gap-1 text-xs ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
                >
                  <BsAlarmFill
                    className={`${preferences.darkMode ? "text-white/40" : "text-slate-400"}`}
                  />
                  <p>{formatTime(new Date(reminder.time))}</p>
                </div>
              </div>
            </div>
          </div>

          {selected.includes(reminder.id) ? null : (
            <button
              onClick={() =>
                toggleComplete({
                  completed: !reminder.completed,
                  reminderId: reminder.id,
                })
              }
              className={`
          grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition active:scale-95
          ${
            reminder.completed
              ? preferences.darkMode
                ? "bg-cyan-500/20 border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/25"
                : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
              : preferences.darkMode
                ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.06]"
          }
        `}
              aria-label={
                reminder.completed ? "Mark incomplete" : "Mark complete"
              }
              type="button"
            >
              {reminder.eventRefId ? (
                <BiCalendarEvent className="text-lg" />
              ) : (
                <BiAlarmSnooze className="text-lg" />
              )}
            </button>
          )}
        </div>

        {/* Title field */}
        <div className="mt-4">
          <input
            className={`
          w-full px-4 py-3 rounded-2xl border shadow-inner transition
          text-sm font-semibold
          outline-none focus:outline-none
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 placeholder:text-white/35 text-white/90 focus:bg-white/10"
              : "bg-black/[0.03] border-black/10 placeholder:text-slate-400 text-slate-900 focus:bg-black/[0.05]"
          }
        `}
            placeholder="Create a title"
            value={reminderTitle}
            onChange={(e) => setReminderTitle(e.target.value)}
            onBlur={saveReminderTitle}
          />
        </div>

        {/* Notes field */}
        <div className="mt-3">
          <input
            className={`
          w-full px-4 py-3 rounded-2xl border shadow-inner transition
          text-xs font-semibold
          outline-none focus:outline-none
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 placeholder:text-white/35 text-white/75 focus:bg-white/10"
              : "bg-black/[0.03] border-black/10 placeholder:text-slate-400 text-slate-700 focus:bg-black/[0.05]"
          }
        `}
            placeholder="Write a note..."
            value={reminderNote}
            onChange={(e) => setReminderNote(e.target.value)}
            onBlur={saveReminderNote}
          />
        </div>

        {/* Open event */}
        {reminder.eventRefId && showOpenEvent ? (
          <button
            onClick={() => openRelatedEvent(reminder.eventRefId)}
            className={`
          mt-4 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-white
          shadow-md transition active:scale-[0.97]
          bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
          flex items-center justify-center gap-2
        `}
            type="button"
          >
            Open Event <MdOpenInNew />
          </button>
        ) : null}
      </div>

      {/* Selected “tools” overlay */}
      {selected.includes(reminder.id) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 right-3 flex items-center gap-2"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`
          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-200"
              : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-600"
          }
        `}
            onPointerDown={(e) => {
              e.stopPropagation();
              deleteAReminder(reminder.id);
            }}
            aria-label="Delete reminder"
            type="button"
          >
            <BsTrashFill className="text-sm" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Reminder;
