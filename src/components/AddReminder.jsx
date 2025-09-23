import { useState, useContext, useEffect } from "react";
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
  const {
    reminders,
    user,
    setReminders,
    setSystemNotif,
    preferences,
    eventMap,
  } = useContext(UserContext);
  const { setOpenModal, string } = useContext(DatesContext);

  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [timeString, setTimeString] = useState("");
  const [addTime, setAddTime] = useState(false);
  const [onlyNotify, setOnlyNotify] = useState(false);
  const [todaysEvents, setTodaysEvent] = useState({
    loading: true,
    events: [],
  });

  useEffect(() => {
    const date = new Date(string);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (eventMap.has(key)) {
      const events = eventMap.get(key)?.events || [];

      if (events.length < 1) {
        setTodaysEvent({ loading: false, events: [] });
      } else {
        setTodaysEvent({ loading: false, events: events });
      }
    } else {
      setTodaysEvent({ loading: false, events: [] });
    }
  }, [eventMap]);

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
            actions: [
              { text: "close", func: () => setSystemNotif({ show: false }) },
              { text: "delete notification", func: () => {} },
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
        setShowCategory("reminder");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input
        placeholder="Reminder"
        className={`p-2 pt-10 text-4xl w-full focus:outline-none my-5 ${
          preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
        }`}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        onChange={(e) => setNotes(e.target.value)}
        cols="30"
        rows="10"
        placeholder="Notes..."
        className={`my-5 w-full p-2 focus:outline-none focus:shadow-sm ${
          preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
        }`}
      ></textarea>
      <div className="my-2 p-3 border-b">
        <div className="flex justify-between items-center">
          <p>Set Time</p>
          <Toggle condition={addTime} setCondition={setAddTime} />
        </div>
        {addTime ? (
          <div className="mt-2">
            {!time ? (
              <TimeSetter
                setDateTime={setTime}
                setDateTimeString={setTimeString}
                openTimeSetter={setAddTime}
              />
            ) : (
              <div className="p-2">
                <p className="font-semibold">{timeString}</p>
                <button
                  className="text-xs rounded-md bg-emerald-300 font-semibold px-2 py-1 mt-2"
                  onClick={() => {
                    setTime(null);
                    setTimeString("");
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="my-2 p-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <AiFillInfoCircle className="mr-2" />
            <p>Only notify</p>
          </div>
          <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
        </div>
      </div>
      <div className="my-10 p-3">
        {todaysEvents.loading ? (
          <p>...</p>
        ) : todaysEvents.events.length > 0 ? (
          <div>
            <p>Is this reminder for an Event today?</p>
            <div>
              {todaysEvents.events.map((event) => (
                <button
                  key={event.id}
                  onClick={() =>
                    setEventForList((prev) =>
                      prev?.id === event.id ? null : event
                    )
                  }
                  className={`${
                    eventForList?.id === event.id
                      ? preferences.darkMode
                        ? "bg-slate-700"
                        : "bg-slate-200"
                      : preferences.darkMode
                      ? "bg-[#222] "
                      : "bg-white"
                  } duration-300 p-3 rounded-md
                            shadow-lg my-1 relative pl-5 w-full text-left`}
                >
                  <div
                    className={`${event.color} absolute left-0 top-0
                            bottom-0 w-2 rounded-md`}
                  ></div>
                  {event.summary}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="flex flex-col gap-y-2 absolute bottom-4 right-4 left-4 text-xs font-semibold
        text-black"
      >
        <button
          onClick={() => addAReminder()}
          className="rounded-xl py-2.5 text-black text-sm font-semibold shadow-md 
              bg-gradient-to-tr from-lime-300 to-emerald-200 
              hover:from-lime-400 hover:to-emerald-300 
              active:scale-[0.97] transition-all duration-200"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="rounded-xl py-2.5 text-sm font-semibold shadow-md 
              bg-gradient-to-tr from-red-200 to-rose-200 
               hover:from-red-300 hover:to-rose-300 
               active:scale-[0.97] transition-all duration-200"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddReminder;
