import { motion } from "framer-motion";
import { useContext, useEffect, useRef } from "react";
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

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const WheelPicker = ({ value, setValue }) => {
  const { preferences } = useContext(UserContext);
  const itemHeight = 60;

  // scroll refs
  const scrollHourRef = useRef(null);
  const scrollMinuteRef = useRef(null);
  const scrollMeridiemRef = useRef(null);

  // debounce refs (PERSIST across renders)
  const hourTimerRef = useRef(null);
  const minuteTimerRef = useRef(null);
  const meridiemTimerRef = useRef(null);

  // optional: cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hourTimerRef.current);
      clearTimeout(minuteTimerRef.current);
      clearTimeout(meridiemTimerRef.current);
    };
  }, []);

  // helpers: value -> index
  const hourIndexFromValue = () =>
    clamp(
      staticHours.findIndex((h) => h.value === value.hour),
      0,
      staticHours.length - 1,
    );

  const minuteIndexFromValue = () =>
    clamp(
      staticMinutes.findIndex((m) => m.value === value.minutes),
      0,
      staticMinutes.length - 1,
    );

  const meridiemIndexFromValue = () =>
    clamp(
      staticMeridiem.findIndex((m) => m === value.meridiem),
      0,
      staticMeridiem.length - 1,
    );

  const setMeridiem = (m) => {
    setValue((prev) => ({ ...prev, meridiem: m }));
  };

  // --- Hour scroll (snap + setValue) ---
  const handleHourScroll = () => {
    if (!scrollHourRef.current) return;

    clearTimeout(hourTimerRef.current);
    hourTimerRef.current = setTimeout(() => {
      const scrollTop = scrollHourRef.current.scrollTop;
      const closestIndex = Math.round(scrollTop / itemHeight);
      const idx = clamp(closestIndex, 0, staticHours.length - 1);

      scrollHourRef.current.scrollTo({
        top: idx * itemHeight,
        behavior: "smooth",
      });
      setValue((prev) => ({ ...prev, hour: staticHours[idx].value }));
    }, 80);
  };

  const increaseHour = () => {
    const idx = hourIndexFromValue();
    const next = clamp(idx + 1, 0, staticHours.length - 1);
    scrollHourRef.current?.scrollTo({
      top: next * itemHeight,
      behavior: "smooth",
    });
    setValue((prev) => ({ ...prev, hour: staticHours[next].value }));
  };

  const decreaseHour = () => {
    const idx = hourIndexFromValue();
    const next = clamp(idx - 1, 0, staticHours.length - 1);
    scrollHourRef.current?.scrollTo({
      top: next * itemHeight,
      behavior: "smooth",
    });
    setValue((prev) => ({ ...prev, hour: staticHours[next].value }));
  };

  // --- Minute scroll (snap + setValue) ---
  const handleMinuteScroll = () => {
    if (!scrollMinuteRef.current) return;

    clearTimeout(minuteTimerRef.current);
    minuteTimerRef.current = setTimeout(() => {
      const scrollTop = scrollMinuteRef.current.scrollTop;
      const closestIndex = Math.round(scrollTop / itemHeight);
      const idx = clamp(closestIndex, 0, staticMinutes.length - 1);

      scrollMinuteRef.current.scrollTo({
        top: idx * itemHeight,
        behavior: "smooth",
      });
      setValue((prev) => ({ ...prev, minutes: staticMinutes[idx].value }));
    }, 80);
  };

  const increaseMinutes = () => {
    const idx = minuteIndexFromValue();
    const next = clamp(idx + 1, 0, staticMinutes.length - 1);
    scrollMinuteRef.current?.scrollTo({
      top: next * itemHeight,
      behavior: "smooth",
    });
    setValue((prev) => ({ ...prev, minutes: staticMinutes[next].value }));
  };

  const decreaseMinutes = () => {
    const idx = minuteIndexFromValue();
    const next = clamp(idx - 1, 0, staticMinutes.length - 1);
    scrollMinuteRef.current?.scrollTo({
      top: next * itemHeight,
      behavior: "smooth",
    });
    setValue((prev) => ({ ...prev, minutes: staticMinutes[next].value }));
  };

  // Meridiem Logic
  const meridiemWrapRef = useRef(null);
  const meridiemWheelLockRef = useRef(false);

  const toggleMeridiem = (dir) => {
    // dir: +1 = down, -1 = up
    if (dir > 0) setMeridiem("PM");
    else setMeridiem("AM");
  };

  const onMeridiemWheel = (e) => {
    // make it feel like a "picker": scroll up => AM, scroll down => PM
    // prevent page scroll while interacting
    e.preventDefault();

    // simple lock so trackpads don't spam-toggle
    if (meridiemWheelLockRef.current) return;
    meridiemWheelLockRef.current = true;

    const dir = e.deltaY > 0 ? 1 : -1;
    toggleMeridiem(dir);

    setTimeout(() => {
      meridiemWheelLockRef.current = false;
    }, 180);
  };

  // If parent changes value externally, keep the scroll position synced:
  useEffect(() => {
    const hi = hourIndexFromValue();
    scrollHourRef.current?.scrollTo({
      top: hi * itemHeight,
      behavior: "smooth",
    });
  }, [value.hour]);

  useEffect(() => {
    const mi = minuteIndexFromValue();
    scrollMinuteRef.current?.scrollTo({
      top: mi * itemHeight,
      behavior: "smooth",
    });
  }, [value.minutes]);

  useEffect(() => {
    const mei = meridiemIndexFromValue();
    scrollMeridiemRef.current?.scrollTo({
      top: mei * itemHeight,
      behavior: "smooth",
    });
  }, [value.meridiem]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`
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
      <div className="px-5 pb-5">
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
            pointer-events-none absolute left-3 right-3 top-[98px] h-[56px]
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
              max-h-[60px] overflow-y-scroll scrollbar-hide
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
                  font-semibold tracking-tight
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
            pointer-events-none absolute left-3 right-3 top-[98px] h-[56px]
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
              max-h-[60px] overflow-y-scroll scrollbar-hide
            `}
                ref={scrollMinuteRef}
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
                   font-semibold tracking-tight
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

        {/* Meridiem (segmented + wheel) */}
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
              scroll or tap
            </p>
          </div>

          <div className="px-4 pb-4 relative">
            {/* Center highlight lane (like your other ones) */}
            <div
              className={`
        pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[56px]
        rounded-2xl
      `}
            />

            <div
              ref={meridiemWrapRef}
              onWheel={onMeridiemWheel}
              role="radiogroup"
              aria-label="Select meridiem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                  setMeridiem("AM");
                if (e.key === "ArrowRight" || e.key === "ArrowDown")
                  setMeridiem("PM");
                if (e.key === "Enter" || e.key === " ") {
                  setMeridiem(value.meridiem === "AM" ? "PM" : "AM");
                }
              }}
              className={`
        relative grid grid-cols-2 p-1 rounded-2xl border select-none
        ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"}
        focus:outline-none focus-visible:ring-2
        ${preferences.darkMode ? "focus-visible:ring-white/30" : "focus-visible:ring-black/20"}
      `}
              style={{ touchAction: "none" }}
            >
              {/* Sliding pill */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`
          absolute top-0 bottom-0 w-1/2 rounded-xl
          ${preferences.darkMode ? "bg-slate-200" : "bg-zinc-200"}
          ${preferences.darkMode ? "shadow-none" : "shadow-sm"}
        `}
                style={{ left: value.meridiem === "PM" ? "50%" : "0%" }}
              />

              {["AM", "PM"].map((m) => {
                const selected = value.meridiem === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMeridiem(m)}
                    className={`
              relative z-10 h-11 rounded-xl font-semibold tracking-tight transition
              ${
                selected
                  ? preferences.darkMode
                    ? "text-white"
                    : "text-slate-900"
                  : preferences.darkMode
                    ? "text-white/70 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }
            `}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WheelPicker;
