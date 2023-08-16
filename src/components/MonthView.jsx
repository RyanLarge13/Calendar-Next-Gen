import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { useContext, useEffect, useState } from "react";
import { calendar } from "../motion";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";

const MonthView = () => {
  const { events } = useContext(UserContext);
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

  const targetDate = new Date(dateString);

  // useEffect(() => {
  //   console.log("Rendering");
  // }, []);

  const getCellStyle = (index) => {
    const isSameMonthAndYear =
      targetDate.getMonth() === dateObj.getMonth() &&
      targetDate.getFullYear() === dateObj.getFullYear();
    if (isSameMonthAndYear && rowDays.includes(index)) {
      return { backgroundColor: "rgba(0, 0, 0, 0.1)" };
    } else {
      return { backgroundColor: "#fff" };
    }
  };

  const getEventsForDate = (targetDate) => {
    return [...events, ...holidays].filter(
      (event) => event.date === targetDate
    );
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
      {[...Array(paddingDays + daysInMonth)].map((abs, index) => {
        const isCurrentDate =
          index - paddingDays + 1 === day &&
          month === dateObj.getMonth() &&
          year === dateObj.getFullYear();
        const dateStr = `${month + 1}/${index - paddingDays + 1}/${year}`;
        const eventsForDate = getEventsForDate(dateStr);

        return (
          <motion.div
            variants={calendarBlocks}
            onClick={() =>
              index >= paddingDays &&
              addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`, index)
            }
            // onPointerDown={() => startSelect(index)}
            // onPointerUp={() => checkIfSelectable()}
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
              {eventsForDate.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  className={`rounded-lg ${event.color} shadow-md p-1 my-1 mx-auto`}
                >
                  <p
                    className={`whitespace-nowrap text-xs overflow-hidden ${
                      event.color === "bg-black" ? "text-white" : "text-black"
                    }`}
                  >
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
