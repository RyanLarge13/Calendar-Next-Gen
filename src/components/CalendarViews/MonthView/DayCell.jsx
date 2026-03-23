import { motion } from "framer-motion";
import { calendarBlocks } from "../../../motion";
import { useContext, useRef, useState } from "react";
import UserContext from "../../../context/UserContext";
import DatesContext from "../../../context/DatesContext";
import { tailwindBgToHex } from "../../../utils/helpers";
import InteractiveContext from "../../../context/InteractiveContext";
import PopUpMonthViewWindow from "../../Misc/PopUpMonthViewWindow";
import { useModalActions } from "../../../context/ContextHooks/ModalContext";

const DayCell = ({
  index,
  dayNumber,
  dateStr,
  isCurrentDate,
  eventsToRender,
}) => {
  const { preferences } = useContext(UserContext);
  const { rowDays, dateString, setNav } = useContext(DatesContext);
  const { setMenu, setShowLogin } = useContext(InteractiveContext);

  const { openModal } = useModalActions();

  const [remindersToRender, setRemindersToRender] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popupEvents, setPopupEvents] = useState([]); // Changing?
  const [popUpReminders, setPopUpReminders] = useState([]);
  const [hoverDay, setHoverDay] = useState(null);
  const [newPopup, setNewPopup] = useState(false);

  const popupTimeoutRef = useRef(null);
  const isHoveringPopupRef = useRef(false);
  const closePopupTimeoutRef = useRef(null);

  const targetDate = new Date(dateString);

  const addEvent = (date) => {
    setMenu((prev) => {
      if (prev) false;
    });
    setShowLogin(false);
    openModal();
    setString(date);
  };

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

      if (index - paddingDays < 0) {
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
    [paddingDays, month, year],
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

  return (
    <motion.div
      variants={calendarBlocks}
      whileHover={{
        outline: preferences.darkMode ? "1px solid white" : "1px solid black",
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
        isCurrentDate && "shadow-cyan-400 shadow-md outline outline-slate-400"
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
            {new Date(event.startDate).toLocaleDateString() === dateStr ? (
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
    </motion.div>
  );
};

export default DayCell;
