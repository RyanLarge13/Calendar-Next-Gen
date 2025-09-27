import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../constants.js";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext.jsx";

const DatePicker = () => {
  const { setShowDatePicker } = useContext(InteractiveContext);
  const { setUpdatedDate, setNav, nav, month, year } = useContext(DatesContext);
  const { preferences } = useContext(UserContext);

  const [newYear, setNewYear] = useState(null);
  const [newMonth, setNewMonth] = useState(null);

  const scrollMonthRef = useRef(null);
  const scrollYearRef = useRef(null);
  let debounceMonthTimeout;
  let debounceYearTimeout;

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
  }, []);

  const handleMonthScroll = () => {
    clearTimeout(debounceMonthTimeout);
    const scrollPosition = scrollMonthRef.current.scrollTop;
    const itemHeight = 60;
    debounceMonthTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticMonths.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex)
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
        top: (newMonth - 1) * 60,
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
        Math.min(Math.max(closestIndex, 0), lastIndex)
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

  const submitMonthAndTime = () => {
    const newDt = new Date();
    newDt.setMonth(newMonth);
    newDt.setFullYear(newYear);
    setUpdatedDate(newDt);
    if (nav !== 0) {
      setNav(0);
    }
    setShowDatePicker(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[900]"
        onClick={() => setShowDatePicker(false)}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-40 left-[5%] lg:left-1/2 -translate-x-1/2 
    rounded-2xl shadow-2xl border z-[999] w-[90%] max-w-md
    ${
      preferences.darkMode
        ? "bg-[#1e1e1e]/95 text-white border-gray-700"
        : "bg-white/95 text-gray-900 border-gray-200"
    } backdrop-blur-md`}
      >
        {/* Header */}
        <h2
          className="text-lg font-semibold text-center py-2 border-b 
    border-gray-200 dark:border-gray-700"
        >
          Pick a Date
        </h2>

        <div className="flex gap-x-6 p-5 justify-center">
          {/* Month selector */}
          <div className="flex flex-col items-center">
            <h3 className="text-base font-medium mb-2">Month</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={decreaseMonth}
              className="p-3 rounded-full shadow-md 
          bg-gradient-to-tr from-cyan-400 to-sky-500 
          text-white hover:scale-105 transition"
            >
              <BsFillArrowUpCircleFill size={20} />
            </motion.button>

            <div
              ref={scrollMonthRef}
              onScroll={handleMonthScroll}
              className="overflow-y-scroll max-h-[60px] text-2xl 
          font-semibold my-2 px-2 text-center 
          scrollbar-hide snap-y snap-mandatory"
            >
              {staticMonths.map((mon, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="h-[60px] flex items-center justify-center snap-center"
                >
                  {mon.name}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={increaseMonth}
              className="p-3 rounded-full shadow-md 
          bg-gradient-to-tr from-cyan-400 to-sky-500 
          text-white hover:scale-105 transition"
            >
              <BsFillArrowDownCircleFill size={20} />
            </motion.button>
          </div>

          {/* Year selector */}
          <div className="flex flex-col items-center">
            <h3 className="text-base font-medium mb-2">Year</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={decreaseYear}
              className="p-3 rounded-full shadow-md 
          bg-gradient-to-tr from-cyan-400 to-sky-500 
          text-white hover:scale-105 transition"
            >
              <BsFillArrowUpCircleFill size={20} />
            </motion.button>

            <div
              ref={scrollYearRef}
              onScroll={handleYearScroll}
              className="overflow-y-scroll max-h-[60px] text-2xl 
          font-semibold my-2 px-2 text-center 
          scrollbar-hide snap-y snap-mandatory"
            >
              {staticYears.map((stYr, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="h-[60px] flex items-center justify-center snap-center"
                >
                  {stYr}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={increaseYear}
              className="p-3 rounded-full shadow-md 
          bg-gradient-to-tr from-cyan-400 to-sky-500 
          text-white hover:scale-105 transition"
            >
              <BsFillArrowDownCircleFill size={20} />
            </motion.button>
          </div>
        </div>

        {/* Footer buttons */}
        <div
          className="flex justify-between items-center border-t 
    border-gray-200 dark:border-gray-700 p-4"
        >
          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="px-4 py-2 rounded-xl font-medium 
        bg-gradient-to-tr from-rose-400 to-pink-500 text-white
        shadow-sm hover:scale-105 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitMonthAndTime}
            className="px-4 py-2 rounded-xl font-medium 
        bg-gradient-to-tr from-cyan-400 to-sky-500 text-white
        shadow-sm hover:scale-105 transition"
          >
            Okay
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default DatePicker;
