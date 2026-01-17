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
<div className="flex flex-col justify-between min-h-[95vh] pt-12">
  <div className="space-y-6">
    {/* Title */}
    <input
      placeholder="Reminder"
      className={`
        w-full px-4 pt-3 pb-3 text-4xl font-semibold
        rounded-2xl
        focus:outline-none
        transition-all duration-200
        border border-cyan-200
        focus:ring-2 focus:ring-cyan-300
        ${preferences.darkMode
          ? "bg-white/5 text-white"
          : "bg-white text-slate-900"}
      `}
      onChange={(e) => setTitle(e.target.value)}
    />

    {/* Notes */}
    <textarea
      onChange={(e) => setNotes(e.target.value)}
      rows="8"
      placeholder="Notes..."
      className={`
        w-full p-4 rounded-2xl text-sm
        resize-none
        transition-all duration-200
        border border-cyan-200
        focus:outline-none focus:ring-2 focus:ring-cyan-300
        ${preferences.darkMode
          ? "bg-white/5 text-white"
          : "bg-white text-slate-800"}
      `}
    />

    {/* Custom Time */}
    {quickTimeSelect.fifteen ||
    quickTimeSelect.thirty ||
    quickTimeSelect.hour ? <div className="bg-transparent pb-14"></div> : (
      <div className="rounded-2xl border border-cyan-200 p-4 bg-cyan-50/50">
        <div className="flex justify-between items-center">
          <p className="font-medium text-slate-700">Set Time</p>
          <Toggle condition={addTime} setCondition={setAddTime} />
        </div>

        {addTime && (
          <div className="mt-3">
            {!time ? (
              <TimeSetter
                setDateTime={setTime}
                setDateTimeString={setTimeString}
                openTimeSetter={setAddTime}
              />
            ) : (
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <p className="font-semibold text-sm">{timeString}</p>
                <button
                  className="mt-2 text-xs font-medium text-cyan-600 hover:underline"
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
        )}
      </div>
    )}

    {/* Only Notify */}
    <div className="rounded-2xl border border-cyan-200 p-4 bg-cyan-50/50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-700">
          <AiFillInfoCircle className="text-cyan-400" />
          <p className="font-medium">Only notify</p>
        </div>
        <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
      </div>
    </div>

    {/* Quick Selects */}
    <div className="space-y-3">
      {[
        { label: "15 Minutes", value: quickTimeSelect.fifteen, set: setFifteen, offset: 15 },
        { label: "30 Minutes", value: quickTimeSelect.thirty, set: setThirty, offset: 30 },
        { label: "1 Hour", value: quickTimeSelect.hour, set: setHour, offset: 60 },
      ].map(({ label, value, set, offset }) => (
        <div
          key={label}
          className="rounded-2xl border border-cyan-200 p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BsClock className="text-cyan-400" />
              <p className="font-medium">{label}</p>
            </div>
            <Toggle condition={value} setCondition={set} />
          </div>

          {value && (
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {new Date(
                new Date().setMinutes(
                  new Date().getMinutes() + offset
                )
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          )}
        </div>
      ))}
    </div>

    {/* Today's Events */}
    <div className="space-y-3">
      {todaysEvents.loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : todaysEvents.events.length > 0 ? (
        <>
          <p className="text-sm font-medium text-slate-600">
            Is this reminder for an event today?
          </p>

          {todaysEvents.events.map((event) => (
            <button
              key={event.id}
              onClick={() =>
                setEventForReminder((prev) =>
                  prev?.id === event.id ? null : event
                )
              }
              className={`
                relative w-full text-left pl-6 p-4 rounded-2xl
                transition-all duration-200
                shadow-sm hover:shadow-md hover:scale-[1.01]
                ${
                  eventForReminder?.id === event.id
                    ? "bg-cyan-100"
                    : preferences.darkMode
                    ? "bg-white/5"
                    : "bg-white"
                }
              `}
            >
              <div
                className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl`}
              />
              {event.summary}
            </button>
          ))}
        </>
      ) : null}
    </div>
  </div>

  {/* Actions */}
  <div className="flex flex-col gap-y-3 mt-6">
    <button
      onClick={() => addAReminder()}
      className="
        rounded-2xl py-3 text-sm font-semibold text-white
        bg-gradient-to-r from-cyan-400 to-cyan-500
        shadow-md hover:shadow-lg hover:scale-[1.015]
        active:scale-[0.97] transition-all duration-200
      "
    >
      Save Reminder
    </button>

    <button
      onClick={() => {
        setType(null);
        setAddNewEvent(false);
      }}
      className="
        rounded-2xl py-3 text-sm font-semibold
        bg-rose-100 text-rose-700
        hover:bg-rose-200
        shadow-sm hover:shadow-md
        active:scale-[0.97] transition-all duration-200
      "
    >
      Cancel
    </button>
  </div>
</div>

  );
};

export default AddReminder;
