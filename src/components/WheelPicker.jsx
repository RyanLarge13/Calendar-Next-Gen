import { motion } from "framer-motion";
import { useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import {
  staticHours,
  staticMeridiem,
  staticMinutes,
} from "../constants/WheelPickerConstants";

const WheelPicker = ({ value, setValue }) => {
  const { preferences } = useContext(UserContext);

  let debounceHourTimeout;
  let debounceMinutesTimeout;
  let debounceMeridiemTimeout;

  //   Hour
  const scrollHourRef = useRef(null);

  const handleHourScroll = () => {
    clearTimeout(debounceHourTimeout);
    const scrollPosition = scrollHourRef.current?.scrollTop;
    const itemHeight = 60;
    debounceHourTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticHours.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollHourRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      setValue((prev) => ({ ...prev, hour: staticHours[clampedIndex] }));
    }, 50);
  };

  const increaseHour = () => {
    if (value.hour < staticHours.length - 1) {
      // Set Hour value
      scrollHourRef.current.scrollTo({
        top: (value.hour + 1) * 60,
        behavior: "smooth",
      });
    }
  };

  const decreaseHour = () => {
    if (value.hour > 0) {
      // Set Hour value
      scrollHourRef.current.scrollTo({
        top: (value.hour - 1) * 60,
        behavior: "smooth",
      });
    }
  };

  //   Minute
  const scrollMinuteRef = useRef(null);

  const handleMinuteScroll = () => {
    clearTimeout(debounceMinutesTimeout);
    const scrollPosition = scrollMinuteRef.current?.scrollTop;
    const itemHeight = 60;
    debounceHourTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticMinutes.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollHourRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      setValue((prev) => ({ ...prev, minutes: staticMinutes[clampedIndex] }));
    }, 50);
  };

  const increaseMinutes = () => {
    if (value.minutes < staticMinutes.length - 1) {
      // Set Hour value
      scrollHourRef.current.scrollTo({
        top: (value.minutes + 1) * 60,
        behavior: "smooth",
      });
    }
  };

  const decreaseMinutes = () => {
    if (value.minutes > 0) {
      // Set Hour value
      scrollHourRef.current.scrollTo({
        top: (value.minutes - 1) * 60,
        behavior: "smooth",
      });
    }
  };

  //   Meridiem
  const scrollMeridiemRef = useRef(null);

  const handleMeridiemScroll = () => {
    clearTimeout(debounceMeridiemTimeout);
    const scrollPosition = scrollMeridiemRef.current?.scrollTop;
    const itemHeight = 60;
    debounceHourTimeout = setTimeout(() => {
      const closestIndex = Math.round(scrollPosition / itemHeight);
      const lastIndex = staticMeridiem.length - 1;
      const clampedIndex = Math.round(
        Math.min(Math.max(closestIndex, 0), lastIndex),
      );
      const targetScrollPosition = clampedIndex * itemHeight;
      scrollMeridiemRef.current.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      setValue((prev) => ({ ...prev, meridiem: staticMeridiem[clampedIndex] }));
    }, 50);
  };

  const handleMeridiemSelect = (i) => {
    const itemHeight = 60;

    scrollMeridiemRef.current.scrollTo({
      top: i * itemHeight,
      behavior: "smooth",
    });
    setValue((prev) => ({ ...prev, meridiem: staticMeridiem[i] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`
    fixed z-[999]
    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
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
      {/* Header */}
      <div
        className={`
      px-5 py-4 flex items-start justify-between gap-4 border-b
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    `}
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Select Time</h2>
          <p
            className={`text-xs mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
          >
            Scroll or use the arrows
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Hour + Minute */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hour */}
          <div
            className={`
          relative rounded-3xl border shadow-sm overflow-hidden
          ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
        `}
          >
            <div className="px-4 pt-4 pb-3">
              <p
                className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
              >
                Hour
              </p>
            </div>

            {/* Center highlight lane */}
            <div
              className={`
            pointer-events-none absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[56px]
            rounded-2xl border
            ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"}
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
                onClick={decreaseHour}
                type="button"
                aria-label="Decrease hour"
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                className={`
              mt-3 mb-3 w-full text-center
              max-h-[180px] overflow-y-scroll scrollbar-hide
            `}
                ref={scrollHourRef}
                onScroll={handleHourScroll}
              >
                {staticHours.map((h) => (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center
                  text-3xl font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {h.label}
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
                onClick={increaseHour}
                type="button"
                aria-label="Increase hour"
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Minutes */}
          <div
            className={`
          relative rounded-3xl border shadow-sm overflow-hidden
          ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
        `}
          >
            <div className="px-4 pt-4 pb-3">
              <p
                className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
              >
                Minutes
              </p>
            </div>

            {/* Center highlight lane */}
            <div
              className={`
            pointer-events-none absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[56px]
            rounded-2xl border
            ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"}
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
                onClick={decreaseMinutes}
                type="button"
                aria-label="Decrease minutes"
              >
                <BsFillArrowUpCircleFill className="text-lg" />
              </motion.button>

              <div
                className={`
              mt-3 mb-3 w-full text-center
              max-h-[180px] overflow-y-scroll scrollbar-hide
            `}
                ref={scrollMinueridiem}
                onScroll={handleMinuteScroll}
              >
                {staticMinutes.map((m) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.6 }}
                    className={`
                  h-[60px] flex items-center justify-center
                  text-3xl font-semibold tracking-tight
                  ${preferences.darkMode ? "text-white/85" : "text-slate-900"}
                `}
                  >
                    {m.label}
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
                onClick={increaseMinutes}
                type="button"
                aria-label="Increase minutes"
              >
                <BsFillArrowDownCircleFill className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Meridiem */}
        <div
          className={`
        mt-4 relative rounded-3xl border shadow-sm overflow-hidden
        ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
      `}
        >
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <p
              className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
            >
              AM / PM
            </p>
            <p
              className={`text-[11px] ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
            >
              tap to select
            </p>
          </div>

          {/* Center highlight lane */}
          <div
            className={`
          pointer-events-none absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[56px]
          rounded-2xl border
          ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"}
        `}
          />

          <div className="px-3 pb-4 flex justify-center">
            <div
              className="overflow-y-scroll max-h-[180px] text-3xl font-semibold scrollbar-hide w-40 text-center"
              ref={scrollMeridiemRef}
              onScroll={handleMeridiemScroll}
            >
              {staticMeridiem.map((m, i) => (
                <motion.div
                  key={m + i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ amount: 0.6 }}
                  className={`
                h-[60px] flex items-center justify-center cursor-pointer transition
                ${preferences.darkMode ? "text-white/85 hover:text-white" : "text-slate-900 hover:text-slate-950"}
              `}
                  onClick={() => handleMeridiemSelect(i)}
                >
                  {m}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WheelPicker;
