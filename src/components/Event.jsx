import { useState, useEffect, useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { MdLocationPin, MdOutlineDragIndicator } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion, useDragControls } from "framer-motion";
import { fetchAttachments } from "../utils/api";
import { formatDbText, formatTime } from "../utils/helpers";
import GoogleMaps from "./GoogleMaps";
import Masonry from "react-masonry-css";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Event = ({ dayEvents }) => {
  const { event, setEvent } = useContext(InteractiveContext);
  const { preferences, lists } = useContext(UserContext);
  const [timeLeft, setTimeLeft] = useState(null);
  const [width, setWidth] = useState(0);
  const [timeInEvent, setTimeInEvent] = useState(0);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const controls = useDragControls();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
  };

  useEffect(() => {
    if (event.attachmentLength > 0) {
      setImagesLoading(true);
      fetchAttachments(event.id)
        .then((res) => {
          res.data.attachments.forEach((file) => {
            const blob = new Blob([new Uint8Array(file.content.data)], {
              type: file.mimetype,
            });
            const url = URL.createObjectURL(blob);
            setFetchedImages((prevUrls) => [...prevUrls, url]);
            setImagesLoading(false);
          });
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
        now.getDate()
      );
      let timeUntilStart = start - now;
      let timeUntilEnd = end - now;
      let eventDuration = end - start;
      if (now < start) {
        let startHours = Math.floor(timeUntilStart / (1000 * 60 * 60));
        let startMinutes = Math.floor(
          (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)
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
          (timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60)
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

  return (
    <motion.div
      drag="y"
      dragControls={controls}
      dragSnapToOrigin="true"
      dragConstraints={{ top: 0 }}
      dragListener={false}
      onDragEnd={checkToClose}
      initial={{ y: "100%" }}
      exit={{ y: "100%" }}
      animate={{ y: 0 }}
      className={`z-[901] will-change-transform fixed inset-0 top-[6%] rounded-md ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      } overflow-y-auto`}
    >
      <div className={`${event.color} min-h-full bg-opacity-20`}>
        <div
          onPointerDown={startDrag}
          style={{ touchAction: "none" }}
          className={`px-3 py-5 sticky top-0 right-0 left-0 z-20 ${
            preferences.darkMode
              ? "bg-[#222] text-white"
              : "bg-white text-black"
          } rounded-md shadow-md flex justify-between items-center`}
        >
          <button
            onClick={() => {
              setEvent(null);
            }}
          >
            <AiFillCloseCircle />
          </button>
          <MdOutlineDragIndicator />
        </div>
        <div className="rounded-md p-3">
          <div className={`p-2 rounded-md shadow-sm font-bold ${event.color}`}>
            <h1 className="text-[20px]">{event.summary}</h1>
          </div>
          <div
            className={`p-2 mt-2 rounded-md shadow-sm font-bold ${event.color} bg-opacity-50`}
          >
            <div>
              {formatDbText(event.description || "").map((text, index) => (
                <p key={index} className="text-[14px]">
                  {text}
                </p>
              ))}
            </div>
          </div>
          {event.start.startTime && (
            <div>
              <div
                className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full
       justify-between items-center bg-white overflow-hidden"
              >
                <motion.div
                  animate={{
                    width: `${width}%`,
                    transition: {
                      duration: 0.1,
                      type: "spring",
                      stiffness: 400,
                    },
                  }}
                  className={`absolute left-1 top-1 bottom-1 ${
                    event.color === "bg-white" ? "bg-slate-200" : event.color
                  } bg-opacity-50 rounded-3xl`}
                ></motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 1.5 } }}
                  className="z-10 font-bold"
                >
                  {timeLeft}
                </motion.p>
                <p className="z-10">
                  {new Date(event.start.startTime).toLocaleTimeString()}
                </p>
              </div>
              <div
                className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full
       justify-between items-center bg-white overflow-hidden"
              >
                <motion.div
                  animate={{
                    width: `${timeInEvent}%`,
                    transition: {
                      duration: 0.1,
                      type: "spring",
                      stiffness: 400,
                    },
                  }}
                  className={`absolute left-1 top-1 bottom-1 ${
                    event.color === "bg-white" ? "bg-slate-200" : event.color
                  } bg-opacity-50 rounded-3xl`}
                ></motion.div>
                <p className="z-10">
                  {new Date(event.start.startTime).toLocaleTimeString()}
                </p>
                <p className="z-10">
                  {new Date(event.end.endTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
          <div className="my-2 bg-white rounded-md shadow-md p-2">
            {formatTime(new Date(event.date))}
          </div>
          <div className="my-2 bg-white rounded-md shadow-md p-2">
            {event.location ? (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <MdLocationPin />
                    <p
                      className={`mt-3 p-2 rounded-md shadow-md ${event.color} font-semibold`}
                    >
                      {event.location.string}
                    </p>
                  </div>
                  <div
                    className=""
                    onClick={() =>
                      (window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${event.location.string}`)
                    }
                  >
                    <FaExternalLinkAlt />
                  </div>
                </div>
                <div className="mt-5">
                  <GoogleMaps coordinates={event.location.coordinates} />
                </div>
              </div>
            ) : (
              <div>
                <MdLocationPin />
                <p className="text-[14px]">No location provided</p>
              </div>
            )}
          </div>
          <div className="p-2 rounded-md shadow-md my-2 bg-white">
            {event.reminders.reminder ? (
              <div>
                <div className="flex justify-between items-center">
                  <IoIosAlarm />
                  <div>
                    <BsFillTrashFill />
                  </div>
                </div>
                <p className={`${event.color} mt-3 p-2 rounded-md shadow-md`}>
                  {new Date(event.reminders.when).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <div>
                <IoIosAlarm />
                <p className="text-[14px]">No reminders set</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-md shadow-md p-2 my-2">
            {event.repeats.repeat ? (
              <div className="">
                <FiRepeat />
                <p className={`${event.color} mt-3 p-2 rounded-md shadow-md`}>
                  {event.repeats.howOften}
                </p>
              </div>
            ) : (
              <div>
                <FiRepeat />
                <p className="text-[14px]">No repeated events</p>
              </div>
            )}
          </div>
          <div>
            {lists
              .filter((aList) => aList.eventId === event.id)
              .map((list) => (
                <div
                  key={list.id}
                  className={`scrollbar-hide p-3 rounded-md
            shadow-md ${list.color} my-5 mx-0 mr-7 md:mr-0 pr-10 md:pr-3
            text-black list-none`}
                >
                  <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
                    <p className="font-semibold mr-2">{list.title}</p>
                    <div className="flex gap-x-3 text-sm">
                      <button onClick={() => {}}></button>
                    </div>
                  </div>
                  {/* <ListItems addItems={addItems} listId={list.id} items={list?.items}
        />*/}
                </div>
              ))}
          </div>
          {imagesLoading ? (
            <p>Loading {event.attachmentLength} images...</p>
          ) : (
            fetchedImages.length > 0 && (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid-attachments"
                columnClassName="my-masonry-grid_column-attachments"
              >
                {fetchedImages.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt={"event attachment"}
                    className="mt-3 rounded-sm shadow-sm"
                  />
                ))}
              </Masonry>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Event;
