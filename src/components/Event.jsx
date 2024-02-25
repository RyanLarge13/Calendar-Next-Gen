import { useState, useEffect, useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { MdLocationPin, MdOutlineDragIndicator } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion, useDragControls } from "framer-motion";
import { fetchAttachments } from "../utils/api";
import { formatDbText } from "../utils/helpers";
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
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ); // Beginning of the day

    let timeUntilStart = start - now; // Difference in milliseconds from start of day to event start
    let timeUntilEnd = end - now; // Difference in milliseconds from start of day to event end
    let eventDuration = end - start;

    if (now < start) {
      let startHours = Math.floor(timeUntilStart / (1000 * 60 * 60));
      let startMinutes = Math.floor(
        (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)
      );
      let startSeconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);
      const startTimeString = `${startHours} hours ${startMinutes} minutes ${startSeconds} seconds`;
      let startPercentage =
        Math.max(0, (eventDuration - timeUntilStart) / eventDuration) * 100;
      setWidth(startPercentage);
      setTimeLeft(startTimeString);
    } else {
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
    return () => {};
  }, [event]);

  //  useEffect(() => {
  //   let interval;
  //   let timeLeftInterval;
  //   let timeInLeft;
  //   if (
  //    event &&
  //    new Date(event.date).toLocaleDateString() === new Date().toLocaleDateString()
  //   ) {
  //    const startHourMinutes = new Date(event.start.startTime).getHours() * 60;
  //    const nowHourMinutes = new Date().getHours() * 60;
  //    const startMinutes = new Date(event.start.startTime).getMinutes();
  //    const nowMinutes = new Date().getMinutes();
  //    const totalMinutesToStart = startHourMinutes + startMinutes;
  //    timeLeftInterval = setInterval(() => {
  //     checkTimeLeft();
  //    }, 1000);
  //    interval = setInterval(() => {
  //     calcTime(totalMinutesToStart);
  //    }, 1000);
  //    timeInLeft = setInterval(() => {
  //     calcTimeIn();
  //    }, 1000);
  //    if (totalMinutesToStart <= nowMinutes + nowHourMinutes) {
  //     clearInterval(interval);
  //     clearInterval(timeLeftInterval);
  //     setWidth(98);
  //    }
  //   }

  //   const calcTimeIn = () => {
  //    const currentHours = new Date().getHours();
  //    const currentMinutes = new Date().getMinutes();
  //    const startHours = new Date(event.start.startTime).getHours();
  //    const startMinutes = new Date(event.start.startTime).getMinutes();
  //    const endHours = new Date(event.end.endTime).getHours();
  //    const endMinutes = new Date(event.end.endTime).getMinutes();
  //    const totalStartMinutes = startHours * 60 + startMinutes;
  //    const totalEndMinutes = endHours * 60 + endMinutes;
  //    const totalNowMinutes = currentHours * 60 + currentMinutes;
  //    const denominator = totalNowMinutes - totalStartMinutes;
  //    const numerator = totalEndMinutes - totalStartMinutes;
  //    const result = (denominator / numerator) * 100;
  //    if (result >= 98) {
  //     clearInterval(timeInLeft);
  //     return setTimeInEvent(98);
  //    }
  //    if (result < 0) {
  //     clearInterval(timeInLeft);
  //     return setTimeInEvent(0);
  //    }
  //    setTimeInEvent(result);
  //   };

  //   const checkTimeLeft = () => {
  //    const startHours = new Date(event.start.startTime).getHours();
  //    const startMinutes = new Date(event.start.startTime).getMinutes();
  //    const startSeconds = new Date(event.start.startTime).getSeconds();
  //    const currentHours = new Date().getHours();
  //    const currentMinutes = new Date().getMinutes();
  //    const currentSeconds = new Date().getSeconds();
  //    const hoursLeft = startHours - currentHours;
  //    const minutesLeft = (currentMinutes - (startMinutes + 60)) * -1;
  //    const secondsLeft = (currentSeconds - (startSeconds + 60)) * -1;
  //    const timeString = `${hoursLeft - 1}:${
  //     minutesLeft < 11 ? `0${minutesLeft - 1}` : minutesLeft - 1
  //    }:${secondsLeft < 11 ? `0${secondsLeft - 1}` : secondsLeft - 1}`;
  //    setTimeLeft(hoursLeft <= 0 ? null : timeString);
  //   };

  //   const calcTime = start => {
  //    const currentHourMinutes = new Date().getHours() * 60;
  //    const currentMinutes = new Date().getMinutes();
  //    const now = currentMinutes + currentHourMinutes;
  //    const first = start - now;
  //    const decimal = first / start;
  //    const final = 100 - Math.round(decimal * 100);
  //    if (final >= 100) {
  //     clearInterval(interval);
  //     return setWidth(98);
  //    }
  //    if (final < 100) {
  //     return setWidth(final - 2);
  //    }
  //   };
  //   return () => {
  //    clearInterval(timeLeftInterval);
  //    clearInterval(interval);
  //    clearInterval(timeInLeft);
  //   };
  //  }, [event]);

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
      animate={{ y: 0 }}
      className={`z-[901] will-change-transform fixed inset-3 top-[7%] rounded-md ${
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
              setEvent(false);
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
              <div className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full justify-between items-center bg-white">
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
              <div className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full justify-between items-center bg-white">
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
              <p className="text-[14px]">No location provided</p>
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
              <p className="text-[14px]">No reminders set</p>
            )}
          </div>
          <div className="bg-white rounded-md shadow-md p-2 my-2">
            {event.repeats.repeat ? (
              <div className="">
                <FiRepeat />
                <p>{event.repeats.howOften}</p>
              </div>
            ) : (
              <p className="text-[14px]">No repeated events</p>
            )}
          </div>
          <div>
            {lists
              .filter((aList) => aList.eventId === event.id)
              .map((list) => (
                <div>{list.title}</div>
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
