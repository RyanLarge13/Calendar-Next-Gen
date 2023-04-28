import { useState, useEffect, useContext } from "react";
import EventsContext from "../context/events";
import { motion } from "framer-motion";
import { colors } from "../constants";
import { v4 as uuidv4 } from "uuid";
import Toggle from "./Toggle";
import Color from "./Color";
import TimeSetter from "./TimeSetter";

const AddEvent = ({ setAddNewEvent, selectedDate, setModal }) => {
  const { events, setEvents } = useContext(EventsContext);

  const [eventText, setEventText] = useState("");
  const [color, setColor] = useState(null);
  const [repeat, setRepeat] = useState(false);
  const [howOften, setHowOften] = useState(null);
  const [time, setTime] = useState(false);
  const [timeDateString, setTimeDateString] = useState(null);
  const [timeNotifDate, setTimeNotifDate] = useState(null);
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);

  useEffect(() => {
    if (!repeat) setHowOften(null);
    if (!time) {
      setTimeDateString(null);
      setTimeNotifDate(null);
    }
    if (!reminder) {
      setReminderTime(null);
    }
  }, [repeat, time, reminder]);

  useEffect(() => {
    if (howOften === 35) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      setHowOften(daysInMonth);
    }
  }, [howOften]);

  const addEvent = () => {
    if (repeat) return createRepeats();
    const newEvent = {
      id: uuidv4(),
      event: eventText,
      date: selectedDate,
      color: color ? color : "bg-white",
      repeat,
      time: {
        time,
        timeDateString,
        timeNotifDate,
      },
      reminder: {
        reminder,
        when: reminder
          ? reminderTime < 60
            ? `${reminderTime}min prior`
            : `1hour prior`
          : "",
      },
    };
    if (events.length > 0) {
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      setEventText("");
      setEvents(JSON.parse(localStorage.getItem("events")));
      setModal(false);
    } else {
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      setEventText("");
      setEvents(JSON.parse(localStorage.getItem("events")));
      setModal(false);
    }
  };

  const createRepeats = () => {
    if (howOften > 27 && howOften < 32) return setMonthlyDates();
    if (howOften === 365) return setYearlyDates();
    let dayInterval = Number(selectedDate.split("/")[1]);
    let monthInterval = Number(selectedDate.split("/")[0]);
    let yearInterval = Number(selectedDate.split("/")[2]);
    for (let i = 0; i < 100; i++) {
      let daysInMonth = new Date(yearInterval, monthInterval, 0).getDate();
      if (dayInterval > daysInMonth) {
        monthInterval += 1;
        dayInterval -= daysInMonth;
      }
      if (monthInterval > 12) {
        monthInterval = 1;
        yearInterval += 1;
      }
      const newEvent = {
        id: uuidv4(),
        event: eventText,
        date: `${monthInterval}/${dayInterval}/${yearInterval}`,
        color,
        repeat: {
          active: repeat,
          next: `${
            dayInterval + howOften > daysInMonth
              ? monthInterval > 11
                ? 1
                : monthInterval + 1
              : monthInterval
          }/${
            dayInterval + howOften > daysInMonth
              ? dayInterval + howOften - daysInMonth
              : dayInterval + howOften
          }/${
            monthInterval > 11 && dayInterval + howOften > daysInMonth
              ? yearInterval + 1
              : yearInterval
          }`,
          occurance: repeat
            ? howOften === 1
              ? "Daily"
              : howOften === 7
              ? "Weekly"
              : "Bi-weekly"
            : null,
        },
        time: {
          time,
          timeDateString,
          timeNotifDate,
        },
        reminder: {
          reminder,
          when: reminder
            ? reminderTime < 60
              ? `${reminderTime}min prior`
              : `1hour prior`
            : "",
        },
      };
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      dayInterval += howOften;
    }
    setModal(false);
    setEvents(JSON.parse(localStorage.getItem("events")));
  };

  const setMonthlyDates = () => {
    let dayInterval = Number(selectedDate.split("/")[1]);
    let monthInterval = Number(selectedDate.split("/")[0]);
    let yearInterval = Number(selectedDate.split("/")[2]);
    for (let i = 0; i < 100; i++) {
      if (monthInterval > 12) {
        yearInterval += 1;
        monthInterval = 1;
      }
      const newEvent = {
        id: uuidv4(),
        event: eventText,
        date: `${monthInterval}/${dayInterval}/${yearInterval}`,
        color,
        repeat: {
          active: repeat,
          next: `${
            monthInterval >= 12 ? 1 : monthInterval + 1
          }/${dayInterval}/${yearInterval}`,
          occurance: "Monthly",
        },
        time: {
          time,
          timeDateString,
          timeNotifDate,
        },
        reminder: {
          reminder,
          when: reminder
            ? reminderTime < 60
              ? `${reminderTime}min prior`
              : `1hour prior`
            : "",
        },
      };
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      monthInterval += 1;
    }
    setModal(false);
    setEvents(JSON.parse(localStorage.getItem("events")));
  };

  const setYearlyDates = () => {
    let dayInterval = Number(selectedDate.split("/")[1]);
    let monthInterval = Number(selectedDate.split("/")[0]);
    let yearInterval = Number(selectedDate.split("/")[2]);
    for (let i = 0; i < 100; i++) {
      const newEvent = {
        id: uuidv4(),
        event: eventText,
        date: `${monthInterval}/${dayInterval}/${yearInterval}`,
        color,
        repeat: {
          active: repeat,
          next: `${monthInterval}/${dayInterval}/${yearInterval + 1}`,
          occurance: "Yearly",
        },
        time: {
          time,
          timeDateString,
          timeNotifDate,
        },
        reminder: {
          reminder,
          when: reminder
            ? reminderTime < 60
              ? `${reminderTime}min prior`
              : `1hour prior`
            : "",
        },
      };
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      yearInterval += 1;
    }
    setModal(false);
    setEvents(JSON.parse(localStorage.getItem("events")));
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center my-10 mx-auto w-[80%]">
        {colors.map((item, index) => (
          <Color
            key={index}
            string={item.color}
            color={color}
            setColor={setColor}
          />
        ))}
      </div>
      <input
        placeholder="New Event"
        onChange={(e) => setEventText(e.target.value)}
        className={`p-2 rounded-md m-2 mt-10 text-center shadow-md ${color} outline-none bg-opacity-30 duration-200`}
      />
      <div className="w-full px-5 mt-5">
        <div className="rounded-md shadow-sm p-2">
          <div className="flex justify-between items-center mb-2">
            <p>Repeats:</p>
            <Toggle condition={repeat} setCondition={setRepeat} />
          </div>
          {repeat && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <p
                onClick={() => setHowOften((prev) => (prev === 1 ? null : 1))}
                className={`${
                  howOften === 1 && "bg-green-300 rounded-md shadow-md p-2"
                } my-2 duration-200`}
              >
                Daily
              </p>
              <p
                onClick={() => setHowOften((prev) => (prev === 7 ? null : 7))}
                className={`${
                  howOften === 7 && "bg-green-300 rounded-md shadow-md p-2"
                } my-2 duration-200`}
              >
                Weekly
              </p>
              <p
                onClick={() => setHowOften((prev) => (prev === 14 ? null : 14))}
                className={`${
                  howOften === 14 && "bg-green-300 rounded-md shadow-md p-2"
                } my-2 duration-200`}
              >
                Bi-Weekly
              </p>
              <p
                onClick={() => setHowOften((prev) => (prev === 35 ? null : 35))}
                className={`${
                  howOften === 30 ||
                  howOften === 29 ||
                  howOften === 28 ||
                  howOften === 31
                    ? "bg-green-300 rounded-md shadow-md p-2"
                    : ""
                } my-2 duration-200`}
              >
                Monthly
              </p>
              <p
                onClick={() =>
                  setHowOften((prev) => (prev === 365 ? null : 365))
                }
                className={`${
                  howOften === 365 && "bg-green-300 rounded-md shadow-md p-2"
                } my-2 duration-200`}
              >
                Yearly
              </p>
            </motion.div>
          )}
        </div>
        <div className="my-3 rounded-md shadow-sm p-2">
          <div className="flex justify-between items-center">
            <p>Reminders:</p>
            <Toggle condition={reminder} setCondition={setReminder} />
          </div>
          {reminder && (
            <div className="mt-2">
              <p
                onClick={() =>
                  setReminderTime((prev) => (prev === 15 ? null : 15))
                }
                className={`${
                  reminderTime === 15
                    ? "bg-green-300 p-2 rounded-md shadow-md"
                    : "my-2"
                } duration-200`}
              >
                15min
              </p>
              <p
                onClick={() =>
                  setReminderTime((prev) => (prev === 30 ? null : 30))
                }
                className={`${
                  reminderTime === 30
                    ? "bg-green-300 p-2 rounded-md shadow-md"
                    : "my-2"
                } duration-200`}
              >
                30min
              </p>
              <p
                onClick={() =>
                  setReminderTime((prev) => (prev === 60 ? null : 60))
                }
                className={`${
                  reminderTime === 60
                    ? "bg-green-300 p-2 rounded-md shadow-md"
                    : "my-2"
                } duration-200`}
              >
                1hour
              </p>
            </div>
          )}
        </div>
        <div className="my-3 rounded-md shadow-sm p-2">
          <div className="flex justify-between items-center mb-3">
            <p>Time:</p>
            <Toggle condition={time} setCondition={setTime} />
          </div>
          {time && (
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <TimeSetter
                selectedDate={selectedDate}
                setTime={setTimeDateString}
                setNotif={setTimeNotifDate}
              />
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex justify-around p-2 mt-10 w-full">
        <button
          onClick={() => setAddNewEvent(false)}
          className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-red-300 to-red-200 w-[100px]"
        >
          Cancel
        </button>
        <button
          onClick={() => addEvent()}
          className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-green-300 to-green-200 w-[100px]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
