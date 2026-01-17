import { useContext, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import {
  updateReminderComplete,
  updateReminderNotes,
  updateReminderTitle,
  deleteReminder,
} from "../utils/api";
import { motion } from "framer-motion";
import { BsAlarmFill } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";
import { formatTime } from "../utils/helpers.js";
import { BiAlarmSnooze, BiCalendarEvent } from "react-icons/bi";
import InteractiveContext from "../context/InteractiveContext.jsx";
import DatesContext from "../context/DatesContext.jsx";

const Reminder = ({ reminder }) => {
  const {
    reminders = [],
    events = [],
    setReminders,
    user,
  } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);

  const [originalReminderNote, setOriginalReminderNote] = useState(
    reminder.notes
  );
  const [originalReminderTitle, setOriginalReminderTitle] = useState(
    reminder.title
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
        })
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
            (reminder) => reminder.id !== res.data.reminderId
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
      onPointerCancel={() => clearTimeout(timeout.current)}
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
          <button
            onClick={() =>
              toggleComplete({
                completed: !reminder.completed,
                reminderId: reminder.id,
              })
            }
            className={`shadow-inner p-2 rounded-full bg-gradient-to-tr hover:shadow-lg duration-200 hover:from-sky-100 ${
              reminder.completed
                ? "from-cyan-300 to-sky-100"
                : "from-white to-slate-100"
            }`}
          >
            {reminder.eventRefId ? (
              <BiCalendarEvent className="text-xl text-gray-500" />
            ) : (
              <BiAlarmSnooze className="text-xl text-gray-500" />
            )}
          </button>
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

          <input
            className="flex-1 p-3 bg-gray-50 rounded-xl shadow-inner cursor-pointer text-base font-semibold"
            placeholder="Create a title"
            value={reminderTitle}
            onChange={(e) => setReminderTitle(e.target.value)}
            onBlur={saveReminderTitle}
          />
        </div>

        {/* Notes */}
        {reminder.notes && (
          <input
            className="p-3 bg-gray-50 rounded-xl shadow-inner text-xs text-gray-600"
            placeholder="Write a note..."
            value={reminderNote}
            onChange={(e) => setReminderNote(e.target.value)}
            onBlur={saveReminderNote}
          />
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
  );
};

export default Reminder;
