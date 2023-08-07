import { useState, useContext } from "react";
import { addReminder } from "../utils/api";
import { MdCancel } from "react-icons/md";
import { BsFillSaveFill } from "react-icons/bs";
import Toggle from "./Toggle";
import TimeSetter from "./TimeSetter";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

const AddReminder = () => {
  const { setMenu, setAddNewEvent, setType } = useContext(InteractiveContext);
  const { setReminders, setSystemNotif } = useContext(UserContext);
  const { setOpenModal } = useContext(DatesContext);

  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [timeString, setTimeString] = useState("");
  const [addTime, setAddTime] = useState(false);

  const addAReminder = () => {
    if (!time || !addTime) {
      const newError = {
        show: true,
        title: "Select A Time",
        text: "Please select a time for your reminder",
        color: "bg-red-200",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError);
    }
    if (!title) {
      const newError = {
        show: true,
        title: "Title",
        text: "Please create at least a title for your new reminder",
        color: "bg-red-200",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError);
    }
    const token = localStorage.getItem("authToken");
    const newReminder = {
      title,
      notes,
      time,
    };
    addReminder(newReminder, token)
      .then((res) => {
        setOpenModal(false);
        setAddNewEvent(false);
        setType(null);
        setReminders((prev) => [...prev, res.data.reminder]);
        setMenu(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-2 pt-10">
      <h2 className="text-center">New Reminder</h2>
      <div className="mt-10 w-full">
        <input
          placeholder="New Reminder"
          className="p-2 rounded-md shadow-md w-full"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          cols="30"
          rows="10"
          placeholder="Notes..."
          className="my-2 p-2 rounded-md shadow-md w-full"
        ></textarea>
        <div className="my-2 p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <p>Time</p>
            <Toggle condition={addTime} setCondition={setAddTime} />
          </div>
          {addTime && (
            <div className="mt-2">
              {!time ? (
                <TimeSetter
                  setDateTime={setTime}
                  setDateTimeString={setTimeString}
                  openTimeSetter={setAddTime}
                />
              ) : (
                <p>{timeString}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="fixed right-[65vw] bottom-5 flex flex-col justify-center items-center px-2">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="p-3 rounded-full shadow-md bg-gradient-to-r from-red-300 to-red-200"
        >
          <MdCancel />
        </button>
        <button
          onClick={() => addAReminder()}
          className="rounded-full p-3 shadow-md bg-gradient-to-r from-green-300 to-green-200 mt-5"
        >
          <BsFillSaveFill />
        </button>
      </div>
    </div>
  );
};

export default AddReminder;
