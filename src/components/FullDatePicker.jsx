import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../constants.js";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";

const FullDatePicker = ({ stateSetter }) => {
  const { setShowFullDatePicker } = useContext(InteractiveContext);
  const { preferences } = useContext(UserContext);
  const { month, year, day, daysInMonth } = useContext(DatesContext);

  const [newYear, setNewYear] = useState(null);
  const [newMonth, setNewMonth] = useState(null);
  const [newDay, setNewDay] = useState(null);

  const scrollMonthRef = useRef(null);
  const scrollYearRef = useRef(null);
  const scrollDayRef = useRef(null);
  const [daysThisMonth, setDaysThisMonth] = useState(
    Array.from({ length: daysInMonth }, (_, index) => index),
  );
  let debounceDayTimeout;
  let debounceMonthTimeout;
  let debounceYearTimeout;

  useEffect(() => {
    const newSetOfDays = new Date(year, newMonth + 1, 0).getDate();
    setDaysThisMonth(Array.from({ length: newSetOfDays }, (_, index) => index));
  }, [newMonth]);

  useEffect(() => {
    const itemHeight = 60;
    if (scrollMonthRef) {
      scrollMonthRef.current.scrollTo({
        top: month * itemHeight,
        behavior: "smooth",
      });
      setNewMonth(month);
    }
    if (scrollYearRef) {
      const index = staticYears.indexOf(year.toString());
      scrollYearRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
      setNewYear(Number(staticYears[index]));
    }
    if (scrollDayRef) {
      scrollDayRef.current.scrollTo({
        top: day - 1 * 60,
        behavior: "smooth",
      });
      setNewDay(day);
    }
  }, []);

  const handleMonthScroll = () => {
    clearTimeout(debounceMonthTimeout);
    const scrollPosition = scrollMonthRef.current.scrollTop;
    const itemHeight = 60;
    debounceMonthTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticMonths.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollMonthRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      setNewMonth(clampedIndex);
    }, 50);
  };

  const increaseMonth = () => {
    if (newMonth < staticMonths.length - 1) {
      setNewMonth(newMonth + 1);
      scrollMonthRef.current.scrollTo({
        top: (newMonth + 1) * 60,
        behavior: "smooth",
      });
    }
  };

  const decreaseMonth = () => {
    if (newMonth > 0) {
      setNewMonth(newMonth - 1);
      scrollMonthRef.current.scrollTo({
        top: (newMonth - 1) * 60, // Assuming each item is 60px tall
        behavior: "smooth",
      });
    }
  };

  const handleYearScroll = () => {
    clearTimeout(debounceYearTimeout);
    const scrollPosition = scrollYearRef.current.scrollTop;
    const itemHeight = 60;
    debounceYearTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticYears.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollYearRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      const yearToSet = Number(staticYears[clampedIndex]);
      setNewYear(yearToSet);
    }, 50);
  };

  const increaseYear = () => {
    const index = staticYears.indexOf(newYear.toString());
    if (index < staticYears.length - 1) {
      const newYearToSet = Number(staticYears[index + 1]);
      setNewYear(newYearToSet);
      scrollYearRef.current.scrollTo({
        top: (index + 1) * 60,
        behavior: "smooth",
      });
    }
  };

  const decreaseYear = () => {
    const index = staticYears.indexOf(newYear.toString());
    if (index > 0) {
      const newYearToSet = Number(staticYears[index - 1]);
      setNewYear(newYearToSet);
      scrollYearRef.current.scrollTo({
        top: (index - 1) * 60,
        behavior: "smooth",
      });
    }
  };

  const handleDayScroll = () => {
    clearTimeout(debounceDayTimeout);
    const scrollPosition = scrollDayRef.current.scrollTop;
    const itemHeight = 60;
    debounceDayTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = daysThisMonth.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollDayRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      const dayToSet = Number(daysThisMonth[clampedIndex]);
      setNewDay(dayToSet);
    }, 50);
  };

  const increaseDay = () => {
    if (newDay < daysThisMonth.length - 1) {
      scrollDayRef.current.scrollTo({
        top: (newDay + 1) * 60,
        behavior: "smooth",
      });
      setNewDay((prev) => prev + 1);
    }
  };

  const decreaseDay = () => {
    if (newDay > 0) {
      scrollDayRef.current.scrollTo({
        top: (newDay - 1) * 60,
        behavior: "smooth",
      });
      setNewDay((prev) => prev - 1);
    }
  };

  const submitDateString = () => {
    // Set up the date object
    const newDt = new Date();
    newDt.setMonth(newMonth);
    newDt.setFullYear(newYear);
    newDt.setDate(newDay + 1);

    // Build the date string to be set
    const stringTwo = newDt.toLocaleDateString();

    // Set states

    stateSetter(stringTwo);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[998]"
        onClick={() => setShowFullDatePicker(false)}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, x: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed top-40 left-[50%] translate-x-[-50%] rounded-2xl shadow-2xl p-6 z-[999] w-[90%] max-w-md
    ${
      preferences.darkMode
        ? "bg-[#1e1e1e]/95 text-white border border-white/10 backdrop-blur-lg"
        : "bg-white/95 text-black border border-slate-200 backdrop-blur-lg"
    }`}
      >
        <h2 className="text-xl font-semibold text-center mb-4">Select Date</h2>

        {/* Month + Year section */}
        <div className="flex gap-6 justify-center">
          {/* Month */}
          <div className="flex flex-col items-center">
            <h3 className="text-base font-medium mb-1">Month</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
              onClick={decreaseMonth}
            >
              <BsFillArrowUpCircleFill className="text-white text-lg" />
            </motion.button>
            <div
              className="overflow-y-scroll max-h-[60px] text-[32px] font-semibold scrollbar-hide mt-2 mb-2 w-50 text-center"
              ref={scrollMonthRef}
              onScroll={handleMonthScroll}
            >
              {staticMonths.map((mon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  className="h-[60px] flex items-center justify-center"
                >
                  {mon.name}
                </motion.div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
              onClick={increaseMonth}
            >
              <BsFillArrowDownCircleFill className="text-white text-lg" />
            </motion.button>
          </div>

          {/* Year */}
          <div className="flex flex-col items-center">
            <h3 className="text-base font-medium mb-1">Year</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
              onClick={decreaseYear}
            >
              <BsFillArrowUpCircleFill className="text-white text-lg" />
            </motion.button>
            <div
              className="overflow-y-scroll max-h-[60px] text-[32px] font-semibold scrollbar-hide mt-2 mb-2 w-24 text-center"
              ref={scrollYearRef}
              onScroll={handleYearScroll}
            >
              {staticYears.map((stYr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="h-[60px] flex items-center justify-center"
                >
                  {stYr}
                </motion.div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
              onClick={increaseYear}
            >
              <BsFillArrowDownCircleFill className="text-white text-lg" />
            </motion.button>
          </div>
        </div>

        {/* Day section */}
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-base font-medium mb-1">Day</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
            onClick={decreaseDay}
          >
            <BsFillArrowUpCircleFill className="text-white text-lg" />
          </motion.button>
          <div
            className="overflow-y-scroll max-h-[60px] text-[32px] font-semibold scrollbar-hide mt-2 mb-2 w-24 text-center"
            ref={scrollDayRef}
            onScroll={handleDayScroll}
          >
            {daysThisMonth.map((day) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="h-[60px] flex items-center justify-center"
              >
                {day + 1}
              </motion.div>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-md"
            onClick={increaseDay}
          >
            <BsFillArrowDownCircleFill className="text-white text-lg" />
          </motion.button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200/60 dark:hover:bg-white/10 transition"
            onClick={() => setShowFullDatePicker(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-lg text-sm font-medium bg-cyan-500 text-white shadow-md hover:bg-cyan-600 transition"
            onClick={submitDateString}
          >
            Okay
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FullDatePicker;
