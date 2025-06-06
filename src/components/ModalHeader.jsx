import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { deleteEvent, deleteRepeats } from "../utils/api.js";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";
import {tailwindBgToHex} from "../utils/helpers.js"
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";

const ModalHeader = ({ allDayEvents }) => {
  const { string, setString, secondString, setSecondString } =
    useContext(DatesContext);
  const { user, events, setEvents, holidays, setSystemNotif, preferences } =
    useContext(UserContext);
  const { addNewEvent, event, setEvent, setShowFullDatePicker } =
    useContext(InteractiveContext);

  const [showAllDayEvents, setShowAllDayEvents] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const changeWidth = (e) => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", changeWidth);
    return () => window.removeEventListener("resize", changeWidth);
  }, []);

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
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          drag="x"
          dragSnapToOrigin={true}
          onDragEnd={switchDays}
        >
          <div className="flex justify-center items-center">
            <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {string}
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
          {secondString && (
            <p className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {secondString}
            </p>
          )}
        </motion.div>
        <div className="flex gap-x-3">
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
                <>
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
                </>
              )}
            </>
          )}
        </div>
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
style={{color: tailwindBgToHex(event.color)}}
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
