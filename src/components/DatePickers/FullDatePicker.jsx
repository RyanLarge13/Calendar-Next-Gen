import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { staticMonths, staticYears } from "../../constants.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import Portal from "../Misc/Portal.jsx";

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
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`
    fixed z-[999]
    top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2
    w-[92vw] max-w-md
    rounded-3xl border shadow-2xl overflow-hidden
    backdrop-blur-md
    ${
      preferences.darkMode
        ? "bg-[#161616]/90 border-white/10 text-white"
        : "bg-white/90 border-black/10 text-slate-900"
    }
  `}
    >
      {/* Backdrop */}
      <Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[998] bg-black/35 backdrop-blur-sm"
          onClick={() => setShowFullDatePicker(false)}
        />
      </Portal>

      {/* Header */}
      <div
        className={`
      px-5 py-4 flex items-start justify-between gap-4 border-b
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    `}
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Select Date</h2>
          <p
            className={`text-xs mt-1 ${
              preferences.darkMode ? "text-white/60" : "text-slate-500"
            }`}
          >
            Scroll or use the arrows
          </p>
        </div>

        <button
          onClick={() => setShowFullDatePicker(false)}
          className={`
        grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Month + Year */}
        <div className="grid grid-cols-2 gap-4">
          {/* Month */}
          <div
            className={`
          relative rounded-3xl border shadow-sm overflow-hidden
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white border-black/10"
          }
        `}
          >
            <div className="px-4 pt-4 pb-3">
              <p
                className={`text-xs font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Month
              </p>
            </div>

            {/* Center highlight lane */}
            <div
              className={`
            pointer-events-none absolute left-3 right-3 top-[125px] -translate-y-1/2 h-[56px]
            rounded-2xl border
            ${
              preferences.darkMode
                ? "border-white/10 bg-white/5"
                : "border-black/10 bg-black/[0.03]"
            }
          `}
            />

            <div className="px-3 pb-4 flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
                onClick={decreaseMonth}
                type="button"
                aria-label="Previous month"
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                className="mt-3 mb-3 w-full text-center max-h-[60px] overflow-y-scroll scrollbar-hide"
                ref={scrollMonthRef}
                onScroll={handleMonthScroll}
              >
                {staticMonths.map((mon, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center
                  font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {mon.name}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
                onClick={increaseMonth}
                type="button"
                aria-label="Next month"
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Year */}
          <div
            className={`
          relative rounded-3xl border shadow-sm overflow-hidden
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white border-black/10"
          }
        `}
          >
            <div className="px-4 pt-4 pb-3">
              <p
                className={`text-xs font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Year
              </p>
            </div>

            {/* Center highlight lane */}
            <div
              className={`
            pointer-events-none absolute left-3 right-3 top-[125px] -translate-y-1/2 h-[56px]
            rounded-2xl border
            ${
              preferences.darkMode
                ? "border-white/10 bg-white/5"
                : "border-black/10 bg-black/[0.03]"
            }
          `}
            />

            <div className="px-3 pb-4 flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
                onClick={decreaseYear}
                type="button"
                aria-label="Previous year"
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                className="mt-3 mb-3 w-full text-center max-h-[60px] overflow-y-scroll scrollbar-hide"
                ref={scrollYearRef}
                onScroll={handleYearScroll}
              >
                {staticYears.map((stYr, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center
                   font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {stYr}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
                onClick={increaseYear}
                type="button"
                aria-label="Next year"
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Day */}
        <div
          className={`
        mt-4 relative rounded-3xl border shadow-sm overflow-hidden
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white border-black/10"
        }
      `}
        >
          <div className="px-4 pt-4 pb-3">
            <p
              className={`text-xs font-semibold ${
                preferences.darkMode ? "text-white/60" : "text-slate-500"
              }`}
            >
              Day
            </p>
          </div>

          {/* Center highlight lane */}
          <div
            className={`
          pointer-events-none absolute left-3 right-3 top-[125px] -translate-y-1/2 h-[56px]
          rounded-2xl border
          ${
            preferences.darkMode
              ? "border-white/10 bg-white/5"
              : "border-black/10 bg-black/[0.03]"
          }
        `}
          />

          <div className="px-3 pb-4 flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`
            grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
            }
          `}
              onClick={decreaseDay}
              type="button"
              aria-label="Previous day"
            >
              <BsFillArrowUpCircleFill className="text-lg" />
            </motion.button>

            <div
              className="mt-3 mb-3 w-full text-center max-h-[60px] overflow-y-scroll scrollbar-hide"
              ref={scrollDayRef}
              onScroll={handleDayScroll}
            >
              {daysThisMonth.map((day) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ amount: 0.6 }}
                  className={`
                h-[60px] flex items-center justify-center
                text-xl font-semibold tracking-tight
                ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
              `}
                >
                  {day + 1}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`
            grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
            }
          `}
              onClick={increaseDay}
              type="button"
              aria-label="Next day"
            >
              <BsFillArrowDownCircleFill className="text-lg" />
            </motion.button>
          </div>
        </div>

        {/* Preview pill (NEW) */}
        <div className="mt-4 flex justify-between items-center">
          <p
            className={`text-[11px] ${
              preferences.darkMode ? "text-white/55" : "text-slate-500"
            }`}
          >
            Preview
          </p>

          <div
            className={`
          text-[11px] font-semibold px-3 py-1.5 rounded-2xl border
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 text-white/75"
              : "bg-black/[0.03] border-black/10 text-slate-700"
          }
        `}
          >
            {new Date(newYear, newMonth, newDay + 1).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className={`
      px-5 py-4 flex justify-between items-center border-t
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    `}
      >
        <button
          type="button"
          className={`
        px-4 py-2 rounded-2xl text-sm font-semibold border shadow-sm transition active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
        }
      `}
          onClick={() => setShowFullDatePicker(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className={`
        px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-md transition
        active:scale-[0.97]
        bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
      `}
          onClick={submitDateString}
        >
          Okay
        </button>
      </div>
    </motion.div>
  );
};

export default FullDatePicker;
