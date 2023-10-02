import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../constants.js";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const FullDatePicker = () => {
  const { setShowFullDatePicker, setAddNewEvent, setType } =
    useContext(InteractiveContext);
  const {
    setUpdatedDate,
    setNav,
    nav,
    secondString,
    setOpenModal,
    setSecondString,
    month,
    year,
    day,
    daysInMonth,
  } = useContext(DatesContext);

  const [newYear, setNewYear] = useState(null);
  const [newMonth, setNewMonth] = useState(null);
  const [newDay, setNewDay] = useState(null);

  const scrollMonthRef = useRef(null);
  const scrollYearRef = useRef(null);
  const scrollDayRef = useRef(null);
  const [daysThisMonth, setDaysThisMonth] = useState(
    Array.from({ length: daysInMonth }, (_, index) => index)
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
      setNewDay(day - 1);
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
        top: (newMonth + 1) * 60, // Assuming each item is 60px tall
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
        top: (index + 1) * 60, // Assuming each item is 60px tall
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
        top: (index - 1) * 60, // Assuming each item is 60px tall
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
        Math.min(Math.max(closestIndex, 0), lastIndex)
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
    const newDt = new Date();
    newDt.setMonth(newMonth);
    newDt.setFullYear(newYear);
    newDt.setDate(newDay + 1);
    const stringTwo = newDt.toLocaleDateString();
    setSecondString(stringTwo);
    setShowFullDatePicker(false);
    setOpenModal(true);
    setType("event");
    setAddNewEvent(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={() => setShowFullDatePicker(false)}
      ></div>
      <div className="fixed top-40 left-[50%] translate-x-[-50%] rounded-md shadow-md bg-white p-5">
        <div className="flex gap-x-3">
          <div>
            <h2 className="text-lg">Month</h2>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="text-sm mt-1 mb-2 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
              onClick={() => decreaseMonth()}
            >
              <BsFillArrowUpCircleFill />
            </motion.div>
            <div
              className="overflow-y-scroll max-h-[60px] text-[40px] scrollbar-hide"
              ref={scrollMonthRef}
              onScroll={handleMonthScroll}
            >
              <div>
                {staticMonths.map((mon, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="h-[60px]"
                  >
                    {mon.name}
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="text-sm mt-2 mb-1 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
              onClick={() => increaseMonth()}
            >
              <BsFillArrowDownCircleFill />
            </motion.div>
          </div>
          <div>
            <h2 className="text-lg">Year</h2>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="text-sm mt-1 mb-2 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
              onClick={() => decreaseYear()}
            >
              <BsFillArrowUpCircleFill />
            </motion.div>
            <div
              className="overflow-y-scroll max-h-[60px] text-[40px] scrollbar-hide"
              ref={scrollYearRef}
              onScroll={handleYearScroll}
            >
              <div>
                {staticYears.map((stYr, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    className="h-[60px]"
                  >
                    {stYr}
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="text-sm mt-2 mb-1 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
              onClick={() => increaseYear()}
            >
              <BsFillArrowDownCircleFill />
            </motion.div>
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-lg">Day</h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="text-sm mt-1 mb-2 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
            onClick={() => decreaseDay()}
          >
            <BsFillArrowUpCircleFill />
          </motion.div>
          <div
            className="overflow-y-scroll max-h-[60px] text-[40px] scrollbar-hide flex justify-center items-start"
            ref={scrollDayRef}
            onScroll={handleDayScroll}
          >
            <div>
              {daysThisMonth.map((day) => (
                <motion.div
                  key={day}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="h-[60px]"
                >
                  {day + 1}
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="text-sm mt-2 mb-1 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md"
            onClick={() => increaseDay()}
          >
            <BsFillArrowDownCircleFill />
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-5 border-t p-3">
          <button type="text" onClick={() => setShowFullDatePicker(false)}>
            Cancel
          </button>
          <button type="text" onClick={() => submitDateString()}>
            Okay
          </button>
        </div>
      </div>
    </>
  );
};

export default FullDatePicker;
