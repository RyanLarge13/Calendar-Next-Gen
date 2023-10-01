import React, { useState, useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BiAlarmSnooze } from "react-icons/bi";
import { BsFillPenFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { deleteReminder } from "../utils/api.js";
import { formatTime } from "../utils/helpers.js";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import InteractiveContext from "../context/InteractiveContext";
import { BsAlarmFill } from "react-icons/bs";

const Reminders = () => {
  const { reminders, setReminders, user } = useContext(UserContext);
  const { dateObj, string, setString, setOpenModal } = useContext(DatesContext);
  const { setType, setMenu, setAddNewEvent } = useContext(InteractiveContext);

  const [selected, setSelected] = useState([]);
  const [selectable, setSelectable] = useState(false);
  let timeout;

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
          if (selected.length < 1) {
            return setSelectable(false);
          }
        })
        .catch((err) => console.log(err));
    }
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
    <motion.div className="p-3">
      {reminders.length < 1 && (
        <div>
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">No Upcomming Reminders</h2>
              <BiAlarmSnooze />
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      )}
      <div>
        {reminders.map((reminder) => (
          <motion.div
            animate={
              selected.includes(reminder.id)
                ? {
                    scaleX: 1.025,
                    scaleY: 1.1,
                    opacity: 0.75,
                    boxShadow: "0 0.25em 0.25em 0 rgba(255,50,50,0.4)",
                    backgroundColor: "#eee",
                  }
                : { scale: 1, opacity: 1, boxShadow: "0 0.1em 0.5em 0 #eee" }
            }
            key={reminder.id}
            className={`${
              new Date(reminder.time) < dateObj
                ? "bg-teal-200"
                : new Date(reminder.time).toLocaleDateString() ===
                  dateObj.toLocaleDateString()
                ? ""
                : "bg-slate-200"
            } p-2 relative rounded-md my-5`}
            style={{ fontSize: 11 }}
            onPointerDown={() => startTime(reminder.id)}
            onPointerUp={() => stopTime(reminder.id)}
            onPointerCancel={() => clearTimeout(timeout)}
          >
            <div className="z-50 pointer-events-none text-[9px]">
              <p className="font-semibold bg-white bg-opacity-70 p-2 rounded-md shadow-sm mb-2">
                {new Date(reminder.time).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="pl-1">
                <div className="flex justify-start gap-x-2 items-center">
                  <div>
                    <p className="font-semibold">
                      @{" "}
                      {new Date(reminder.time).toLocaleTimeString("en-US", {
                        timeZoneName: "short",
                      })}
                    </p>
                    <div className="flex justify-start gap-x-1 items-center">
                      <BsAlarmFill />
                      <p>{formatTime(new Date(reminder.time))}</p>
                    </div>
                  </div>
                  <div className="p-2 ml-1 bg-white bg-opacity-75 rounded-md shadow-sm flex-1 cursor-pointer">
                    <p className="text-lg mt-1">{reminder.title}</p>
                  </div>
                </div>
              </div>
              {reminder.notes && (
                <div className="mt-2 p-2 rounded-md shadow-sm bg-white bg-opacity-75 flex justify-between items-center">
                  <p className="text-xs">
                    {reminder.notes.split(/\|\|\||\n/).map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                  <BsFillPenFill />
                </div>
              )}
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
