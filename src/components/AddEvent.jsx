import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { colors } from "../constants";
import { getTimeZone } from "../utils/helpers";
import { MdLocationPin, MdFreeCancellation } from "react-icons/md";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { AiFillCloseCircle, AiFillInfoCircle } from "react-icons/ai";
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
  const [reminder, setReminder] = useState(false);
  const [reminderTimeString, setReminderTimeString] = useState("");
  const [when, setWhen] = useState(null);
  const [onlyNotify, setOnlyNotify] = useState(false);
  const [multiReminders, setMultiReminders] = useState([]);
  const [addAnother, setAddAnother] = useState(false);
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
    Intl.DateTimeFormat().resolvedOptions().timeZone
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
        splitStartTime[1]
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
        splitEndTime[1]
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
          reminder,
          multiReminders: reminder ? multiReminders : [],
          reminderTimeString: reminder ? reminderTimeString : null,
          when: reminder ? when : null,
          onlyNotify: onlyNotify,
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
                localStorage.getItem("authToken")
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

  const formatDescText = (text) => {
    const formattedText = text.replace(/\n/g, "|||");
    return formattedText;
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
      (attach) => attach.filename !== file.filename
    );
    setAttachments(newFiles);
  };

  let newMultiReminder = {};
  const setAnotherWhen = (when, iteration) => {
    const realTime = when();
    if (iteration === 1) {
      newMultiReminder.time = realTime;
    }
    if (iteration === 2) {
      newMultiReminder.when = realTime;
      const newMultiReminders = [...multiReminders, newMultiReminder];
      newMultiReminders.sort((a, b) => new Date(a.when) - new Date(b.when));
      setMultiReminders(newMultiReminders);
      setAddAnother(false);
      newMultiReminder = {};
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Event"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className={`p-2 text-4xl mt-10 mb-5 w-full outline-none duration-200 ${
          preferences.darkMode ? "bg-[#222]" : "bg-white"
        }`}
      />
      <div className="flex flex-wrap justify-center items-center my-5">
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
        cols="30"
        rows="10"
        className={`p-2 mt-5 w-full focus:outline-none focus:shadow-sm ${
          preferences.darkMode ? "bg-[#222]" : "bg-white"
        }`}
      ></textarea>
      <div className="mt-10 w-full">
        <div className="w-full p-3 ">
          <div className="flex justify-between items-center">
            <MdLocationPin />
            <Toggle condition={location} setCondition={setLocation} />
          </div>
          {location && (
            <div>
              <SuggestCities
                setLocationObject={setLocationObject}
                placeholder="Type in your location..."
                showGoogleMap={true}
              />
            </div>
          )}
        </div>
        <div className="w-full p-3 my-5 ">
          <div className="flex justify-between items-center">
            <FiRepeat />
            <Toggle condition={repeat} setCondition={setRepeat} />
          </div>
          {repeat && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {repeatOptions.map((intervalString) => (
                <div
                  key={intervalString}
                  className="flex justify-between items-center pl-2 pr-5 py-3 my-3"
                >
                  <p>{intervalString}</p>
                  <Toggle
                    condition={howOften}
                    setCondition={setHowOften}
                    howOften={intervalString}
                  />
                </div>
              ))}
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
                  className={`${
                    invalid ? "bg-red-300" : "bg-emerald-100"
                  } my-2 outline-none py-1 px-2 rounded-md text-black placeholder:text-slate-500`}
                />
              )}
            </motion.div>
          )}
        </div>
        <div className="w-full p-3 ">
          <div className="flex justify-between items-center">
            <IoIosAlarm />
            <Toggle condition={reminder} setCondition={setReminder} />
          </div>
          {reminder && (
            <div>
              {!when ? (
                <TimeSetter
                  setDateTime={setWhen}
                  setDateTimeString={setReminderTimeString}
                  openTimeSetter={setReminder}
                />
              ) : (
                <>
                  <div className="mt-5">
                    <div className="flex justify-between items-center">
                      <div className="flex justify-center items-center">
                        <AiFillInfoCircle className="mr-2" />
                        <p>Only notify</p>
                      </div>
                      <Toggle
                        condition={onlyNotify}
                        setCondition={setOnlyNotify}
                      />
                    </div>
                  </div>
                  <div>
                    <p
                      style={{ color: tailwindBgToHex(color) }}
                      className={`${color} rounded-md shadow-sm px-2 py-1 mt-3`}
                    >
                      {reminderTimeString}
                    </p>
                    <button
                      className="text-xs rounded-md bg-red-400 font-semibold px-2 py-1 mt-2"
                      onClick={() => {
                        if (multiReminders.length > 0) {
                          setReminderTimeString(multiReminders[0].time);
                          setWhen(multiReminders[0].time);
                          setMultiReminders((prev) => {
                            return prev.filter((r, i) => i !== 0);
                          });
                        } else {
                          setWhen(null);
                          setReminder(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {multiReminders.length > 0 &&
                    multiReminders.map((reminder, index) => (
                      <div>
                        <p
                          style={{ color: tailwindBgToHex(color) }}
                          className={`${color} rounded-md shadow-sm px-2 py-1 mt-3`}
                          key={index}
                        >
                          {reminder.time}
                        </p>
                        <button
                          className="text-xs rounded-md bg-red-400 font-semibold px-2 py-1 mt-2"
                          onClick={() => {
                            setMultiReminders((prev) =>
                              prev.filter((a, i) => i !== index)
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  {addAnother && (
                    <TimeSetter
                      setDateTime={(newWhen) => setAnotherWhen(newWhen, 2)}
                      setDateTimeString={(newTimeString) =>
                        setAnotherWhen(newTimeString, 1)
                      }
                      openTimeSetter={setAddAnother}
                    />
                  )}
                  <div className="mt-3">
                    <button
                      onClick={() => setAddAnother(true)}
                      className={` ${
                        preferences.darkMode
                          ? "bg-black text-white"
                          : "text-black bg-white"
                      } py-1 px-3 rounded-md shadow-md`}
                    >
                      Add Another
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full p-3 mt-5 ">
        <div className="flex justify-between items-center">
          <p>All Day Event</p>
          <Toggle condition={allDay} setCondition={setAllDay} />
        </div>
      </div>
      {!allDay && (
        <>
          <div className="my-3 flex justify-center items-center w-full">
            <div className="w-full mr-1 p-3  cursor-pointer">
              <div className="flex justify-between items-center">
                <p>Start Time</p>
                <Toggle condition={startTime} setCondition={setStartTime} />
              </div>
              {startTime && (
                <div className="mt-2">
                  {!startWhen ? (
                    <TimeSetter
                      setDateTime={setStartWhen}
                      setDateTimeString={setStartTimeString}
                      openTimeSetter={setStartTime}
                    />
                  ) : (
                    <div>
                      <p
                        className={`${color} p-2 rounded-md`}
                        style={{ color: tailwindBgToHex(color) }}
                      >
                        {startTimeString}
                      </p>
                      <button
                        className="text-xs rounded-md bg-red-400 font-semibold px-2 py-1 mt-2"
                        onClick={() => {
                          setStartWhen(null);
                          setStartTimeString("");
                          setStartTime(false);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="text-xs rounded-md bg-emerald-300 font-semibold px-2 py-1 mt-2 ml-2"
                        onClick={() => {
                          setStartWhen(null);
                          setStartTimeString("");
                        }}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-full mr-1 p-3  cursor-pointer">
            <div className="flex justify-between items-center">
              <p>End Time</p>
              <Toggle condition={endTime} setCondition={setEndTime} />
            </div>
            {endTime && (
              <div className="mt-2">
                {!endWhen ? (
                  <TimeSetter
                    setDateTime={setEndWhen}
                    setDateTimeString={setEndTimeString}
                    openTimeSetter={setEndTime}
                  />
                ) : (
                  <div>
                    <p
                      style={{ color: tailwindBgToHex(color) }}
                      className={`${color} rounded-md p-2`}
                    >
                      {endTimeString}
                    </p>
                    <button
                      className="text-xs rounded-md bg-red-400 font-semibold px-2 py-1 mt-2"
                      onClick={() => {
                        setEndWhen(null);
                        setEndTimeString("");
                        setEndTime(false);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-xs rounded-md bg-emerald-300 font-semibold px-2 py-1 mt-2 ml-2"
                      onClick={() => {
                        setEndWhen(null);
                        setEndTimeString("");
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {preview ? (
        <div className="fixed z-[999] inset-0 flex justify-center items-center">
          <img
            src={preview.img}
            alt="preview"
            onClick={() => setPreview(null)}
            className="rounded-sm shadow-sm object-cover"
          />
        </div>
      ) : null}
      <div className="mt-10 mb-20 flex w-full flex-col justify-center items-center">
        {attachments.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid-attachments"
            columnClassName="my-masonry-grid_column-attachments"
          >
            {attachments.map((attachment) => (
              <div key={attachment.filename}>
                {attachment.mimetype.startsWith("image/") ? (
                  <div className="relative">
                    <AiFillCloseCircle
                      className="absolute top-[-5px] left-[-5px]"
                      onClick={() => removeFile(attachment)}
                    />
                    <img
                      src={attachment.img}
                      alt="preview"
                      onClick={() => setPreview(attachment.img)}
                      className="rounded-sm shadow-sm m-1 transition hover:shadow-md"
                    />
                  </div>
                ) : (
                  <div className="text-xs p-3 rounded-md shadow-md bg-slate-100 mt-3">
                    <p>{attachment.filename}</p>
                  </div>
                )}
              </div>
            ))}
          </Masonry>
        )}
        <label
          className="mt-10 p-5 w-full flex flex-col justify-center
        items-center"
        >
          <RiGalleryUploadFill className="text-xl cursor-pointer" />
          {attachments.length > 0 ? (
            <p className="text-xs">Add More</p>
          ) : (
            <p className="text-[10px]">.jpeg .png .svg .pdf .docx</p>
          )}
          <input
            type="file"
            accept=".jpeg .png .svg .pdf .docx"
            onChange={handleFileChange}
            multiple
            placeholder="png svg jpeg pdf word"
            className="w-0 h-0"
          />
        </label>
      </div>
      <div className="flex justify-between px-5 items-center w-full mb-5 font-semibold text-black">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="p-3 rounded-full shadow-md bg-gradient-to-tr from-red-200 to-rose-200"
        >
          <MdFreeCancellation />
        </button>
        <button
          onClick={() => addEvent()}
          className="p-3 rounded-full shadow-md bg-gradient-to-r from-lime-200 to-green-200"
        >
          <BsFillCalendarPlusFill />
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
