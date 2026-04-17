import { useContext, useEffect, useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { BsAlarmFill, BsClock, BsRepeat } from "react-icons/bs";
import { motion } from "framer-motion";
import { MdCancelScheduleSend, MdClose } from "react-icons/md";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { addReminder, createNotification } from "../../utils/api";
import { isPassed, makeDateTime } from "../../utils/helpers";
import TimeSetter from "../DatePickers/TimeSetter";
import Toggle from "../Misc/Toggle";
import { useModalActions } from "../../context/ContextHooks/ModalContext";
import { repeatOptions } from "../../constants/dateAndTimeConstants";
import NotificationSubscription from "../Notifications/NotificationSubscription";

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
    notifSubs,
  } = useContext(UserContext);
  const { string, setString } = useContext(DatesContext);

  const { closeModal } = useModalActions();

  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [timeString, setTimeString] = useState("");
  const [addTime, setAddTime] = useState(false);
  const [onlyNotify, setOnlyNotify] = useState(false);
  const [deviceExceptions, setDeviceExceptions] = useState([]);
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
  const [selectDevices, setSelectDevices] = useState(false);

  // Repeat states
  const [repeat, setRepeat] = useState({
    on: false,
    repeatForever: false,
    howOften: null,
    count: 0,
  });

  useEffect(() => {
    const dateTime = () => {
      const currentDate = new Date(string);
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      const hours = new Date(time).getHours();
      const minutes = new Date(time).getMinutes();
      return new Date(year, month, day, hours, minutes);
    };

    if (time) {
      const newTime = dateTime();

      setTime(newTime);
      setTimeString(newTime.toString());
    }
  }, [string]);

  useEffect(() => {
    const date = new Date(string);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (eventMap.has(key)) {
      // Test this out, see about rendering the entire months events. Or maybe
      // We should create a new event selection UI
      const events =
        eventMap.get(key)?.events ||
        // .filter(
        // (e) => new Date(e.date).toLocaleDateString() === string,
        // )
        [];

      if (events.length < 1) {
        setTodaysEvent({ loading: false, events: [] });
      } else {
        setTodaysEvent({ loading: false, events: events });
      }
    } else {
      setTodaysEvent({ loading: false, events: [] });
    }
  }, [eventMap, string]);

  const getTime = () => {
    if (quickTimeSelect.fifteen) {
      const newDate = new Date(string);
      newDate.setHours(new Date().getHours());
      newDate.setMinutes(new Date().getMinutes() + 15);
      return newDate.toString();
    }
    if (quickTimeSelect.thirty) {
      const newDate = new Date(string);
      newDate.setHours(new Date().getHours());
      newDate.setMinutes(new Date().getMinutes() + 30);
      return newDate.toString();
    }

    // Handle hour here

    const newDate = new Date(string);
    newDate.setHours(new Date().getHours() + 1);
    newDate.setMinutes(new Date().getMinutes());
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
      setSystemNotif(newError);
      return;
    }

    if (eventForReminder) {
      const eventFound =
        todaysEvents.events.find((e) => e.id === eventForReminder.id) || null;

      if (eventFound !== null) {
        const timeToCheck = time ? time : getTime();
        const eventDate = new Date(eventFound.startDate);
        const eventTime = new Date(eventFound.start.startTime);

        eventDate.setHours(eventTime.getHours());
        eventDate.setMinutes(eventTime.getMinutes());

        console.log(eventDate);
        if (isPassed(new Date(timeToCheck), eventDate)) {
          const newError = {
            show: true,
            title: "Update Time",
            text: "You're attempting to create a new reminder for an event that will have already passed",
            color: "bg-red-200",
            hasCancel: false,
            actions: [
              { text: "close", func: () => setSystemNotif({ show: false }) },
            ],
          };
          setSystemNotif(newError);
          return;
        }
      }
    }

    const token = localStorage.getItem("authToken");
    const timeToAdd = time ? time : getTime();
    const newReminder = {
      title,
      notes,
      eventRefId: eventForReminder?.id || null,
      time: timeToAdd,
      repeat: repeat,
      deviceExceptions: deviceExceptions,
    };
    const newNotification = {
      type: "reminder",
      time: timeToAdd,
      read: false,
      readTime: "",
      notifData: {
        eventRefIId: eventForReminder?.id || null,
        time,
        notes,
        title,
        userId: user.id,
      },
      userId: user.id,
      sentNotification: false,
      sentWebPush: false,
      deviceExceptions: deviceExceptions,
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
            })} ${time.toLocaleTimeString("en-US", {
              timeZoneName: "short",
            })}`,
            color: "bg-cyan-100",
            hasCancel: true,
            actions: [
              { text: "close", func: () => setSystemNotif({ show: false }) },
              { text: "delete notification", func: () => {} },
            ],
          };
          closeModal();
          setAddNewEvent(false);
          setType(null);
          return setSystemNotif(newNotif);
        })
        .catch((err) => console.log(err));
    }
    addReminder(newReminder, token)
      .then((res) => {
        closeModal();
        setAddNewEvent(false);
        setType(null);
        const sortedReminders = [...reminders, res.data.reminder].sort(
          (a, b) => new Date(a.time) - new Date(b.time),
        );
        setReminders(sortedReminders);
        setMenu(true);
        setShowCategory("reminder");
        window.history.pushState({ locked: true }, "");
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

  const saveReminderTimes = (values) => {
    //     setDateTime={setTime}
    // setDateTimeString={setTimeString}
    const { hour, minutes, meridiem } = values;

    const time = makeDateTime(string, hour, minutes, meridiem);

    setTime(time);

    const newTimeString = time.toLocaleTimeString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    setTimeString(newTimeString);
  };

  // Repeat methods
  const createRepeat = (isRepeatCallback) => {
    const isRepeat = isRepeatCallback(repeat.on);

    setRepeat((prev) => ({
      ...prev,
      on: isRepeat,
    }));
  };

  const createHowOften = (newHowOftenCallback) => {
    const newHowOften = newHowOftenCallback(repeat.howOften);

    setRepeat((prev) => ({
      ...prev,
      howOften: newHowOften,
    }));
  };

  const createNeverEndingRepeat = (isForeverCallback) => {
    const isForever = isForeverCallback(repeat.repeatForever);

    setRepeat((prev) => ({
      ...prev,
      repeatForever: isForever,
    }));
  };

  const addDeviceToDoNotNotify = (ns) => {
    let sub = null;

    try {
      sub = JSON.parse(ns);
    } catch (err) {
      console.log("Error parsing device subscription");
      console.log(err);
    }
    const deviceId = sub.endpoint;
    const contains = deviceExceptions.find((id) => id === deviceId);

    setDeviceExceptions((prev) =>
      contains ? prev.filter((id) => id !== deviceId) : [...prev, deviceId],
    );
  };

  const deviceSelected = (ns) => {
    let sub = null;

    try {
      sub = JSON.parse(ns);
    } catch (err) {
      console.log("Error parsing device subscription");
      console.log(err);
    }

    const deviceId = sub.endpoint;
    const contains = deviceExceptions.find((id) => id === deviceId);

    if (contains) {
      return "border border-slate-400 border-2 rounded-lg duration-300";
    }

    return "";
  };

  return (
    <div
      className={`flex flex-col h-screen pt-20 p-2 justify-between ${
        preferences.darkMode ? "text-white" : "text-slate-900"
      }`}
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Title */}
        <input
          placeholder="Reminder"
          className={`
        w-full px-4 pt-3 pb-3 text-3xl sm:text-4xl font-semibold tracking-tight
        rounded-2xl
        outline-none transition-all duration-200
        border shadow-sm
        ${
          preferences.darkMode
            ? "bg-white/5 text-white border-white/10 placeholder:text-gray-300 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-500/20"
            : "bg-white text-slate-900 border-black/10 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10"
        }
      `}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Notes */}
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          rows="8"
          placeholder="Notes..."
          className={`
        w-full p-4 rounded-2xl text-sm leading-relaxed
        resize-none
        outline-none transition-all duration-200
        border shadow-sm
        ${
          preferences.darkMode
            ? "bg-white/5 text-white border-white/10 placeholder:text-gray-300 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-500/20"
            : "bg-white text-slate-800 border-black/10 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10"
        }
      `}
        />

        {/* Custom Time spacer when quick select active */}
        {quickTimeSelect.fifteen ||
        quickTimeSelect.thirty ||
        quickTimeSelect.hour ? (
          <div className="bg-transparent pb-12" />
        ) : (
          <div
            className={`
          rounded-2xl border p-4 shadow-sm transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`
                grid place-items-center h-9 w-9 rounded-xl border
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 text-cyan-200"
                    : "bg-cyan-50 border-cyan-100 text-cyan-600"
                }
              `}
                >
                  <BsClock />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      preferences.darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    Set Time
                  </p>
                  <p className="text-xs opacity-70">Pick a specific time</p>
                </div>
              </div>
              <Toggle condition={addTime} setCondition={setAddTime} />
            </div>

            {addTime && (
              <div className="mt-4">
                {!time ? (
                  <TimeSetter
                    saveData={saveReminderTimes}
                    cancelTimeSetter={() => {
                      setTime(null);
                      setAddTime(false);
                    }}
                    dateChangerCallback={(newDtStr) => setString(newDtStr)}
                  />
                ) : (
                  <div
                    className={`
                  mt-1 rounded-2xl border px-4 py-3 shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-black/10"
                  }
                `}
                  >
                    <p className="font-semibold text-sm">{timeString}</p>
                    <button
                      className={`
                    mt-2 inline-flex text-xs font-semibold rounded-xl px-3 py-1.5
                    transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/10 border border-white/10 text-cyan-100 hover:bg-white/15"
                        : "bg-cyan-50 border border-cyan-100 text-cyan-700 hover:bg-cyan-100"
                    }
                  `}
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

        {/* Repeats */}
        <div
          className={`
        rounded-2xl border p-4 shadow-sm transition-all
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/7"
            : "bg-white border-black/10 hover:bg-black/[0.02]"
        }
      `}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`
                grid place-items-center h-9 w-9 rounded-xl border
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 text-cyan-200"
                    : "bg-cyan-50 border-cyan-100 text-cyan-600"
                }
              `}
              >
                <BsRepeat />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    preferences.darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Repeat
                </p>
                <p className="text-xs opacity-70">
                  Set this reminder to repeat
                </p>
              </div>
            </div>
            <Toggle condition={repeat.on} setCondition={createRepeat} />
          </div>
        </div>

        {repeat.on ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="space-y-2">
              {repeatOptions.map((intervalString) => (
                <div
                  key={intervalString}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                    preferences.darkMode
                      ? "border-white/10 bg-white/5"
                      : "border-black/10 bg-black/[0.02]"
                  }`}
                >
                  <p className="text-sm font-medium">{intervalString}</p>
                  <Toggle
                    condition={repeat.howOften}
                    setCondition={createHowOften}
                    howOften={intervalString}
                  />
                </div>
              ))}
            </div>
            <div
              className={`mt-5 flex flex-col gap-1 justify-center items-start
                ${
                  preferences.darkMode
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-black/[0.02]"
                }
                `}
            >
              <p className="text-xs text-gray-700 ml-4">Repeat Forever</p>
              <Toggle
                condition={repeat.repeatForever}
                setCondition={createNeverEndingRepeat}
              />
            </div>
            {repeat.howOften && !repeat.repeatForever ? (
              <input
                placeholder={`How many ${
                  repeat.howOften === "Daily"
                    ? "days"
                    : repeat.howOften === "Weekly"
                      ? "weeks"
                      : repeat.howOften === "Bi Weekly"
                        ? "times"
                        : repeat.howOften === "Monthly"
                          ? "months"
                          : repeat.howOften === "Yearly"
                            ? "years"
                            : ""
                }?`}
                className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/7"
                    : "bg-white border-black/10 hover:bg-black/[0.02]"
                }`}
              />
            ) : null}
          </motion.div>
        ) : null}

        {/* Only Notify */}
        <div
          className={`
        rounded-2xl border p-4 shadow-sm transition-all
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/7"
            : "bg-white border-black/10 hover:bg-black/[0.02]"
        }
      `}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`
              grid place-items-center h-9 w-9 rounded-xl border
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-cyan-200"
                  : "bg-cyan-50 border-cyan-100 text-cyan-600"
              }
            `}
              >
                <AiFillInfoCircle />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    preferences.darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Only notify
                </p>
                <p className="text-xs opacity-70">
                  No schedule changes, just alerts
                </p>
              </div>
            </div>
            <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
          </div>
        </div>

        {/* Select Device To Not Notify */}
        <div
          className={`
        rounded-2xl border p-4 shadow-sm transition-all
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/7"
            : "bg-white border-black/10 hover:bg-black/[0.02]"
        }
      `}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`
              grid place-items-center h-9 w-9 rounded-xl border
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-cyan-200"
                  : "bg-cyan-50 border-cyan-100 text-cyan-600"
              }
            `}
              >
                <MdCancelScheduleSend />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    preferences.darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Do Not Notify Devices
                </p>
                <p className="text-xs opacity-70">
                  Pick devices you do not want this notification to ping
                </p>
              </div>
            </div>
            <Toggle condition={selectDevices} setCondition={setSelectDevices} />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[75vh] grid gap-3 grid-cols-2">
          {selectDevices
            ? notifSubs.map((ns, index) => (
                <button
                  onClick={() => addDeviceToDoNotNotify(ns)}
                  className={`${deviceSelected(ns)}`}
                >
                  <NotificationSubscription key={index} ns={ns} hasSub={true} />
                </button>
              ))
            : null}
        </div>

        {/* Quick Selects */}
        <div className="space-y-3">
          {[
            {
              label: "15 Minutes",
              value: quickTimeSelect.fifteen,
              set: setFifteen,
              offset: 15,
            },
            {
              label: "30 Minutes",
              value: quickTimeSelect.thirty,
              set: setThirty,
              offset: 30,
            },
            {
              label: "1 Hour",
              value: quickTimeSelect.hour,
              set: setHour,
              offset: 60,
            },
          ].map(({ label, value, set, offset }) => (
            <div
              key={label}
              className={`
            rounded-2xl border p-4 shadow-sm transition-all
            ${
              value
                ? preferences.darkMode
                  ? "bg-cyan-500/10 border-cyan-300/20"
                  : "bg-cyan-50 border-cyan-200"
                : preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/7"
                  : "bg-white border-black/10 hover:bg-black/[0.02]"
            }
          `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                  grid place-items-center h-9 w-9 rounded-xl border
                  ${
                    value
                      ? preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                        : "bg-cyan-100 border-cyan-200 text-cyan-700"
                      : preferences.darkMode
                        ? "bg-white/5 border-white/10 text-cyan-200"
                        : "bg-cyan-50 border-cyan-100 text-cyan-600"
                  }
                `}
                  >
                    <BsClock />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs opacity-70">Quick set</p>
                  </div>
                </div>
                <Toggle condition={value} setCondition={set} />
              </div>

              {value && (
                <p
                  className={`mt-3 inline-flex items-center rounded-xl border px-3 py-1 text-xs font-semibold ${
                    preferences.darkMode
                      ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-100"
                      : "border-cyan-200 bg-white text-slate-700"
                  }`}
                >
                  {new Date(
                    new Date().setMinutes(new Date().getMinutes() + offset),
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
            <p
              className={`text-sm ${
                preferences.darkMode ? "text-white/60" : "text-slate-500"
              }`}
            >
              Loading…
            </p>
          ) : todaysEvents.events.length > 0 ? (
            <>
              <p
                className={`text-sm font-semibold ${
                  preferences.darkMode ? "text-white/70" : "text-slate-600"
                }`}
              >
                Is this reminder for an event soon?
              </p>

              {todaysEvents.events.map((event) => (
                <button
                  key={event.id}
                  onClick={() =>
                    setEventForReminder((prev) =>
                      prev?.id === event.id ? null : event,
                    )
                  }
                  className={`
                relative w-full text-left pl-6 pr-4 py-4 rounded-2xl
                border shadow-sm transition-all duration-200
                hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                ${
                  eventForReminder?.id === event.id
                    ? preferences.darkMode
                      ? "bg-cyan-500/10 border-cyan-300/20"
                      : "bg-cyan-50 border-cyan-200"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/7"
                      : "bg-white border-black/10 hover:bg-black/[0.02]"
                }
              `}
                >
                  <div
                    className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl`}
                  />
                  <span className="text-sm font-semibold">{event.summary}</span>
                </button>
              ))}
            </>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between p-3 items-center w-full">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-red-500 to-rose-500 text-white"
          aria-label="Cancel"
        >
          <MdClose className="text-xl" />
        </button>

        <button
          onClick={() => addAReminder()}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-lime-400 to-emerald-500 text-white"
          aria-label="Add event"
        >
          <BsAlarmFill className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default AddReminder;
