import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { colors } from "../constants";
import { getTimeZone } from "../utils/helpers";
import { MdLocationPin, MdFreeCancellation } from "react-icons/md";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { RiGalleryUploadFill } from "react-icons/ri";
import { createAttachments, postEvent } from "../utils/api.js";
import { tailwindBgToHex } from "../utils/helpers.js";
import { repeatOptions } from "../constants";
import { v4 as uuidv4 } from "uuid";
import Compressor from "compressorjs";
import Masonry from "react-masonry-css";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Color from "./Color";
import Toggle from "./Toggle";
import TimeSetter from "./TimeSetter";
import SuggestCities from "./SuggestCities";
import NewReminder from "./AddEvent/NewReminder.jsx";
import Portal from "./Portal.jsx";

const AddEvent = () => {
  const {
    setEvents,
    user,
    isOnline,
    setReminders,
    setSystemNotif,
    preferences,
    setEventMap,
  } = useContext(UserContext);
  const {
    setType,
    setAddNewEvent,
    addEventWithStartEndTime,
    setAddEventWithStartEndTime,
  } = useContext(InteractiveContext);
  const { string, setOpenModal, secondString } = useContext(DatesContext);

  // Basic event data
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(null);
  // Location
  const [location, setLocation] = useState(false);
  const [locationObject, setLocationObject] = useState({
    string: "",
    coordinates: null,
  });
  // reminders
  const [reminderOn, setReminderOn] = useState(false);
  const [newReminders, setNewReminders] = useState([]);
  const [showTimerPicker, setShowTimePicker] = useState(false);
  // repeats
  const [repeat, setRepeat] = useState(false);
  const [howOften, setHowOften] = useState(false);
  const [interval, setInterval] = useState(7);
  const [invalid, setInvalid] = useState(false);
  // attachments
  const [attachments, setAttachments] = useState([]);
  const [preview, setPreview] = useState(null);
  // start times
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState(false);
  const [startWhen, setStartWhen] = useState(null);
  const [startTimeString, setStartTimeString] = useState("");
  // end times
  const [endTime, setEndTime] = useState(false);
  const [endTimeString, setEndTimeString] = useState("");
  const [endWhen, setEndWhen] = useState(null);
  //time zone
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [endTimeZone, setEndTimeZone] = useState("");
  // Friends shared with
  const [includedFriends, setIncludedFriends] = useState([]);

  const breakpointColumnsObj = {
    default: 4, // Number of columns by default
    1700: 4,
    1100: 3, // Number of columns on screens > 1100px
    700: 2, // Number of columns on screens > 700px
  };

  useEffect(() => {
    if (addEventWithStartEndTime.start != null) {
      const splitStartTime = addEventWithStartEndTime.start.split(":");
      const today = new Date(string);
      const month = today.getMonth();
      const year = today.getFullYear();
      const day = today.getDate();
      const newStartTime = new Date(
        year,
        month,
        day,
        splitStartTime[0],
        splitStartTime[1],
      );
      const formattedDateString = () => {
        return `${
          splitStartTime[0] > 12
            ? splitStartTime[0] % 12
            : splitStartTime[0] == 0
              ? "12"
              : splitStartTime[0]
        }:${splitStartTime[1]} ${splitStartTime[0] >= 12 ? "PM" : "AM"}`;
      };
      setStartTime(true);
      setStartWhen(() => newStartTime);
      setStartTimeString(formattedDateString);
    }
    if (addEventWithStartEndTime.end !== null) {
      const splitEndTime = addEventWithStartEndTime.end.split(":");
      const today = new Date(string);
      const month = today.getMonth();
      const year = today.getFullYear();
      const day = today.getDate();
      const newEndTime = new Date(
        year,
        month,
        day,
        splitEndTime[0],
        splitEndTime[1],
      );
      const formattedDateString = () => {
        return `${
          splitEndTime[0] > 12
            ? splitEndTime[0] % 12
            : splitEndTime[0] == 0
              ? "12"
              : splitEndTime[0]
        }:${splitEndTime[1]} ${splitEndTime[0] >= 12 ? "PM" : "AM"}`;
      };
      setEndTime(true);
      setEndWhen(() => newEndTime);
      setEndTimeString(formattedDateString);
    }
  }, [addEventWithStartEndTime.start, addEventWithStartEndTime.end]);

  const getEndDate = () => {
    if (secondString) {
      const newDate = new Date(secondString);
      const endDateObj = new Date(endWhen);
      newDate.setHours(endDateObj.getHours());
      newDate.setMinutes(endDateObj.getMinutes());
      // newDate.setTimezoneOffset(() => endTimeZone || timeZone);
      return newDate;
    } else {
      return new Date(string);
    }
  };

  useEffect(() => {
    if (locationObject.coordinates) {
      const coords = locationObject.coordinates;
      const endTimeTimeZone = getTimeZone(coords.lng, coords.lat);
      setEndTimeZone(endTimeTimeZone);
    }
  }, [locationObject]);

  const addEvent = () => {
    const newEventId = uuidv4();
    if (!runChecks()) return;
    if (!isOnline) {
    }

    const date = new Date(string);

    if (isOnline) {
      const newEvent = {
        id: newEventId,
        kind: "Event",
        summary,
        description: description,
        location: location ? locationObject : undefined,
        date: string,
        startDate: date,
        endDate: getEndDate(),
        nextDate: null,
        attachmentLength: attachments.length,
        reminders: {
          reminder: reminderOn,
          remindersToSave: newReminders,
        },
        repeats: {
          repeat,
          howOften: repeat ? howOften : null,
          nextDate: null,
          interval: interval ? interval : 7,
          repeatId: uuidv4(),
        },
        color: color ? color : "bg-white",
        start: {
          startTime: startTime ? (allDay ? null : startWhen) : null,
          timeZone,
        },
        end: {
          endTime: endTime ? (allDay ? null : endWhen) : null,
          timeZone: endTimeZone ? endTimeZone : timeZone,
        },
        userId: user.id,
      };
      postEvent(newEvent, localStorage.getItem("authToken"))
        .then((res) => {
          setAddEventWithStartEndTime({ start: null, end: null });
          setEvents((prev) => [...prev, ...res.data.event]);
          setEventMap((prev) => {
            const newMap = new Map(prev);
            const mapDate = `${date.getFullYear()}-${date.getMonth()}`;

            if (newMap.has(mapDate)) {
              const entry = newMap.get(mapDate);
              newMap.set(mapDate, {
                ...entry,
                events: [...entry.events, newEvent], // new array, not mutated
              });
            } else {
              newMap.set(mapDate, { events: [newEvent] });
            }

            return newMap;
          });

          if (res.data.reminders) {
            setReminders((prev) => [...prev, res.data.reminders]);
          }
          setAddNewEvent(false);
          setType(null);
          setOpenModal(false);
          if (attachments.length > 0) {
            setTimeout(() => {
              createAttachments(
                attachments,
                newEventId,
                localStorage.getItem("authToken"),
              )
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const runChecks = () => {
    if (!summary) {
      const newError = {
        show: true,
        title: "Add Title",
        text: "You must add a title to your new event",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return false;
    }
    if (!color) {
      const newError = {
        show: true,
        title: "Add Color",
        text: "You must add a color to your new event",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return false;
    }
    return true;
  };

  const handleFileChange = async (event) => {
    const newFiles = [...event.target.files];
    for (const file of newFiles) {
      try {
        const compressedFile = await compressImage(file);
        const compressedArrayBuffer = await compressedFile.arrayBuffer();
        const compressedFileContent = new Uint8Array(compressedArrayBuffer);
        const newFile = {
          img: URL.createObjectURL(compressedFile),
          mimetype: file.type,
          filename: file.name,
          content: compressedFileContent,
        };
        setAttachments((prevFiles) => [...prevFiles, newFile]);
      } catch (err) {
        console.log(`Error compressing image: ${err}`);
      }
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.3, // Adjust the quality value as needed (0.0 to 1.0)
        success: (compressedFile) => {
          resolve(compressedFile);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const removeFile = (file) => {
    const newFiles = attachments.filter(
      (attach) => attach.filename !== file.filename,
    );
    setAttachments(newFiles);
  };

  const addReminderToList = (newTimeString) => {
    setShowTimePicker(false);
    const newReminder = {
      id: uuidv4(),
      onlyNotify: false,
      time: newTimeString,
    };

    setNewReminders((prev) => [...prev, newReminder]);
  };

  return (
    <div
      className={`w-full rounded-2xl border shadow-2xl backdrop-blur-md lg:p-4 p-1 ${
        preferences.darkMode
          ? "bg-[#161616]/90 text-white border-white/10"
          : "bg-white/90 text-gray-900 border-black/10"
      }`}
    >
      <input
        type="text"
        placeholder="Event"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className={`mt-2 mb-4 pt-20 pl-3 w-full bg-transparent text-3xl sm:text-4xl font-semibold tracking-tight outline-none placeholder:opacity-60 ${
          preferences.darkMode
            ? "placeholder:text-gray-300"
            : "placeholder:text-gray-500"
        }`}
      />

      <div className="flex flex-wrap justify-center items-center gap-1 py-2 mb-4">
        {colors.map((item, index) => (
          <Color
            key={index}
            string={item.color}
            color={color}
            setColor={setColor}
            index={index}
          />
        ))}
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        id="description"
        className={`mt-2 w-full min-h-[140px] resize-none rounded-2xl border px-4 py-3 outline-none transition-all placeholder:opacity-60 ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 placeholder:text-gray-300 focus:border-red-400/40 focus:ring-2 focus:ring-red-500/20"
            : "bg-white border-black/10 placeholder:text-gray-500 focus:border-red-400/50 focus:ring-2 focus:ring-red-500/10"
        }`}
      />

      <div className="mt-6 space-y-4">
        {/* LOCATION */}
        <div
          className={`rounded-2xl border p-4 shadow-sm transition-all ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`grid place-items-center h-9 w-9 rounded-xl border ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-black/[0.03] border-black/10"
                }`}
              >
                <MdLocationPin />
              </div>
              <div>
                <p className="text-sm font-semibold">Location</p>
                <p className="text-xs opacity-70">Add a place to this event</p>
              </div>
            </div>
            <Toggle condition={location} setCondition={setLocation} />
          </div>

          {location && (
            <div className="mt-4">
              <div
                className={`rounded-2xl border overflow-hidden ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }`}
              >
                <div className="p-3">
                  <SuggestCities
                    setLocationObject={setLocationObject}
                    placeholder="Type in your location..."
                    showGoogleMap={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* REPEAT */}
        <div
          className={`rounded-2xl border p-4 shadow-sm transition-all ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`grid place-items-center h-9 w-9 rounded-xl border ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-black/[0.03] border-black/10"
                }`}
              >
                <FiRepeat />
              </div>
              <div>
                <p className="text-sm font-semibold">Repeat</p>
                <p className="text-xs opacity-70">Set a repeating schedule</p>
              </div>
            </div>
            <Toggle condition={repeat} setCondition={setRepeat} />
          </div>

          {repeat && (
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
                      condition={howOften}
                      setCondition={setHowOften}
                      howOften={intervalString}
                    />
                  </div>
                ))}
              </div>

              {howOften && (
                <input
                  placeholder={`How many ${
                    howOften === "Daily"
                      ? "days"
                      : howOften === "Weekly"
                        ? "weeks"
                        : howOften === "Bi Weekly"
                          ? "times"
                          : howOften === "Monthly"
                            ? "months"
                            : howOften === "Yearly"
                              ? "years"
                              : ""
                  }?`}
                  onChange={(e) => setInterval(Number(e.target.value) || "")}
                  onKeyUp={() => {
                    typeof interval === "number"
                      ? setInvalid(false)
                      : setInvalid(true);
                  }}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition ${
                    invalid
                      ? "bg-red-200 border-red-300 text-black placeholder:text-slate-600"
                      : "bg-emerald-100 border-emerald-200 text-black placeholder:text-slate-600"
                  }`}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* REMINDER */}
        <div
          className={`rounded-2xl border p-4 shadow-sm transition-all ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`grid place-items-center h-9 w-9 rounded-xl border ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-black/[0.03] border-black/10"
                }`}
              >
                <IoIosAlarm />
              </div>
              <div>
                <p className="text-sm font-semibold">Reminder</p>
                <p className="text-xs opacity-70">Get notified ahead of time</p>
              </div>
            </div>
            <Toggle condition={reminderOn} setCondition={setReminderOn} />
          </div>

          {reminderOn && (
            <div className="mt-4">
              <button
                onClick={() => setShowTimePicker(true)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition active:scale-95 ${
                  preferences.darkMode
                    ? "bg-white/10 text-white border border-white/10 hover:bg-white/15"
                    : "bg-black/[0.03] text-black border border-black/10 hover:bg-black/[0.06]"
                }`}
              >
                Add +
              </button>
              {showTimerPicker ? (
                <Portal>
                  <TimeSetter openTimeSetter={addReminderToList} />
                </Portal>
              ) : null}
              {newReminders.map((r) => (
                <NewReminder
                  key={r.id}
                  r={r}
                  color={color}
                  setNewReminders={setNewReminders}
                />
              ))}
            </div>
          )}
        </div>

        {/* ALL DAY */}
        <div
          className={`rounded-2xl border p-4 shadow-sm transition-all ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">All Day Event</p>
              <p className="text-xs opacity-70">Hide start/end time controls</p>
            </div>
            <Toggle condition={allDay} setCondition={setAllDay} />
          </div>
        </div>

        {/* START / END */}
        {!allDay && (
          <div className="space-y-4">
            {/* Start */}
            <div
              className={`rounded-2xl border p-4 shadow-sm transition-all ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/7"
                  : "bg-white border-black/10 hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Start Time</p>
                  <p className="text-xs opacity-70">Choose when it begins</p>
                </div>
                <Toggle condition={startTime} setCondition={setStartTime} />
              </div>

              {startTime && (
                <div className="mt-3">
                  {!startWhen ? (
                    <TimeSetter
                      setDateTime={setStartWhen}
                      setDateTimeString={setStartTimeString}
                      openTimeSetter={setStartTime}
                    />
                  ) : (
                    <div className="mt-2 space-y-2">
                      <p
                        className={`${color} inline-flex items-center rounded-xl border border-black/10 px-3 py-1 text-xs font-semibold shadow-sm`}
                        style={{ color: tailwindBgToHex(color) }}
                      >
                        {startTimeString}
                      </p>

                      <div className="flex gap-2">
                        <button
                          className="text-xs font-semibold text-white rounded-xl px-3 py-1.5 bg-gradient-to-tr from-red-500 to-rose-500 shadow-sm hover:brightness-110 active:scale-95 transition"
                          onClick={() => {
                            setStartWhen(null);
                            setStartTimeString("");
                            setStartTime(false);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="text-xs font-semibold text-white rounded-xl px-3 py-1.5 bg-gradient-to-tr from-emerald-400 to-green-500 shadow-sm hover:brightness-110 active:scale-95 transition"
                          onClick={() => {
                            setStartWhen(null);
                            setStartTimeString("");
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* End */}
            <div
              className={`rounded-2xl border p-4 shadow-sm transition-all ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/7"
                  : "bg-white border-black/10 hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">End Time</p>
                  <p className="text-xs opacity-70">Choose when it ends</p>
                </div>
                <Toggle condition={endTime} setCondition={setEndTime} />
              </div>

              {endTime && (
                <div className="mt-3">
                  {!endWhen ? (
                    <TimeSetter
                      setDateTime={setEndWhen}
                      setDateTimeString={setEndTimeString}
                      openTimeSetter={setEndTime}
                    />
                  ) : (
                    <div className="mt-2 space-y-2">
                      <p
                        style={{ color: tailwindBgToHex(color) }}
                        className={`${color} inline-flex items-center rounded-xl border border-black/10 px-3 py-1 text-xs font-semibold shadow-sm`}
                      >
                        {endTimeString}
                      </p>

                      <div className="flex gap-2">
                        <button
                          className="text-xs font-semibold text-white rounded-xl px-3 py-1.5 bg-gradient-to-tr from-red-500 to-rose-500 shadow-sm hover:brightness-110 active:scale-95 transition"
                          onClick={() => {
                            setEndWhen(null);
                            setEndTimeString("");
                            setEndTime(false);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="text-xs font-semibold text-white rounded-xl px-3 py-1.5 bg-gradient-to-tr from-emerald-400 to-green-500 shadow-sm hover:brightness-110 active:scale-95 transition"
                          onClick={() => {
                            setEndWhen(null);
                            setEndTimeString("");
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview overlay */}
      {preview ? (
        <div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/60 p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview.img}
            alt="preview"
            className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain"
          />
        </div>
      ) : null}

      {/* Attachments */}
      <div
        className="mt
-8 mb-12"
      >
        {attachments.length > 0 && (
          <div
            className={`rounded-2xl border p-3 shadow-sm ${
              preferences.darkMode ? "border-white/10" : "border-black/10"
            }`}
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid-attachments"
              columnClassName="my-masonry-grid_column-attachments"
            >
              {attachments.map((attachment) => (
                <div key={attachment.filename} className="p-1">
                  {attachment.mimetype.startsWith("image/") ? (
                    <div className="relative group">
                      <button
                        type="button"
                        className="absolute -top-2 -left-2 z-10 rounded-full bg-white/90 shadow-md p-1 opacity-90 hover:opacity-100 active:scale-95 transition"
                        onClick={() => removeFile(attachment)}
                      >
                        <AiFillCloseCircle className="text-red-500" />
                      </button>
                      <img
                        src={attachment.img}
                        alt="preview"
                        onClick={() => setPreview({ img: attachment.img })}
                        className="rounded-2xl shadow-sm object-cover w-full transition hover:shadow-md cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="text-xs p-3 rounded-2xl shadow-sm border bg-slate-50">
                      <p className="font-semibold">{attachment.filename}</p>
                    </div>
                  )}
                </div>
              ))}
            </Masonry>
          </div>
        )}

        <label
          className={`mt-6 w-full rounded-2xl border border-dashed p-6 grid place-items-center gap-1 cursor-pointer transition ${
            preferences.darkMode
              ? "border-white/15 hover:bg-white/5"
              : "border-black/15 hover:bg-black/[0.02]"
          }`}
        >
          <RiGalleryUploadFill className="text-2xl" />
          {attachments.length > 0 ? (
            <p className="text-xs font-semibold opacity-80">Add More</p>
          ) : (
            <p className="text-[11px] opacity-70">.jpeg .png .svg .pdf .docx</p>
          )}
          <input
            type="file"
            accept=".jpeg .png .svg .pdf .docx"
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between px-1 items-center w-full">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-red-500 to-rose-500 text-white"
          aria-label="Cancel"
        >
          <MdFreeCancellation className="text-xl" />
        </button>

        <button
          onClick={() => addEvent()}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-lime-400 to-emerald-500 text-white"
          aria-label="Add event"
        >
          <BsFillCalendarPlusFill className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
