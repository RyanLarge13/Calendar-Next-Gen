import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { deleteEvent, deleteRepeats } from "../utils/api.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";
import { tailwindBgToHex } from "../utils/helpers.js";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import weatherCodes from "../utils/weatherCodes.js";

const ModalHeader = ({ allDayEvents }) => {
  const { string, setString, secondString } = useContext(DatesContext);
  const {
    user,
    events,
    setEvents,
    holidays,
    setSystemNotif,
    preferences,
    location,
    weatherData,
    setEventMap,
  } = useContext(UserContext);
  const { addNewEvent, event, setEvent, setShowFullDatePicker } =
    useContext(InteractiveContext);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [weatherCode, setWeatherCode] = useState(null);

  const changeWidth = (e) => {
    setWindowWidth(window.innerWidth);
  };

  const getDateIndex = () => {
    // Parse the string "MM/DD/YYYY"
    const baseDate = new Date(string);

    // Normalize both dates to midnight (ignore time)
    const baseTime = baseDate.setHours(0, 0, 0, 0);
    const currentTime = new Date(new Date().setHours(0, 0, 0, 0));

    // Calculate difference in days
    const diffDays = Math.floor(
      (baseTime - currentTime) / (1000 * 60 * 60 * 24)
    );

    // Check range
    if (diffDays >= 0 && diffDays <= 7) {
      return diffDays; // 0 for same day, up to 7 for 6 days later
    }

    return null; // not valid
  };

  useEffect(() => {
    window.addEventListener("resize", changeWidth);
    return () => window.removeEventListener("resize", changeWidth);
  }, []);

  useEffect(() => {
    const indexOfDay = getDateIndex();

    console.log(indexOfDay);

    if (indexOfDay !== null) {
      const theCode = weatherData?.daily?.weathercode[indexOfDay];

      if (theCode !== null) {
        setWeatherCode(theCode);
      }
    }
  }, [string]);

  useEffect(() => {
    if (event) {
      setString(event.date);
    }
    event || addNewEvent
      ? setShowAllDayEvents(false)
      : setShowAllDayEvents(true);
  }, [event, addNewEvent]);

  const deleteAnEvent = () => {
    const authToken = localStorage.getItem("authToken");
    deleteEvent(user.username, event.id, authToken)
      .then((res) => {
        const filteredEvents = events.filter((e) => e.id !== res.data.eventId);
        setEvent(null);
        setEvents(filteredEvents);
        setEventMap((prev) => {
          const date = new Date(string);
          const newMap = new Map(prev);
          const mapDate = `${date.getFullYear()}-${date.getMonth()}`;

          if (newMap.has(mapDate)) {
            const entry = newMap.get(mapDate);
            newMap.set(mapDate, {
              ...entry,
              events: filteredEvents, // new array, not mutated
            });
          }

          return newMap;
        });
        if (allDayEvents.length > 0) {
          setShowAllDayEvents(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteAllEvents = () => {
    try {
      const token = localStorage.getItem("authToken");
      deleteRepeats(user.username, event.id, event.parentId, token)
        .then((res) => {
          const filteredEvents = events.filter((e) => {
            if (e.id === event.id || e.id === event.parentId) {
              return;
            }
            if (e.repeats.repeat && e.parentId === event.parentId) {
              return;
            }
            if (e.parentId === event.id) {
              return;
            }
            return e;
          });
          setEvent(null);
          setEvents(filteredEvents);
          if (allDayEvents.length > 0) {
            setShowAllDayEvents(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const switchDays = (e, info) => {
    const dragDistance = info.offset.x;
    const cancelThreshold = 75;
    const currentDate = new Date(string);
    const newDate = new Date(currentDate);
    if (dragDistance > cancelThreshold) {
      newDate.setDate(currentDate.getDate() - 1);
    }
    if (dragDistance < -cancelThreshold) {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setString(newDate.toLocaleDateString());
  };

  const addSecondString = () => {
    setShowFullDatePicker(true);
  };

  return (
    <motion.div
      initial={{
        width: event ? "99.5%" : windowWidth < 1024 ? "63.5%" : "29.5%",
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { opacity: { delay: 0.3 } },
        width: event ? "99.5%" : windowWidth < 1024 ? "63.5%" : "29.5%",
      }}
      className={`${
        preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      } z-[902] p-2 font-bold shadow-md fixed top-1 right-1 rounded-md`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        drag="x"
        dragSnapToOrigin={true}
        onDragEnd={switchDays}
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
              {new Date(string).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            {addNewEvent && (
              <div>
                {!secondString && (
                  <div
                    className="cursor-pointer ml-3"
                    onClick={() => addSecondString()}
                  >
                    <AiFillPlusCircle />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center ml-3 min-w-0">
            <MdLocationPin className="text-lg mr-1 flex-shrink-0" />
            <p className="text-sm truncate min-w-0">
              {location.city}, {location.state}
            </p>
            {weatherCode ? (
              <img
                src={weatherCodes[weatherCode].icon}
                alt=""
                className="object-cover aspect-square w-8 ml-2 flex-shrink-0"
              />
            ) : null}
          </div>
        </div>
        <div>
          {secondString && (
            <p className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {new Date(secondString).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </motion.div>
      <div className="flex justify-between items-center mt-2 pb-1">
        {allDayEvents.length > 0 && (
          <div>
            {showAllDayEvents ? (
              <BsFillArrowUpCircleFill
                onClick={() => setShowAllDayEvents(false)}
              />
            ) : (
              <BsFillArrowDownCircleFill
                onClick={() => setShowAllDayEvents(true)}
              />
            )}
          </div>
        )}
        {event && (
          <>
            {!holidays.includes(event) && (
              <div className="flex justify-center items-center gap-x-3">
                <BsFillShareFill className="cursor-pointer" />
                <BsFillPenFill className="cursor-pointer" />
                <BsFillTrashFill
                  onClick={() => {
                    const actions = event.repeats.repeat
                      ? [
                          {
                            text: "cancel",
                            func: () => setSystemNotif({ show: false }),
                          },
                          {
                            text: "delete all",
                            func: () => {
                              setSystemNotif({ show: false });
                              deleteAllEvents();
                            },
                          },
                          {
                            text: "delete",
                            func: () => {
                              setSystemNotif({ show: false });
                              deleteAnEvent();
                            },
                          },
                        ]
                      : [
                          {
                            text: "cancel",
                            func: () => setSystemNotif({ show: false }),
                          },
                          {
                            text: "delete",
                            func: () => {
                              setSystemNotif({ show: false });
                              deleteAnEvent();
                            },
                          },
                        ];
                    const newConfirmation = {
                      show: true,
                      title: `Delete ${event.summary}`,
                      text: event.repeats.repeat
                        ? "Delete all repeat events or just this one?"
                        : "Are you sure you want to delete this event?",
                      color: "bg-red-200",
                      hasCancel: true,
                      actions: actions,
                    };
                    setSystemNotif(newConfirmation);
                  }}
                  className="cursor-pointer"
                />
              </div>
            )}
          </>
        )}
      </div>
      <motion.div
        animate={showAllDayEvents ? { height: "max-content" } : { height: 0 }}
      >
        {allDayEvents.map((event, index) => (
          <motion.div
            animate={
              showAllDayEvents
                ? { opacity: 1, y: 0, transition: { delay: 0.25 } }
                : { opacity: 0, y: -50, pointerEvents: "none" }
            }
            key={event.id}
            style={{ color: tailwindBgToHex(event.color) }}
            className={`py-1 px-2 rounded-md shadow-sm flex justify-between ${
              event.color
            } ${index === 0 && !showAllDayEvents ? "mt-0" : "mt-2"}`}
          >
            <p onClick={() => setEvent(event)} className="cursor-pointer">
              {event.summary}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ModalHeader;
