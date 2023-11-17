import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { calendar } from "../motion";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";

const MonthView = () => {
  const { events, setEvents } = useContext(UserContext);
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
  } = useContext(DatesContext);

  const [selected, setSelected] = useState([]);
  const [confirmDates, setConfirmDates] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState(null);

  const targetDate = new Date(dateString);

  useEffect(() => {
    selected.length > 0 ? setConfirmDates(true) : setConfirmDates(false);
  }, [selected]);

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
      const sortedSelected = [...selected, index].sort((a, b) => a - b);
      setSelected(sortedSelected);
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
    const targetDateObj = new Date(dtStr);
    return events
      .filter((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return startDate <= targetDateObj && endDate >= targetDateObj;
      })
      .sort((a, b) => {
        const daysDifferenceA = Math.abs(
          (new Date(b.endDate) - new Date(b.startDate)) / (24 * 60 * 60 * 1000)
        );
        const daysDifferenceB = Math.abs(
          (new Date(a.endDate) - new Date(a.startDate)) / (24 * 60 * 60 * 1000)
        );
        return daysDifferenceA - daysDifferenceB;
      });
  };

  const addNewTypeWithDays = () => {
    const firstDay = selected[0] - paddingDays + 1;
    const lastDay = selected[selected.length - 1] - paddingDays + 1;
    setString(`${month + 1}/${firstDay}/${year}`);
    setSecondString(`${month + 1}/${lastDay}/${year}`);
    setType("event");
    setAddNewEvent(true);
    setOpenModal(true);
    setSelected([])
  };

  return (
    <motion.div
      variants={calendar}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 min-h-[50vh] h-[83vh] gap-1"
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
        <motion.div className="fixed bottom-20 left-[50%] translate-x-[-50%] bg-cyan-100 rounded-md flex justify-between items-center gap-x-20">
          <button
            className="text-lg p-5"
            onClick={() => {
              setLongPressActive(false);
              setLongPressTimeout(null);
              setSelected([]);
            }}
          >
            <AiFillCloseCircle />
          </button>
          <button className="text-lg p-5" onClick={() => addNewTypeWithDays()}>
            <AiFillCheckCircle />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MonthView;
