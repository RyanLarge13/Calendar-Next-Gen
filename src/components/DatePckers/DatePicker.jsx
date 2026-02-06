import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../../constants.js";
import { motion } from "framer-motion";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import DatesContext from "../../context/DatesContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import Portal from "../Portal.jsx";

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
          onClick={() => setShowDatePicker(false)}
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
          <h2 className="text-lg font-semibold tracking-tight">Pick a Date</h2>
          <p
            className={`text-xs mt-1 ${
              preferences.darkMode ? "text-white/60" : "text-slate-500"
            }`}
          >
            Choose month and year
          </p>
        </div>

        <button
          onClick={() => setShowDatePicker(false)}
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
        <div className="grid grid-cols-2 gap-4">
          {/* Month selector */}
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
                onClick={decreaseMonth}
                type="button"
                aria-label="Previous month"
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                ref={scrollMonthRef}
                onScroll={handleMonthScroll}
                className="mt-3 mb-3 w-full text-center max-h-[60px] overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
              >
                {staticMonths.map((mon, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center snap-center
                  text-xl font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {mon.name}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={increaseMonth}
                type="button"
                aria-label="Next month"
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Year selector */}
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
                onClick={decreaseYear}
                type="button"
                aria-label="Previous year"
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                ref={scrollYearRef}
                onScroll={handleYearScroll}
                className="mt-3 mb-3 w-full text-center max-h-[60px] overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
              >
                {staticYears.map((stYr, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center snap-center
                  text-xl font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {stYr}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={increaseYear}
                type="button"
                aria-label="Next year"
                className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
              }
            `}
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Preview pill */}
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
            {new Date(newYear, newMonth).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className={`
      px-5 py-4 flex justify-between items-center border-t
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    `}
      >
        <button
          type="button"
          onClick={() => setShowDatePicker(false)}
          className={`
        px-4 py-2 rounded-2xl text-sm font-semibold border shadow-sm transition active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
        }
      `}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submitMonthAndTime}
          className={`
        px-5 py-2 rounded-2xl text-sm font-semibold text-white shadow-md transition
        active:scale-[0.97]
        bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
      `}
        >
          Okay
        </button>
      </div>
    </motion.div>
  );
};

export default DatePicker;
