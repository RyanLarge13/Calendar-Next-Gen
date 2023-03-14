import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Modal = ({ selectedDate, setModal, events, setEvents }) => {
  const [modalColor, setModalColor] = useState(false);
  const [eventText, setEventText] = useState("");
  const [dayEvents, setDayEvents] = useState([]);
  const [color, setColor] = useState("blue");
  const [repeat, setRepeat] = useState(false);
  const [time, setTime] = useState(new Date(selectedDate).setHours(8));
  const [reminder, setReminder] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);

  useEffect(() => {
    const arrayOfEvents = JSON.parse(events);
    const eventsForDay = arrayOfEvents.filter(
      (event) => event.date === selectedDate
    );
    eventsForDay[0]
      ? setModalColor(eventsForDay[0].color)
      : setModalColor(false);
    setDayEvents(eventsForDay);
  }, []);

  const addEvent = () => {
    const newEvent = {
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
        className={`${
          modalColor ? `bg-${modalColor}` : "bg-white"
        } bg-white rounded-md shadow-md p-2 fixed top-0 bottom-0 right-0 h-full flex flex-col items-center justify-center w-[65%]`}
      >
        {addNewEvent ? (
          <>
            <h2 className="bold text-xl">{selectedDate}</h2>
            <div className="flex flex-wrap justify-center items-center my-20 mx-auto w-[80%]">
              <div
                onClick={() => setColor("blue")}
                className={`bg-blue-400 w-9 h-9 rounded-full shadow-sm m-2 ${
                  color === "blue" && "shadow-lg"
                }`}
              ></div>
              <div
                onClick={() => setColor("red")}
                className={`bg-red-400 w-9 h-9 rounded-full shadow-sm m-2 ${
                  color === "red" && "shadow-lg"
                }`}
              ></div>
              <div
                onClick={() => setColor("green")}
                className={`bg-green-400 w-9 h-9 rounded-full shadow-sm m-2 ${
                  color === "green" && "shadow-lg"
                }`}
              ></div>
              <div
                onClick={() => setColor("pink")}
                className={`bg-pink-400 w-9 h-9 rounded-full shadow-sm m-2 ${
                  color === "pink" && "shadow-lg"
                }`}
              ></div>
              <div
                onClick={() => setColor("orange")}
                className={`bg-orange-400 w-9 h-9 rounded-full shadow-sm m-2 ${
                  color === "orange" && "shadow-lg"
                }`}
              ></div>
            </div>
            <input
              placeholder="New Event"
              onChange={(e) => setEventText(e.target.value)}
              className={`p-2 rounded-md m-2 mt-10 text-center shadow-${color}-400 shadow-md outline-none`}
            />
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
            <h2>{selectedDate}</h2>
            <div className="w-full h-full flex flex-col justify-center items-center">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div
                    key={event?.event}
                    className={`px-2 py-1 m-2 rounded-md bg-${event.color}-400`}
                  >
                    <p>{event?.event}</p>
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
