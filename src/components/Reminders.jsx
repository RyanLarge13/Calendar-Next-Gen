import { useState, useContext } from "react";
import { IoIosAlarm } from "react-icons/io";
import { motion } from "framer-motion";
import { deleteReminder } from "../utils/api.js";
import { formatTime } from "../utils/helpers.js";
import UserContext from "../context/UserContext.jsx";

const Reminders = () => {
  const { reminders, setReminders, user } = useContext(UserContext);

  const [selected, setSelected] = useState([]);
  const [selectable, setSelectable] = useState(false);
  let timeout;

  const calcWidth = (time) => {
    if (
      new Date(time).toLocaleDateString() !== new Date().toLocaleDateString()
    ) {
      return 0;
    }
    const nowMinutes = new Date().getMinutes();
    const reminderMinutes = new Date(time).getMinutes();
    const nowHours = new Date().getHours() * 60;
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
          if (selected.length < 1) {
            return setSelectable(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <motion.div
      // initial={{ height: "95vh" }}
      // animate={
      //   showReminders
      //     ? {
      //         height: "95vh",
      //         overflowY: "auto",
      //       }
      //     : { height: "0px", overflowY: "hidden" }
      // }
      className="p-3"
    >
      <div>
        {reminders.map((reminder, index) => (
          <motion.div
            animate={
              selected.includes(reminder.id)
                ? {
                    scaleX: 1.025,
                    scaleY: 1.1,
                    opacity: 0.75,
                    boxShadow: "0 0.25em 0.25em 0 rgba(255,50,50,0.4)",
                  }
                : { scale: 1, opacity: 1, boxShadow: "0 0.1em 0.5em 0 #eee" }
            }
            key={reminder.id}
            className={`${
              new Date(reminder.time) < new Date()
                ? "bg-teal-200"
                : new Date(reminder.time).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                ? ""
                : "bg-slate-200"
            } p-2 relative rounded-md my-5`}
            style={{ fontSize: 11 }}
            onPointerDown={() => startTime(reminder.id)}
            onPointerUp={() => stopTime(reminder.id)}
            onPointerCancel={() => clearTimeout(timeout)}
          >
            <div className="z-50 pointer-events-none text-[9px]">
              <p>{new Date(reminder.time).toLocaleDateString()}</p>
              <p>{new Date(reminder.time).toLocaleTimeString()}</p>
              <p>{formatTime(new Date(reminder.time))}</p>
              <p>{reminder.title}</p>
            </div>
            {selected.includes(reminder.id) && (
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-4 py-1 rounded-md shadow-md bg-rose-400 absolute right-1 top-1"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  deleteAReminder(reminder.id);
                }}
              >
                delete
              </motion.button>
            )}
            <div
              className={`absolute inset-0 rounded-md bg-gradient-to-tr pointer-events-none ${
                calcWidth(reminder.time) < 100
                  ? "from-green-100 to-lime-100"
                  : "from-red-100 to-rose-100"
              } z-[-1]`}
              style={{ width: `${calcWidth(reminder.time)}%` }}
            ></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reminders;
