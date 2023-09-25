import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../constants.js";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const DatePicker = () => {
  const { setShowDatePicker } = useContext(InteractiveContext);
  const { setUpdatedDate, setNav, nav, month, year } = useContext(DatesContext);

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
      const index = staticYears.indexOf(year);
      scrollYearRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
      setNewYear(Number(staticYears[index]));
    }
  }, []);

  useEffect(() => {}, []);

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

  const increaseMonth = () => {};

  const decreaseMonth = () => {};

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

  const increaseYear = () => {};

  const decreaseYear = () => {};

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
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={() => setShowDatePicker(false)}
      ></div>
      <div className="fixed top-40 left-[50%] translate-x-[-50%] rounded-md shadow-md bg-white p-5">
        <div className="flex gap-x-3">
          <div>
            <h2 className="text-lg">Month</h2>
            <div className="text-sm mt-1 mb-2 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md">
              <BsFillArrowUpCircleFill onClick={() => decreaseMonth()} />
            </div>
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
            <div className="text-sm mt-2 mb-1 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md">
              <BsFillArrowDownCircleFill onClick={() => increaseMonth()} />
            </div>
          </div>
          <div>
            <h2 className="text-lg">Year</h2>
            <div className="text-sm mt-1 mb-2 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md">
              <BsFillArrowUpCircleFill onClick={() => decreaseYear()} />
            </div>
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
            <div className="text-sm mt-2 mb-1 p-3 flex justify-center items-center bg-cyan-100 rounded-md shadow-md">
              <BsFillArrowDownCircleFill onClick={() => increaseYear()} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-5 border-t p-3">
          <button type="text" onClick={() => setShowDatePicker(false)}>
            Cancel
          </button>
          <button type="text" onClick={() => submitMonthAndTime()}>
            Okay
          </button>
        </div>
      </div>
    </>
  );
};

export default DatePicker;
