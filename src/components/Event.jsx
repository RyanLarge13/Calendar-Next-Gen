import { useState, useEffect, useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
  BsFillTrashFill,
} from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { MdLocationPin, MdOutlineDragIndicator } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion, useDragControls } from "framer-motion";
import { fetchAttachments } from "../utils/api";
import GoogleMaps from "./GoogleMaps";
import Masonry from "react-masonry-css";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const Event = ({ dayEvents }) => {
  const { event, setEvent } = useContext(InteractiveContext);
  const { dateObj, setString } = useContext(DatesContext);
  const [open, setOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [width, setWidth] = useState(0);
  const [timeInEvent, setTimeInEvent] = useState(0);
  const [index, setIndex] = useState(dayEvents.indexOf(event));
  const [imagesLoading, setImagesLoading] = useState(false);

  const controls = useDragControls();

  const breakpointColumnsObj = {
    default: 4, // Number of columns by default
    1100: 3, // Number of columns on screens > 1100px
    700: 2, // Number of columns on screens > 700px
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
    let interval;
    let timeLeftInterval;
    let timeInLeft;
    if (
      event &&
      new Date(event.date).toLocaleDateString() ===
        new Date().toLocaleDateString()
    ) {
      const startHourMinutes = new Date(event.start.startTime).getHours() * 60;
      const nowHourMinutes = new Date().getHours() * 60;
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const nowMinutes = new Date().getMinutes();
      const totalMinutesToStart = startHourMinutes + startMinutes;
      timeLeftInterval = setInterval(() => {
        checkTimeLeft();
      }, 1000);
      interval = setInterval(() => {
        calcTime(totalMinutesToStart);
      }, 1000);
      timeInLeft = setInterval(() => {
        calcTimeIn();
      }, 1000);
      if (totalMinutesToStart <= nowMinutes + nowHourMinutes) {
        clearInterval(interval);
        clearInterval(timeLeftInterval);
        // clearInterval(timeInLeft);
        // setTimeInEvent(98);
        setWidth(98);
      }
    }

    const calcTimeIn = () => {
      const currentHours = new Date().getHours();
      const currentMinutes = new Date().getMinutes();
      const startHours = new Date(event.start.startTime).getHours();
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const endHours = new Date(event.end.endTime).getHours();
      const endMinutes = new Date(event.end.endTime).getMinutes();
      const totalStartMinutes = startHours * 60 + startMinutes;
      const totalEndMinutes = endHours * 60 + endMinutes;
      const totalNowMinutes = currentHours * 60 + currentMinutes;
      const denominator = totalNowMinutes - totalStartMinutes;
      const numerator = totalEndMinutes - totalStartMinutes;
      const result = (denominator / numerator) * 100;
      if (result >= 98) {
        clearInterval(timeInLeft);
        return setTimeInEvent(98);
      }
      if (result < 0) {
        clearInterval(timeInLeft);
        return setTimeInEvent(0);
      }
      setTimeInEvent(result);
    };

    const checkTimeLeft = () => {
      const startHours = new Date(event.start.startTime).getHours();
      const startMinutes = new Date(event.start.startTime).getMinutes();
      const startSeconds = new Date(event.start.startTime).getSeconds();
      const currentHours = new Date().getHours();
      const currentMinutes = new Date().getMinutes();
      const currentSeconds = new Date().getSeconds();
      const hoursLeft = startHours - currentHours;
      const minutesLeft = (currentMinutes - (startMinutes + 60)) * -1;
      const secondsLeft = (currentSeconds - (startSeconds + 60)) * -1;
      const timeString = `${hoursLeft - 1}:${
        minutesLeft < 11 ? `0${minutesLeft - 1}` : minutesLeft - 1
      }:${secondsLeft < 11 ? `0${secondsLeft - 1}` : secondsLeft - 1}`;
      setTimeLeft(hoursLeft <= 0 ? null : timeString);
    };

    const calcTime = (start) => {
      const currentHourMinutes = new Date().getHours() * 60;
      const currentMinutes = new Date().getMinutes();
      const now = currentMinutes + currentHourMinutes;
      const first = start - now;
      const decimal = first / start;
      const final = 100 - Math.round(decimal * 100);
      if (final >= 100) {
        clearInterval(interval);
        return setWidth(98);
      }
      if (final < 100) {
        return setWidth(final - 2);
      }
    };
    return () => {
      clearInterval(timeLeftInterval);
      clearInterval(interval);
      clearInterval(timeInLeft);
    };
  }, [event]);

  const getPreviousEvent = () => {
    if (index > 0) {
      setTimeLeft(null);
      setEvent(dayEvents[index - 1]);
      setIndex((prev) => prev - 1);
    } else {
      setOpen(false);
      setTimeout(() => {
        setEvent(null);
      }, 100);
    }
  };

  const getNextEvent = () => {
    if (index < dayEvents.length - 1) {
      setTimeLeft(null);
      setEvent(dayEvents[index + 1]);
      setIndex((prev) => prev + 1);
    } else {
      setOpen(false);
      setTimeout(() => {
        setEvent(null);
      }, 100);
    }
  };

  const checkToClose = (e, info) => {
    const end = info.point.y;
    if (end > window.innerHeight / 2) {
      setOpen(false);
      setTimeout(() => {
        setEvent(null);
      }, 100);
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
      animate={open ? { y: 0 } : { y: "110%" }}
      className="z-[901] fixed inset-3 top-[7%] rounded-md bg-white overflow-y-auto"
    >
      <div
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
        className="px-3 py-5 sticky top-0 right-0 left-0 z-20 bg-white rounded-md shadow-md flex justify-between items-center"
      >
        <button
          onClick={() => {
            setOpen(false);
            setTimeout(() => {
              setEvent(false);
            }, 500);
          }}
        >
          <AiFillCloseCircle />
        </button>
        <MdOutlineDragIndicator />
      </div>
      <div className={`rounded-md bg-opacity-20 p-3 ${event.color}`}>
        <div className={`p-2 rounded-md shadow-sm font-bold ${event.color}`}>
          <h1 className="text-[20px]">{event.summary}</h1>
        </div>
        <div
          className={`p-2 mt-2 rounded-md shadow-sm font-bold ${event.color} bg-opacity-50`}
        >
          <p className="text-[14px]">{event.description}</p>
        </div>
        {event.start.startTime && (
          <div>
            <div className="relative mt-2 py-2 px-3 rounded-3xl shadow-sm flex w-full justify-between items-center bg-white">
              <motion.div
                animate={{
                  width: `${width}%`,
                  transition: { duration: 0.1, type: "spring", stiffness: 400 },
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
                  transition: { duration: 0.1, type: "spring", stiffness: 400 },
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
                  <p>{event.location.string}</p>
                </div>
                <div
                  className="mr-5"
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
        <div className="p-2 rounded-md shadow-md my-2 flex justify-between items-start bg-white">
          {event.reminders.reminder ? (
            <div>
              <div>
                <IoIosAlarm />
                <p>{new Date(event.reminders.when).toLocaleTimeString()}</p>
              </div>
              <div>
                <BsFillTrashFill />
              </div>
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
        <div className="sticky top-[50%] right-2 left-2 py-2 flex justify-between items-center text-xl">
          {index > 0 ? (
            <BsFillArrowLeftCircleFill onClick={() => getPreviousEvent()} />
          ) : (
            null
          )}
          {index < dayEvents.length - 1 ? (
            <BsFillArrowRightCircleFill onClick={() => getNextEvent()} />
          ) : (
            null
          )}
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
    </motion.div>
  );
};

export default Event;
