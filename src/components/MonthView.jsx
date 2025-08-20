import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { tailwindBgToHex } from "../utils/helpers.js";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { IoIosAlarm } from "react-icons/io";
import { calendar } from "../motion";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import PopUpMonthViewWindow from "./PopUpMonthViewWindow";

const MonthView = () => {
  const { events, eventMap, holidays, preferences, reminders } =
    useContext(UserContext);
  const { setMenu, setShowLogin, setAddNewEvent, setType } =
    useContext(InteractiveContext);
  const {
    paddingDays,
    daysInMonth,
    month,
    year,
    day,
    rowDays,
    dateString,
    setOpenModal,
    setString,
    setSecondString,
    dateObj,
    setNav,
  } = useContext(DatesContext);

  const [selected, setSelected] = useState([]);
  const [confirmDates, setConfirmDates] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [newPopup, setNewPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popupTimeout, setPopupTimeout] = useState(null);
  const [popupEvents, setPopupEvents] = useState([]);
  const [hoverDay, setHoverDay] = useState(null);
  const [renderPopup, setRenderPopup] = useState(false);

  const targetDate = new Date(dateString);

  useEffect(() => {
    if (!renderPopup) {
      setNewPopup(false);
      setMousePosition({ x: 0, y: 0 });
      setRenderPopup(false);
      setHoverDay(null);
      setPopupEvents([]);
      clearTimeout(popupTimeout);
    }
  }, [renderPopup]);

  useEffect(() => {
    selected.length > 0 ? setConfirmDates(true) : setConfirmDates(false);
  }, [selected]);

  const getCellStyle = (index) => {
    const isSameMonthAndYear =
      targetDate.getMonth() === dateObj.getMonth() &&
      targetDate.getFullYear() === dateObj.getFullYear();
    if (isSameMonthAndYear && rowDays.includes(index)) {
      return {
        backgroundColor: preferences.darkMode
          ? "#1b1b1b"
          : "rgba(0, 0, 0, 0.1)",
      };
    }
    if (selected.includes(index)) {
      return { backgroundColor: "#cffaf" };
    } else {
      return { backgroundColor: preferences.darkMode ? "#222" : "#fff" };
    }
  };

  const handleDayLongPress = (index) => {
    setLongPressActive(true);
    setLongPressTimeout(
      setTimeout(() => {
        setSelected((prevSelected) => [...prevSelected, index]);
        clearTimeout(longPressTimeout);
      }, 1)
    );
  };

  const handleDayClick = (index) => {
    if (index - paddingDays < 0) {
      setNav((prev) => prev - 1);
      return;
    }
    if (longPressActive && selected.includes(index)) {
      setSelected((prevSelected) =>
        prevSelected.filter((dayIndex) => dayIndex !== index)
      );
      if (selected.length === 1) setLongPressActive(false);
    }
    if (longPressActive && !selected.includes(index)) {
      const sortedSelected = [...selected, index].sort((a, b) => a - b);
      setSelected(sortedSelected);
    }
    if (!longPressActive) {
      addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`, index);
    }
  };

  const addEvent = (date) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  const getIndicesForEvents = (dtStr) => {
    const targetDateObj = new Date(dtStr);
    targetDateObj.setHours(0, 0, 0, 0);
    const key = `${year}-${month}`;
    const eventsToSort = eventMap.get(key)?.events;
    if (!eventsToSort) {
      return [];
    }
    return eventsToSort
      .map((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return {
          ...event,
          startDate,
          endDate,
          duration: (endDate - startDate) / (24 * 60 * 60 * 1000),
        };
      })
      .filter(
        (event) =>
          event.startDate <= targetDateObj && event.endDate >= targetDateObj
      )
      .sort((a, b) => b.duration - a.duration);
  };

  const addNewTypeWithDays = () => {
    const firstDay = selected[0] - paddingDays + 1;
    const lastDay = selected[selected.length - 1] - paddingDays + 1;
    setString(`${month + 1}/${firstDay}/${year}`);
    setSecondString(`${month + 1}/${lastDay}/${year}`);
    setOpenModal(true);
    setSelected([]);
  };

  const createPopup = (e, eventsToRender, index) => {
    if (popupTimeout) {
      clearTimeout(popupTimeout);
      setPopupTimeout(null);
    }
    if (index - paddingDays < 0) {
      return;
    }
    setNewPopup(false);
    setPopupEvents([]);
    setMousePosition({ x: 0, y: 0 });
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile || !renderPopup) {
      return;
    }
    const mousePositions = {
      x: e.clientX,
      y: e.clientY,
    };
    const timeoutId = setTimeout(() => {
      const theHoverDay = `${month + 1}/${index - paddingDays + 1}/${year}`;
      setPopupEvents(eventsToRender);
      setMousePosition(mousePositions);
      setHoverDay(theHoverDay);
      setNewPopup(true);
    }, 1000);
    setPopupTimeout(timeoutId);
  };

  useEffect(() => {
    return () => {
      if (popupTimeout) {
        clearTimeout(popupTimeout);
        setPopupEvents([]);
        setNewPopup(false);
      }
    };
  }, [popupTimeout]);

  return (
    <motion.div
      variants={calendar}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 min-h-[50vh] h-[83vh] gap-1"
      onMouseLeave={() => setRenderPopup(false)}
      onMouseEnter={() => setRenderPopup(true)}
    >
      {newPopup && (
        <PopUpMonthViewWindow
          positions={mousePosition}
          eventsToRender={popupEvents}
          day={hoverDay}
        />
      )}
      {[...Array(paddingDays + daysInMonth)].map((_, index) => {
        const isCurrentDate =
          index - paddingDays + 1 === day &&
          month === dateObj.getMonth() &&
          year === dateObj.getFullYear();
        const dateStr = `${month + 1}/${index - paddingDays + 1}/${year}`;
        const eventsToRender = getIndicesForEvents(dateStr);
        const hasReminders = reminders.find((r) => r.time === dateStr).length;

        return (
          <motion.div
            variants={calendarBlocks}
            whileHover={{ scale: 1.025 }}
            onMouseEnter={(e) => createPopup(e, eventsToRender, index)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDayLongPress(index);
            }}
            onClick={() => handleDayClick(index)}
            key={index}
            style={getCellStyle(index)}
            className={`relative w-full ${
              preferences.darkMode ? "shadow-slate-700" : "shadow-slate-200"
            } rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer ${
              isCurrentDate &&
              "shadow-cyan-400 shadow-md outline outline-slate-700"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 z-800 flex justify-start gap-x-2 items-center">
              {hasReminders ? (
                <IoIosAlarm
                  className={`${
                    preferences.darkMode ? "text-white" : "text-black"
                  }`}
                />
              ) : null}
            </div>
            <div
              className={`text-center flex justify-center items-center text-sm my-1 ${
                isCurrentDate
                  ? "w-[25px] h-[25px] rounded-full bg-cyan-100 shadow-md text-black"
                  : preferences.darkMode
                  ? "text-white"
                  : "text-black"
              }`}
            >
              <p>{index >= paddingDays && index - paddingDays + 1}</p>
            </div>
            <div
              className={`w-full absolute inset-0 pt-8 overflow-y-clip ${
                selected.includes(index)
                  ? "bg-cyan-100 bg-opacity-50"
                  : "bg-transparent"
              }`}
            >
              {eventsToRender.map((event) => (
                <motion.div
                  key={`${event.id}_${index}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  style={{
                    color: tailwindBgToHex(event.color),
                  }}
                  className={`rounded-lg ${event.color} shadow-md p-1 my-1 mx-auto relative`}
                >
                  {new Date(event.startDate).toLocaleDateString() ===
                  dateStr ? (
                    <p className="whitespace-nowrap text-xs overflow-hidden">
                      {event.summary}
                    </p>
                  ) : (
                    <>
                      <div
                        className={`absolute left-0 w-2 translate-x-[-75%] top-[50%] translate-y-[-50%] rounded-full ${event.color} h-1`}
                      ></div>
                      <p className="text-xs whitespace-nowrap overflow-hidden">
                        {event.summary}
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
      {confirmDates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-20 p-2 left-[50%] translate-x-[-50%] bg-white shadow-lg rounded-md flex justify-between items-center gap-x-20"
        >
          <button
            className="text-lg p-3 rounded-md bg-slate-200"
            onClick={() => {
              setLongPressActive(false);
              setLongPressTimeout(null);
              setSelected([]);
            }}
          >
            <AiFillCloseCircle />
          </button>
          <button
            className="text-lg p-3 rounded-md bg-slate-200"
            onClick={() => addNewTypeWithDays()}
          >
            <AiFillCheckCircle />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MonthView;
