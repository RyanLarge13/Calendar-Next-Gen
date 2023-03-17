import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import Toggle from "./Toggle";

const Modal = ({ selectedDate, setModal, events, setEvents }) => {
  const [eventText, setEventText] = useState("");
  const [dayEvents, setDayEvents] = useState([]);
  const [color, setColor] = useState("blue");
  const [repeat, setRepeat] = useState(false);
  const [time, setTime] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      const arrayOfEvents = JSON.parse(events);
      const eventsForDay = arrayOfEvents.filter(
        (event) => event.date === selectedDate
      );
      setDayEvents(eventsForDay);
    }
  }, []);

  const addEvent = async () => {
    if (repeat) await createRepeats();
    const newEvent = {
      id: uuidv4(),
      event: eventText,
      date: selectedDate,
      color,
      repeat,
      time,
      reminder,
    };
    if (events.length > 0) {
      const arrayOfEvents = JSON.parse(events);
      arrayOfEvents.push(newEvent);
      localStorage.setItem("events", JSON.stringify(arrayOfEvents));
      setEventText("");
      setEvents(localStorage.getItem("events"));
      setModal(false);
    } else {
      events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(events));
      setEventText("");
      setEvents(localStorage.getItem("events"));
      setModal(false);
    }
  };

  const createRepeats = async () => {
    for (let i = 0; i < 100; i++) {
      const newEvent = {
        id: uuidv4(),
        event: eventText,
        date: selectedDate,
        color,
        repeat,
        time,
        reminder,
      };
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setModal(false)}
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-end"
      ></motion.div>
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        className={`bg-white rounded-md shadow-md px-2 py-5 fixed top-0 bottom-0 right-0 h-full flex flex-col items-center justify-center w-[65%]`}
      >
        {addNewEvent ? (
          <>
            <h2 className="bold text-xl">{selectedDate}</h2>
            <div className="flex flex-wrap justify-center items-center my-20 mx-auto w-[80%]">
              <div
                onClick={() => setColor("blue")}
                className={`bg-blue-400 w-[20px] h-[20px] rounded-full shadow-sm m-2 ${
                  color === "blue" && "outline outline-gray-400"
                }`}
              ></div>
              <div
                onClick={() => setColor("red")}
                className={`bg-red-400 w-[20px] h-[20px] rounded-full shadow-sm m-2 ${
                  color === "red" && "outline outline-gray-400"
                }`}
              ></div>
              <div
                onClick={() => setColor("green")}
                className={`bg-green-400 w-[20px] h-[20px] rounded-full shadow-sm m-2 ${
                  color === "green" && "outline outline-gray-400"
                }`}
              ></div>
              <div
                onClick={() => setColor("pink")}
                className={`bg-pink-400 w-[20px] h-[20px] rounded-full shadow-sm m-2 ${
                  color === "pink" && "outline outline-gray-400"
                }`}
              ></div>
              <div
                onClick={() => setColor("orange")}
                className={`bg-orange-400 w-[20px] h-[20px] rounded-full shadow-sm m-2 ${
                  color === "orange" && "outline outline-gray-400"
                }`}
              ></div>
            </div>
            <input
              placeholder="New Event"
              onChange={(e) => setEventText(e.target.value)}
              className={`p-2 rounded-md m-2 mt-10 text-center shadow-md outline-none`}
            />
            <div className="w-full px-5 mt-5">
              <div className="flex justify-between items-center rounded-md shadow-sm p-2">
                <p>Repeats:</p>
                <Toggle condition={repeat} setCondition={setRepeat} />
              </div>
              <div className="flex justify-between items-center my-3 rounded-md shadow-sm p-2">
                <p>Reminders:</p>
                <Toggle condition={reminder} setCondition={setReminder} />
              </div>
              <div className="flex justify-between items-center rounded-md shadow-sm p-2">
                <p>Time:</p>
                <Toggle condition={time} setCondition={setTime} />
              </div>
            </div>
            <div className="flex justify-around p-2 mt-10 w-full">
              <button
                onClick={() => setModal(false)}
                className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-red-400 to-red-300 w-[100px]"
              >
                Cancel
              </button>
              <button
                onClick={() => addEvent()}
                className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-green-400 to-green-300 w-[100px]"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-extrabold">{selectedDate}</h2>
            <div className="w-full h-full flex flex-col justify-center items-center">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div
                    key={event.event}
                    className={`p-3 m-2 rounded-md shadow-md w-full`}
                  >
                    <h3
                      className={`bg-${event.color}-400 text-white px-3 py-1 rounded-md font-extrabold mb-5`}
                    >
                      {event.event}
                    </h3>
                    <div className="flex justify-start items-center my-2">
                      <p>Repeats:</p>
                      <Toggle condition={event.repeat} setCondition={null} />
                    </div>
                    <div className="flex justify-start items-center my-2">
                      <p>Reminders:</p>
                      <Toggle condition={event.reminders} setCondition={null} />
                    </div>
                  </div>
                ))
              ) : (
                <h2>No Events To Show For Today</h2>
              )}
            </div>
            <button
              onClick={() => setAddNewEvent(true)}
              className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-red-400 to-red-300"
            >
              Add
            </button>
          </>
        )}
      </motion.div>
    </>
  );
};

export default Modal;
