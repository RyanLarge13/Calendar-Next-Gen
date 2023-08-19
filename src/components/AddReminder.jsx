import { useState, useContext } from "react";
import { addReminder, createNotification } from "../utils/api";
import { AiFillInfoCircle } from "react-icons/ai";
import Toggle from "./Toggle";
import TimeSetter from "./TimeSetter";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

const AddReminder = () => {
  const { setMenu, setAddNewEvent, setType, setShowCategory } =
    useContext(InteractiveContext);
  const { reminders, user, setReminders, setSystemNotif } =
    useContext(UserContext);
  const { setOpenModal } = useContext(DatesContext);

  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [timeString, setTimeString] = useState("");
  const [addTime, setAddTime] = useState(false);
  const [onlyNotify, setOnlyNotify] = useState(false);

  const addAReminder = () => {
    if (!time || !addTime) {
      const newError = {
        show: true,
        title: "Select A Time",
        text: "Please select a time for your reminder",
        color: "bg-red-200",
        hasCancel: false,
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
        hasCancel: false,
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
    const newNotification = {
      type: "reminder",
      time,
      read: false,
      readTime: "",
      notifData: {
        time,
        notes,
        title,
        userId: user.id,
      },
      userId: user.id,
      sentNotification: false,
      sentWebPush: false,
      reminderRefId: "",
    };
    if (onlyNotify) {
      return createNotification(newNotification, token)
        .then((res) => {
          const notif = res.data.notification;
          const time = new Date(notif.time);
          const newNotif = {
            show: true,
            title: "Notification Created",
            text: `New Notification created to ${
              notif.notifData.title
            } we will reminder you on ${time.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })} @${time.toLocaleTimeString("en-US", {
              timeZoneName: "short",
            })}`,
            color: "bg-cyan-100",
            hasCancel: true,
            action: [
              { text: "close", func: () => setSystemNotif({ show: false }) },
              {text: "delete notification", func: () => {}}
            ],
          };
          setOpenModal(false);
          setAddNewEvent(false);
          setType(null);
          return setSystemNotif(newNotif);
        })
        .catch((err) => console.log(err));
    }
    addReminder(newReminder, token)
      .then((res) => {
        setOpenModal(false);
        setAddNewEvent(false);
        setType(null);
        const sortedReminders = [...reminders, res.data.reminder].sort(
          (a, b) => new Date(a.time) - new Date(b.time)
        );
        setReminders(sortedReminders);
        setMenu(true);
        setShowCategory("reminders");
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
        <div className="my-2 p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <AiFillInfoCircle className="mr-2" />
              <p>Only notify</p>
            </div>
            <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-5 mb-5 mt-10 text-center text-xs font-semibold">
        <button
          onClick={() => addAReminder()}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddReminder;
