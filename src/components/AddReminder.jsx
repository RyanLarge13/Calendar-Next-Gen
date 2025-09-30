import { useState, useContext, useEffect } from "react";
import { addReminder, createNotification } from "../utils/api";
import { AiFillInfoCircle } from "react-icons/ai";
import Toggle from "./Toggle";
import TimeSetter from "./TimeSetter";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import { BsClock } from "react-icons/bs";

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
  const [eventForReminder, setEventForReminder] = useState(null);
  const [quickTimeSelect, setQuickTimeSelect] = useState({
    fifteen: false,
    thirty: false,
    hour: false,
  });

  useEffect(() => {
    const date = new Date(string);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (eventMap.has(key)) {
      const events =
        eventMap
          .get(key)
          ?.events.filter(
            (e) => new Date(e.date).toLocaleDateString() === string
          ) || [];

      if (events.length < 1) {
        setTodaysEvent({ loading: false, events: [] });
      } else {
        setTodaysEvent({ loading: false, events: events });
      }
    } else {
      setTodaysEvent({ loading: false, events: [] });
    }
  }, [eventMap]);

  const getTime = () => {
    if (quickTimeSelect.fifteen) {
      const newDate = new Date();
      newDate.setMinutes(newDate.getMinutes() + 15);
      return newDate.toString();
    }
    if (quickTimeSelect.thirty) {
      const newDate = new Date();
      newDate.setMinutes(newDate.getMinutes() + 30);
      return newDate.toString();
    }

    // Handle hour here

    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 1);
    return newDate.toString();
  };

  const addAReminder = () => {
    if (
      !time &&
      !quickTimeSelect.fifteen &&
      !quickTimeSelect.thirty &&
      !quickTimeSelect.hour
    ) {
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
      time: time ? time : getTime(),
    };
    const newNotification = {
      type: "reminder",
      time: time ? time : getTime(),
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

  const setFifteen = () => {
    setQuickTimeSelect({
      fifteen: !quickTimeSelect.fifteen,
      thirty: false,
      hour: false,
    });
  };

  const setThirty = () => {
    setQuickTimeSelect({
      fifteen: false,
      thirty: !quickTimeSelect.thirty,
      hour: false,
    });
  };

  const setHour = () => {
    setQuickTimeSelect({
      fifteen: false,
      thirty: false,
      hour: !quickTimeSelect.hour,
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-[95vh]">
      <div>
        <input
          placeholder="Reminder"
          className={`p-2 pt-10 text-4xl w-full focus:outline-none my-5 ${
            preferences.darkMode
              ? "bg-[#222] text-white"
              : "bg-white text-black"
          }`}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          cols="30"
          rows="10"
          placeholder="Notes..."
          className={`my-5 w-full p-2 focus:outline-none focus:shadow-sm ${
            preferences.darkMode
              ? "bg-[#222] text-white"
              : "bg-white text-black"
          }`}
        ></textarea>
        {quickTimeSelect.fifteen ||
        quickTimeSelect.thirty ||
        quickTimeSelect.hour ? null : (
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
        )}
        <div className="my-2 p-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <AiFillInfoCircle className="mr-2" />
              <p>Only notify</p>
            </div>
            <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
          </div>
        </div>

        {/* Quick Selects */}
        <div className="mt-10">
          <div className="my-2 p-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center">
                <BsClock className="mr-3 text-sky-400" />
                <p>15 Minutes</p>
              </div>
              <Toggle
                condition={quickTimeSelect.fifteen}
                setCondition={setFifteen}
              />
            </div>
            {quickTimeSelect.fifteen ? (
              <p className="font-semibold text-sm p-2">
                {new Date(
                  new Date().setMinutes(new Date().getMinutes() + 15)
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            ) : null}
          </div>
          <div className="my-2 p-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center">
                <BsClock className="mr-3 text-sky-400" />
                <p>30 Minutes</p>
              </div>
              <Toggle
                condition={quickTimeSelect.thirty}
                setCondition={setThirty}
              />
            </div>
            {quickTimeSelect.thirty ? (
              <p className="font-semibold text-sm p-2">
                {new Date(
                  new Date().setMinutes(new Date().getMinutes() + 30)
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            ) : null}
          </div>
          <div className="my-2 p-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center">
                <BsClock className="mr-3 text-sky-400" />
                <p>1 Hour</p>
              </div>
              <Toggle condition={quickTimeSelect.hour} setCondition={setHour} />
            </div>
            {quickTimeSelect.hour ? (
              <p className="font-semibold text-sm p-2">
                {new Date(
                  new Date().setHours(new Date().getHours() + 1)
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>

        <div className="my-10 p-3">
          {todaysEvents.loading ? (
            <p>...</p>
          ) : todaysEvents.events.length > 0 ? (
            <div>
              <p className="mb-2 text-sm p-3 rounded-xl shadow-lg">
                Is this reminder for an event today?
              </p>
              <div>
                {todaysEvents.events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() =>
                      setEventForReminder((prev) =>
                        prev?.id === event.id ? null : event
                      )
                    }
                    className={`${
                      eventForReminder?.id === event.id
                        ? preferences.darkMode
                          ? "bg-slate-700"
                          : "bg-slate-200"
                        : preferences.darkMode
                        ? "bg-[#222] "
                        : "bg-white"
                    } duration-300 p-3 rounded-md
                            hover:scale-[1.02] will-change-transform shadow-lg my-1 relative pl-5 w-full text-left`}
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
      </div>
      <div
        className="flex flex-col gap-y-2 text-xs font-semibold
        text-black mt-5 mb-3"
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
