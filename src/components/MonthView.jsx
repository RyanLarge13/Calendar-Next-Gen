import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { useContext, useEffect, useState } from "react";
import { calendar } from "../motion";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";

const MonthView = () => {
  const { events, setEvents } = useContext(UserContext);
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
    dateObj,
  } = useContext(DatesContext);

  const [selected, setSelected] = useState([]);
  const [longPressActive, setLongPressActive] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState(null);

  const targetDate = new Date(dateString);

  const getCellStyle = (index) => {
    const isSameMonthAndYear =
      targetDate.getMonth() === dateObj.getMonth() &&
      targetDate.getFullYear() === dateObj.getFullYear();
    if (isSameMonthAndYear && rowDays.includes(index)) {
      return { backgroundColor: "rgba(0, 0, 0, 0.1)" };
    }
    if (selected.includes(index)) {
      return { backgroundColor: "#cffaf" };
    } else {
      return { backgroundColor: "#fff" };
    }
  };

  const getEventContainerWidth = (startDate, endDate, pixelsPerDay = 3) => {
    const durationInDays = (endDate - startDate) / (24 * 60 * 60 * 1000) + 1;
    const max = 7 - startDate.getDay();
    const maxWidthPercentage = max * 100 > 700 ? 700 : max * 100;
    const minWidthPercentage = 100;
    let widthPercentage;
    if (durationInDays === 1) {
      widthPercentage = minWidthPercentage + "%";
    } else {
      const percentageWidth = Math.min(
        maxWidthPercentage * (durationInDays / max),
        maxWidthPercentage
      );
      const pixelWidth = pixelsPerDay * durationInDays;
      widthPercentage = `calc(${percentageWidth}% + ${pixelWidth}px)`;
    }
    return widthPercentage;
  };

  const getEventsForDate = (targetDate) => {
    return [...events].filter(
      (event) => new Date(event.startDate).toLocaleDateString() === targetDate
    );
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
    if (longPressActive && selected.includes(index)) {
      setSelected((prevSelected) =>
        prevSelected.filter((dayIndex) => dayIndex !== index)
      );
      if (selected.length === 1) setLongPressActive(false);
    }
    if (longPressActive && !selected.includes(index)) {
      setSelected((prevSelected) => [...prevSelected, index]);
    }
    if (!longPressActive) {
      addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`, index);
    }
  };

  const addEvent = (date, index) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  return (
    <motion.div
      variants={calendar}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 min-h-[50vh] h-[76vh] gap-1"
    >
      {[...Array(paddingDays + daysInMonth)].map((_, index) => {
        const isCurrentDate =
          index - paddingDays + 1 === day &&
          month === dateObj.getMonth() &&
          year === dateObj.getFullYear();
        const dateStr = `${month + 1}/${index - paddingDays + 1}/${year}`;
        const eventsForDate = getEventsForDate(dateStr);

        return (
          <motion.div
            variants={calendarBlocks}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDayLongPress(index);
            }}
            onClick={() => handleDayClick(index)}
            key={index}
            style={getCellStyle(index)}
            className={`relative w-full rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer ${
              isCurrentDate && "shadow-cyan-400 shadow-md"
            }`}
          >
            <div
              className={`text-center text-sm my-1 ${
                index - paddingDays + 1 === day &&
                month === dateObj.getMonth() &&
                year === dateObj.getFullYear() &&
                "w-[25px] h-[25px] rounded-full bg-cyan-100 shadow-sm"
              }`}
            >
              <p>{index >= paddingDays && index - paddingDays + 1}</p>
            </div>
            <div
              className={`w-full absolute inset-0 pt-8 ${
                selected.includes(index)
                  ? "bg-cyan-100 bg-opacity-50"
                  : "bg-transparent"
              }`}
            >
              {eventsForDate.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  style={{
                    width: getEventContainerWidth(
                      new Date(event.startDate),
                      new Date(event.endDate)
                    ),
                  }}
                  className={`rounded-lg ${event.color} sticky top-0 z-10 shadow-md p-1 my-1 mx-auto`}
                >
                  <p className="whitespace-nowrap text-xs overflow-hidden">
                    {event.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MonthView;
