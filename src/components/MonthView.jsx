import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { useContext, useState } from "react";
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

  const getIndicesForEvents = (events, dtStr) => {
    return events.filter((event) => {
      const targetDateObj = new Date(dtStr);
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      if (startDate <= targetDateObj && endDate >= targetDateObj) {
        return event;
      }
    });
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
        const eventsToRender = getIndicesForEvents(events, dateStr);

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
                  className={`rounded-lg ${event.color} shadow-md p-1 my-1 mx-auto`}
                >
                  {new Date(event.startDate).toLocaleDateString() ===
                  dateStr ? (
                    <p className="whitespace-nowrap text-xs overflow-hidden">
                      {event.summary}
                    </p>
                  ) : (
                    <motion.p
                      whileHover={{ opacity: 1 }}
                      className="text-xs opacity-0 whitespace-nowrap overflow-hidden"
                    >
                      {event.summary}
                    </motion.p>
                  )}
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
