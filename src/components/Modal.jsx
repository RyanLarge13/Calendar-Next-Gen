import { useState } from "react";

const Modal = ({ selectedDate, setModal }) => {
  const [eventText, setEventText] = useState("");
  const [events, setEvents] = useState(
    localStorage.getItem("events") ? localstorage.getItem("events") : []
  );

  const addEvent = () => {
    const newEvent = {
      event: eventText,
      date: selectedDate,
    };
    events.push(newEvent);
    localstorage.setItem("events", JSON.stringify(events));
    setModal(false);
    setEventText("");
  };

  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-end"
      ></div>
      <div className="bg-white rounded-md shadow-md p-2 fixed top-0 bottom-0 right-0 h-full">
        <h2 className="bold text-xl">{selectedDate}</h2>
        <input
          placeholder="Event"
          onChange={(e) => setEventText(e.target.value)}
          className="p-2 rounded-md m-2 mt-10 text-center shadow-md"
        />
        <div className="flex justify-around p-2 mt-10">
          <button
            onClick={() => setModal(false)}
            className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-red-400 to-red-500"
          >
            Cancel
          </button>
          <button
            onClick={() => addEvent()}
            className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-green-400 to-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
