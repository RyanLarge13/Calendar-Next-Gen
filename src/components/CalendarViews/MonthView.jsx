import { motion } from "framer-motion";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { calendar, calendarBlocks } from "../../motion.js";
import {
  cloneEventForDay,
  eventOccursOnDay,
  tailwindBgToHex,
} from "../../utils/helpers.js";
import PopUpMonthViewWindow from "../Misc/PopUpMonthViewWindow.jsx";

const MonthView = () => {
  const { eventMap, preferences, reminders } = useContext(UserContext);
  const { setMenu, setShowLogin } = useContext(InteractiveContext);
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
    theDay,
  } = useContext(DatesContext);

  const [selected, setSelected] = useState([]);
  const [confirmDates, setConfirmDates] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [newPopup, setNewPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popupEvents, setPopupEvents] = useState([]);
  const [popUpReminders, setPopUpReminders] = useState([]);
  const [hoverDay, setHoverDay] = useState(null);
  const [renderPopup, setRenderPopup] = useState(false);

  const popupTimeoutRef = useRef(null);
  const closePopupTimeoutRef = useRef(null);
  const isHoveringPopupRef = useRef(false);

  const targetDate = new Date(dateString);

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
      return { backgroundColor: "#1b1b1b" };
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
      }, 1),
    );
  };

  const handleDayClick = (index) => {
    if (index - paddingDays < 0) {
      setNav((prev) => prev - 1);
      return;
    }
    if (longPressActive && selected.includes(index)) {
      setSelected((prevSelected) =>
        prevSelected.filter((dayIndex) => dayIndex !== index),
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

  const getIndicesForEvents = useCallback(
    (dtStr) => {
      const targetDateObj = new Date(dtStr);
      targetDateObj.setHours(0, 0, 0, 0);
      const key = `${year}-${month}`;
      const baseEvents = eventMap.get(key)?.events || [];
      const eventsToSort = [...baseEvents];
      const repeatEvents = eventMap.get("repeat-events")?.events || [];

      if (repeatEvents.length > 0) {
        repeatEvents.forEach((e) => {
          const eLandsOnDay = eventOccursOnDay(e, dtStr);
          if (eLandsOnDay) {
            const eventRepeated = cloneEventForDay(e, new Date(dtStr));
            eventsToSort.push(eventRepeated);
          }
        });
      }

      if (!eventsToSort || eventsToSort.length < 1) {
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
            event.startDate <= targetDateObj && event.endDate >= targetDateObj,
        )
        .sort((a, b) => b.duration - a.duration);
    },
    [month, year, eventMap],
  );

  const addNewTypeWithDays = () => {
    const firstDay = selected[0] - paddingDays + 1;
    const lastDay = selected[selected.length - 1] - paddingDays + 1;
    setString(`${month + 1}/${firstDay}/${year}`);
    setSecondString(`${month + 1}/${lastDay}/${year}`);
    setOpenModal(true);
    setSelected([]);
  };

  const createPopup = useCallback(
    (e, eventsToRender, remindersToRender, index) => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = null;
      }

      if (closePopupTimeoutRef.current) {
        clearTimeout(closePopupTimeoutRef.current);
        closePopupTimeoutRef.current = null;
      }

      if (index - paddingDays < 0 || !renderPopup) {
        return;
      }

      const mousePositions = {
        x: e.clientX,
        y: e.clientY,
      };

      popupTimeoutRef.current = setTimeout(() => {
        const theHoverDay = `${month + 1}/${index - paddingDays + 1}/${year}`;

        setPopupEvents(eventsToRender);
        setPopUpReminders(remindersToRender);
        setMousePosition(mousePositions);
        setHoverDay(theHoverDay);
        setNewPopup(true);
      }, 1000);
    },
    [paddingDays, renderPopup, month, year],
  );

  const scheduleClearPopup = useCallback(() => {
    if (closePopupTimeoutRef.current) {
      clearTimeout(closePopupTimeoutRef.current);
    }

    closePopupTimeoutRef.current = setTimeout(() => {
      if (!isHoveringPopupRef.current) {
        setNewPopup(false);
      }
    }, 120);
  }, []);

  const clearPopupNow = useCallback(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    if (closePopupTimeoutRef.current) {
      clearTimeout(closePopupTimeoutRef.current);
      closePopupTimeoutRef.current = null;
    }

    setNewPopup(false);
  }, []);

  const clearPopup = useCallback(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    setNewPopup(false);
  }, []);

  const daysData = useMemo(() => {
    return [...Array(paddingDays + daysInMonth)].map((_, index) => {
      const dayNumber = index - paddingDays + 1;
      const isPaddingDay = index < paddingDays;

      if (isPaddingDay) {
        return {
          index,
          dayNumber,
          dateStr: null,
          isCurrentDate: false,
          eventsToRender: [],
          remindersToRender: [],
          isPaddingDay: true,
        };
      }

      const dateStr = `${month + 1}/${dayNumber}/${year}`;

      const isCurrentDate =
        dayNumber === day &&
        month === dateObj.getMonth() &&
        year === dateObj.getFullYear();

      const eventsToRender = getIndicesForEvents(dateStr);

      const remindersToRender = reminders.filter(
        (reminder) => new Date(reminder.time).toLocaleDateString() === dateStr,
      );

      return {
        index,
        dayNumber,
        dateStr,
        isCurrentDate,
        eventsToRender,
        remindersToRender,
        isPaddingDay: false,
      };
    });
  }, [
    paddingDays,
    daysInMonth,
    month,
    year,
    day,
    dateObj,
    reminders,
    getIndicesForEvents,
  ]);

  return (
    <motion.div
      variants={calendar}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 min-h-[50vh] h-[83vh] gap-1"
      onMouseEnter={() => {
        if (!renderPopup) setRenderPopup(true);
      }}
      onMouseLeave={() => {
        setRenderPopup(false);
        clearPopup();
      }}
    >
      {newPopup && (
        <PopUpMonthViewWindow
          positions={mousePosition}
          remindersToRender={popUpReminders}
          eventsToRender={popupEvents}
          day={hoverDay}
          onMouseEnter={() => {
            isHoveringPopupRef.current = true;
            if (closePopupTimeoutRef.current) {
              clearTimeout(closePopupTimeoutRef.current);
              closePopupTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            isHoveringPopupRef.current = false;
            clearPopupNow();
          }}
        />
      )}
      {daysData.map(
        ({
          index,
          dayNumber,
          dateStr,
          isCurrentDate,
          eventsToRender,
          remindersToRender,
        }) => {
          const hasReminders = remindersToRender.length;

          return (
            <motion.div
              variants={calendarBlocks}
              whileHover={{
                outline: preferences.darkMode
                  ? "1px solid white"
                  : "1px solid black",
                backgroundColor: preferences.darkMode ? "#333333" : "#f2f2f2",
              }}
              onMouseEnter={(e) =>
                createPopup(e, eventsToRender, remindersToRender, index)
              }
              onMouseLeave={scheduleClearPopup}
              onContextMenu={(e) => {
                e.preventDefault();
                handleDayLongPress(index);
              }}
              onClick={() => handleDayClick(index)}
              key={index}
              style={getCellStyle(index)}
              className={`relative w-full ${
                preferences.darkMode ? "shadow-slate-700" : "shadow-slate-200"
              } rounded-sm shadow-sm flex flex-col items-center justify-start gap-y-1 cursor-pointer ${
                isCurrentDate &&
                "shadow-cyan-400 shadow-md outline outline-slate-400"
              }`}
            >
              <div
                className={`text-center flex justify-center items-center text-sm mt-1 ${
                  isCurrentDate
                    ? "w-[25px] h-[25px] rounded-full bg-white shadow-md text-black"
                    : preferences.darkMode
                      ? "text-white"
                      : "text-black"
                }`}
              >
                <p>{index >= paddingDays && dayNumber}</p>
              </div>

              <div
                className={`w-full absolute inset-0 pt-11 overflow-y-clip ${
                  selected.includes(index)
                    ? "bg-cyan-100 bg-opacity-50"
                    : "bg-transparent"
                }`}
              >
                {eventsToRender.map((event) => (
                  <motion.div
                    key={`${event.id}_${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
        },
      )}
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
