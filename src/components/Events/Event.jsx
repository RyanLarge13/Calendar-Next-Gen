import Compressor from "compressorjs";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaExternalLinkAlt, FaImage, FaTrash } from "react-icons/fa";
import { FiMaximize, FiMinimize, FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { MdLocationPin, MdOutlineDragIndicator } from "react-icons/md";
import Masonry from "react-masonry-css";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import {
  API_UpdateEventDesc,
  API_UpdateEventLocation,
  API_UpdateEventTitle,
  createAttachments,
  fetchAttachments,
} from "../../utils/api.js";
import { formatTime, tailwindBgToHex } from "../../utils/helpers.js";
import GoogleMaps from "../Misc/GoogleMaps";
import SuggestCities from "../Misc/SuggestCities.jsx";
import Reminder from "../Reminders/Reminder.jsx";

const Event = ({ dayEvents = [] }) => {
  const { event, setEvent, setAddNewEvent, setType, menu, setMenu } =
    useContext(InteractiveContext);
  const { preferences, setEventMap, reminders } = useContext(UserContext);
  const { string, setOpenModal, setString } = useContext(DatesContext);

  const [timeLeft, setTimeLeft] = useState(null);
  const [width, setWidth] = useState(0);
  const [timeInEvent, setTimeInEvent] = useState(0);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [maximize, setMaximize] = useState(false);
  const [title, setTitle] = useState(event.summary);
  const [description, setDescription] = useState(event.description);
  const [imageViewer, setImageViewer] = useState({ image: null, show: false });
  const [location, setLocation] = useState(event.location);

  const [inputChanges, setInputChanges] = useState({
    summary: event.summary,
    description: event.description,
    location: event.location,
  });

  const controls = useDragControls();

  const breakpointColumnsObj = {
    default: 4,
    1700: 4,
    1100: 3,
    700: 2,
  };

  useEffect(() => {
    if (event.attachmentLength > 0) {
      setImagesLoading(true);
      const token = localStorage.getItem("authToken");
      fetchAttachments(event.id, token)
        .then((res) => {
          console.log("Attachment response from server for event");
          console.log(res);
          setFetchedImages(res.data.attachments);
          setImagesLoading(false);
        })
        .catch((err) => console.log(err));
    }
    return () => setFetchedImages([]);
  }, []);

  useEffect(() => {
    if (!event) return;
    const isToday =
      new Date(event.date).toLocaleDateString() ===
      new Date().toLocaleDateString();
    if (!isToday) return;

    const start = new Date(event.start.startTime);
    const end = new Date(event.end.endTime);

    const timeInterval = setInterval(() => {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      let timeUntilStart = start - now;
      let timeUntilEnd = end - now;
      let eventDuration = end - start;
      if (now < start) {
        let startHours = Math.floor(timeUntilStart / (1000 * 60 * 60));
        let startMinutes = Math.floor(
          (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60),
        );
        let startSeconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);
        const startTimeString = `${startHours > 0 ? startHours + "h" : ""} ${
          startMinutes > 0 ? startMinutes + "m" : ""
        } ${startSeconds}s`;
        let startPercentage =
          Math.max(0, (eventDuration - timeUntilStart) / eventDuration) * 100;
        setWidth(startPercentage);
        setTimeLeft(startTimeString);
      } else {
        setWidth(0);
        setTimeLeft("");
        if (now > end) return;
        let endHours = Math.floor(timeUntilEnd / (1000 * 60 * 60));
        let endMinutes = Math.floor(
          (timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60),
        );
        let endSeconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);
        const endTimeString = `${endHours} hours ${endMinutes} minutes ${endSeconds} seconds`;
        let endPercentage =
          Math.max(0, (eventDuration - timeUntilEnd) / eventDuration) * 100;
        setTimeInEvent(endPercentage);
      }
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [event]);

  const checkToClose = (e, info) => {
    const end = info.point.y;
    if (end > window.innerHeight / 2) {
      setEvent(null);
    }
  };

  const startDrag = (e) => {
    controls.start(e);
  };

  const updateTitle = async (e) => {
    e.preventDefault();

    if (!title) {
      // set notification
      return;
    }

    if (inputChanges.summary === title) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await API_UpdateEventTitle(event.id, title, token);

      setInputChanges((prev) => ({ ...prev, summary: title }));
      setEventMap((prev) => {
        const date = new Date(string);
        const newMap = new Map(prev);
        const mapDate = `${date.getFullYear()}-${date.getMonth()}`;

        if (newMap.has(mapDate)) {
          const entry = newMap.get(mapDate);
          const entryEvents = entry?.events || [];

          const newEvents = entryEvents.map((e) =>
            e.id === event.id ? { ...e, summary: title } : e,
          );
          newMap.set(mapDate, {
            ...entry,
            events: newEvents, // new array, not mutated
          });
        }

        return newMap;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateDesc = async (e) => {
    e.preventDefault();

    if (!description) {
      // set notification
      return;
    }

    if (inputChanges.description === description) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await API_UpdateEventDesc(event.id, description, token);

      setInputChanges((prev) => ({ ...prev, description: description }));
      setEventMap((prev) => {
        const date = new Date(string);
        const newMap = new Map(prev);
        const mapDate = `${date.getFullYear()}-${date.getMonth()}`;

        if (newMap.has(mapDate)) {
          const entry = newMap.get(mapDate);
          const entryEvents = entry?.events || [];

          const newEvents = entryEvents.map((e) =>
            e.id === event.id ? { ...e, description: description } : e,
          );
          newMap.set(mapDate, {
            ...entry,
            events: newEvents, // new array, not mutated
          });
        }

        return newMap;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocation = async (newLocationObject) => {
    /*
      TODO:
        IMPLEMENT:
          1. Update google maps with new location when updating location. Needs coordinates
    */

    if (!newLocationObject) {
      // set notification
      return;
    }

    if (inputChanges?.location?.string === newLocationObject.string) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await API_UpdateEventLocation(event.id, newLocationObject, token);

      setInputChanges((prev) => ({
        ...prev,
        location: newLocationObject,
      }));
      setLocation(newLocationObject);
      setEventMap((prev) => {
        const date = new Date(string);
        const newMap = new Map(prev);
        const mapDate = `${date.getFullYear()}-${date.getMonth()}`;

        if (newMap.has(mapDate)) {
          const entry = newMap.get(mapDate);
          const entryEvents = entry?.events || [];

          const newEvents = entryEvents.map((e) =>
            e.id === event.id ? { ...e, location: newLocationObject } : e,
          );
          newMap.set(mapDate, {
            ...entry,
            events: newEvents, // new array, not mutated
          });
        }

        return newMap;
      });
    } catch (err) {
      console.log(err);
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

  const uploadFiles = async (e) => {
    const newFiles = [...e.target.files];
    const uploadableAttachments = [];

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
        uploadableAttachments.push(newFile);
      } catch (err) {
        console.log(`Error compressing image: ${err}`);
      }
    }

    setFetchedImages((prev) => [
      ...prev,
      ...uploadableAttachments.map((img) => img.img),
    ]);

    try {
      const token = localStorage.getItem("authToken");
      await createAttachments(uploadableAttachments, event.id, token);
    } catch (err) {
      console.log(`Error uploading new attachments. Error: ${err}`);
    }
  };

  const addReminderToEvent = () => {
    setType("reminder");
    setString(new Date(event.date).toLocaleDateString());
    if (menu) {
      setMenu(false);
    }
    setOpenModal(true);
    setAddNewEvent(true);
  };

  return (
    <>
      {/* Image Viewer */}
      <AnimatePresence>
        {imageViewer.image && imageViewer.show ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-[999]"
          >
            <div className="relative w-full h-full flex justify-center items-center p-4">
              {/* Close button */}
              <button
                onClick={() => setImageViewer({ image: null, show: false })}
                className="absolute top-6 right-6 text-white text-3xl hover:text-red-400 transition-colors"
              >
                ✕
              </button>

              {/* Image */}
              <img
                src={imageViewer.image}
                alt="Preview"
                className="max-h-full max-w-full rounded-2xl shadow-lg object-contain"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Event */}
      <motion.div
        drag="y"
        dragControls={controls}
        dragSnapToOrigin
        dragConstraints={{ top: 0 }}
        dragListener={false}
        onDragEnd={checkToClose}
        initial={{ y: "100%" }}
        exit={{ y: "100%" }}
        animate={{ y: 0 }}
        className={`z-[901] fixed inset-0 lg:left-0 lg:bottom-0 ${
          maximize ? "lg:right-0" : "lg:right-[66%]"
        } will-change-transform top-20 overflow-y-auto rounded-t-2xl shadow-2xl
    ${
      preferences.darkMode
        ? "bg-[#1e1e1e] text-white border border-white/10"
        : "bg-white text-gray-900 border border-gray-200"
    }`}
      >
        {/* Header */}
        <div
          onPointerDown={startDrag}
          style={{ touchAction: "none" }}
          className={`sticky top-0 z-20 flex items-center justify-between p-3 border-b backdrop-blur-md rounded-t-2xl
      ${
        preferences.darkMode
          ? "bg-[#222]/80 text-white border-white/10"
          : "bg-white/80 text-gray-900 border-gray-200"
      }`}
        >
          <button
            onClick={() => setEvent(null)}
            className="text-xl text-gray-400 hover:text-red-500 transition"
          >
            <AiFillCloseCircle />
          </button>

          <div className="flex gap-4 items-center">
            {!maximize ? (
              <button
                className="hidden lg:block text-gray-400 hover:text-cyan-500 transition"
                onClick={() => setMaximize(true)}
              >
                <FiMaximize />
              </button>
            ) : (
              <button
                className="hidden lg:block text-gray-400 hover:text-cyan-500 transition"
                onClick={() => setMaximize(false)}
              >
                <FiMinimize />
              </button>
            )}
            <button className="text-gray-400 hover:text-cyan-500 transition">
              <MdOutlineDragIndicator />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`p-6 ${
            maximize
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min"
              : "space-y-6"
          }`}
        >
          {/* Title */}
          <form
            onSubmit={updateTitle}
            className={`p-3 rounded-xl shadow-sm border ${event.color} ${
              maximize ? "" : ""
            }`}
          >
            <input
              style={{ color: tailwindBgToHex(event.color) }}
              type="text"
              className="w-full text-2xl font-bold bg-transparent focus:outline-none"
              placeholder={title}
              value={title}
              onBlur={updateTitle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>

          {/* Description */}
          <form
            onSubmit={updateDesc}
            className={`p-3 rounded-xl shadow-sm border ${event.color}`}
          >
            <textarea
              style={{ color: tailwindBgToHex(event.color) }}
              className="w-full text-base outline-none bg-transparent resize-none focus:outline-none whitespace-pre-wrap"
              placeholder="Add a description..."
              rows={6}
              value={description}
              onBlur={updateDesc}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>

          {/* Time progress */}
          {event.start.startTime && (
            <div className="space-y-3">
              {/* Until Start */}
              <div className="relative rounded-xl shadow-sm p-3 flex items-center justify-between overflow-hidden border">
                <motion.div
                  animate={{ width: `${width}%` }}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 rounded-xl"
                />
                <span className="z-10 font-semibold">{timeLeft}</span>
                <span className="z-10 text-sm text-gray-500">
                  {new Date(event.start.startTime).toLocaleTimeString()}
                </span>
              </div>

              {/* In Progress */}
              <div className="relative rounded-xl shadow-sm p-3 flex items-center justify-between overflow-hidden border">
                <motion.div
                  animate={{ width: `${timeInEvent}%` }}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 rounded-xl"
                />
                <span className="z-10 text-sm text-gray-500">
                  {new Date(event.start.startTime).toLocaleTimeString()}
                </span>
                <span className="z-10 text-sm text-gray-500">
                  {new Date(event.end.endTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="p-3 rounded-xl shadow-sm border">
            <p className="font-semibold">{formatTime(new Date(event.date))}</p>
          </div>

          {/* Location */}
          <div className="p-3 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MdLocationPin /> Location
              </h3>
              {location?.string && location?.coordinates ? (
                <div className="flex gap-3 text-gray-500">
                  <button
                    onClick={() =>
                      updateLocation({ string: "", coordinates: null })
                    }
                    className="hover:text-red-500 transition"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="hover:text-green-500 transition"
                    onClick={() =>
                      (window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${event.location.string}`)
                    }
                  >
                    <FaExternalLinkAlt />
                  </button>
                </div>
              ) : null}
            </div>
            {location?.string && location?.coordinates ? (
              <p className="text-sm text-gray-700 ml-2">{location.string}</p>
            ) : null}
            <SuggestCities
              setLocationObject={updateLocation}
              placeholder="Change event location..."
              showGoogleMap={false}
            />
            {location?.string && location?.coordinates ? (
              <div className="mt-4">
                <GoogleMaps coordinates={location.coordinates} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No Location Provided</p>
            )}
          </div>

          {/* Reminders */}
          <div className="p-3 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <IoIosAlarm /> Reminder
              </h3>
              <button
                onClick={addReminderToEvent}
                className="text-sm font-medium text-cyan-600 hover:underline"
              >
                + Add
              </button>
            </div>
            {event.reminders.reminder ? (
              event.reminders?.eventReminders?.map((r) => {
                const eventReminder = reminders.find((rem) => rem.id === r.id);

                return eventReminder ? (
                  <Reminder
                    key={eventReminder.id}
                    reminder={eventReminder}
                    showOpenEvent={false}
                  />
                ) : null;
              })
            ) : (
              <p className="text-sm text-gray-500">No reminders set</p>
            )}
          </div>

          {/* Repeat */}
          <div className="p-3 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FiRepeat /> Repeat
              </h3>
              <button className="text-sm font-medium text-cyan-600 hover:underline">
                + Create
              </button>
            </div>
            {event.repeats.repeat ? (
              <p className="text-sm">{event.repeats.howOften}</p>
            ) : (
              <p className="text-sm text-gray-500">No repeat set</p>
            )}
          </div>

          {/* Attachments */}
          <div className="p-3 rounded-xl shadow-sm border col-span-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FaImage /> Attachments
              </h3>
              <label className="text-sm font-medium text-cyan-600 hover:underline">
                + Add
                <input
                  type="file"
                  accept=".jpeg .png .svg .pdf .docx"
                  onChange={uploadFiles}
                  multiple
                  placeholder="png svg jpeg pdf word"
                  className="w-0 h-0"
                />
              </label>
            </div>
            {imagesLoading ? (
              <p className="text-sm text-gray-500">
                Loading {event.attachmentLength} images...
              </p>
            ) : fetchedImages.length > 0 ? (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid-attachments"
                columnClassName="my-masonry-grid_column-attachments"
              >
                {/* Map through both newly uploaded attachments and attachments already associated with the event */}
                {[...fetchedImages].map((img) => (
                  <img
                    key={img}
                    src={img}
                    onClick={() => setImageViewer({ image: img, show: true })}
                    alt="attachment"
                    className="rounded-lg m-1 shadow-sm hover:shadow-md transition"
                  />
                ))}
              </Masonry>
            ) : (
              <p className="text-sm text-gray-500">No attachments</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Event;
