import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays } from "../constants";
import { useContext } from "react";
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
    columnDays,
    dateString,
    setOpenModal,
    setString,
  } = useContext(DatesContext);

  const addEvent = (date) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  return (
    <>
      {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
        <motion.div
          variants={calendarBlocks}
          onClick={() =>
            index >= paddingDays &&
            addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`)
          }
          key={index}
          style={
            new Date(dateString).getMonth() === new Date().getMonth() &&
            new Date(dateString).getYear() === new Date().getYear()
              ? index === rowDays[0] ||
                index === rowDays[1] ||
                index === rowDays[2] ||
                index === rowDays[3] ||
                index === rowDays[4] ||
                index === rowDays[5] ||
                index === rowDays[6] ||
                index === columnDays[0] ||
                index === columnDays[1] ||
                index === columnDays[2] ||
                index === columnDays[3] ||
                index === columnDays[4] ||
                index === columnDays[5] ||
                index === columnDays[6]
                ? { backgroundColor: "rgba(0,0,0,0.1)" }
                : { backgroundColor: "#fff" }
              : { backgroundColor: "#fff" }
          }
          className={`relative w-full min-h-[12vh] max-h-[15vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 overflow-hidden cursor-pointer ${
            index - paddingDays + 1 === day &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear() &&
            "shadow-cyan-400 shadow-md"
          }`}
        >
          <div
            className={`text-center text-sm my-1 ${
              index - paddingDays + 1 === day &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear() &&
              "w-[25px] h-[25px] rounded-full bg-cyan-100 shadow-sm"
            }`}
          >
            <p>{index >= paddingDays && index - paddingDays + 1}</p>
          </div>
          <div className="w-full overflow-y-hidden absolute inset-0 pt-8">
            {[...events, ...holidays].map(
              (event) =>
                new Date(event.date).toLocaleDateString() ===
                  `${month + 1}/${index - paddingDays + 1}/${year}` && (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.8,
                        type: "spring",
                        stiffness: 200,
                      },
                    }}
                    className={`rounded-lg ${event.color} shadow-md p-1 w-[95%] my-1 mx-auto`}
                  >
                    <p
                      className={`whitespace-nowrap text-xs overflow-hidden ${
                        event.color === "bg-black" ? "text-white" : "text-black"
                      }`}
                    >
                      {event.summary}
                    </p>
                  </motion.div>
                )
            )}
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MonthView;
