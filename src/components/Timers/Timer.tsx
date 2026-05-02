import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { TimerType } from "../../types/timers";
import UserContext from "../../context/UserContext";
import { BiPause, BiTimer } from "react-icons/bi";
import { PreferencesType } from "../../types/preferences";

const Timer = ({ timer }: { timer: TimerType }) => {
  const { preferences, setTimers } = useContext(UserContext) as {
    preferences: PreferencesType;
    setTimers: Dispatch<SetStateAction<TimerType[]>>;
  };

  const [expanded, setExpanded] = useState(false);
  const [count, setCount] = useState(0);

  const wasDragging = useRef(false);

  const { progress, remainingText, totalText, isDone } = useMemo(() => {
    const start = new Date(timer.startTime).getTime();
    const end = new Date(timer.endTime).getTime();
    const now = Date.now();

    const total = timer.howLongMS || end - start;
    const remaining = Math.max(end - now, 0);
    const elapsed = Math.max(now - start, 0);

    const progress = total > 0 ? Math.min(elapsed / total, 1) : 0;

    const formatTime = (ms: number) => {
      const totalSeconds = Math.ceil(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(
          seconds,
        ).padStart(2, "0")}`;
      }

      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    return {
      progress,
      remainingText: formatTime(remaining),
      totalText: formatTime(total),
      isDone: remaining <= 0,
    };
  }, [timer, count]);

  useEffect(() => {
    if (timer.paused || isDone) return;

    const int = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(int);
  }, [timer.paused, isDone]);

  const togglePause = () => {};

  const handleUnpin = () => {};

  const handleTimerCancel = () => {
    setTimers((prev) => prev.filter((t) => t.id !== timer.id));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => {
        wasDragging.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          wasDragging.current = false;
        }, 0);
      }}
      layout
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`
        fixed left-6 top-6 z-50
        select-none cursor-grab overflow-hidden
        rounded-[28px] will-change-transform border shadow-2xl backdrop-blur-md
        ${
          preferences.darkMode
            ? "bg-[#161616]/90 border-white/10 text-white"
            : "bg-white/90 border-black/10 text-slate-900"
        }
      `}
    >
      {/* Status rail */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-[8px]
          ${
            isDone
              ? "bg-gradient-to-b from-lime-400 to-emerald-400"
              : timer.paused
                ? "bg-gradient-to-b from-amber-400 to-orange-300"
                : "bg-gradient-to-b from-cyan-400 to-sky-400"
          }
        `}
      />

      <motion.button
        layout
        type="button"
        onClick={() => {
          if (wasDragging.current) return;
          setExpanded((prev) => !prev);
        }}
        className={`
          group relative flex items-center gap-3 text-left
          transition-all duration-200 pl-5
          ${expanded ? "min-w-[260px] px-4 py-4" : "w-[158px] px-4 py-3"}
        `}
      >
        {/* Icon / percent */}
        <motion.div
          layout
          className={`
            grid place-items-center shrink-0 rounded-2xl border shadow-sm font-black
            ${expanded ? "h-11 w-11 text-xs" : "h-9 w-9 text-[10px]"}
            ${
              isDone
                ? preferences.darkMode
                  ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
                : timer.paused
                  ? preferences.darkMode
                    ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                  : preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
            }
          `}
        >
          {isDone ? (
            "✓"
          ) : timer.paused ? (
            <BiPause className="text-lg" />
          ) : (
            <div className="flex items-end">
              {Math.round(progress * 100)}
              <span className="text-[8px]">%</span>
            </div>
          )}
        </motion.div>

        <motion.div layout className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`
    font-bold leading-none tracking-tight tabular-nums
    ${expanded ? "text-2xl" : "w-[52px] text-center text-base"}
  `}
            >
              {remainingText}
            </p>

            <div className="flex items-center gap-1">
              {timer.pinned && (
                <span
                  className={`
                    rounded-2xl border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 text-white/60"
                        : "bg-black/[0.03] border-black/10 text-slate-500"
                    }
                  `}
                >
                  Pin
                </span>
              )}

              {timer.paused && (
                <span
                  className={`
                    rounded-2xl border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide
                    ${
                      preferences.darkMode
                        ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    }
                  `}
                >
                  Paused
                </span>
              )}
            </div>
          </div>

          {expanded && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <div
                className={`
                  h-2 overflow-hidden rounded-full border shadow-inner
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className={`
                    h-full rounded-full
                    ${
                      isDone
                        ? "bg-gradient-to-r from-lime-400 to-emerald-400"
                        : timer.paused
                          ? "bg-gradient-to-r from-amber-400 to-orange-300"
                          : "bg-gradient-to-r from-cyan-400 to-sky-400"
                    }
                  `}
                />
              </div>

              <div
                className={`mt-2 flex items-center justify-between text-[10px] font-semibold ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                <span>Total {totalText}</span>
                <span>{timer.pauseCount} pauses</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                {/* Clear / kill timer */}
                <button
                  onClick={handleTimerCancel}
                  className={`
      flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold
      border transition-all duration-150 active:scale-[0.96]
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
          : "bg-black/[0.04] border-black/10 text-slate-500 hover:bg-black/[0.06]"
      }
    `}
                >
                  {/* you can swap icon if you want something else */}
                  <span className="text-xs">✕</span>
                  Cancel
                </button>
                {/* Unpin / Hide */}
                <button
                  onClick={handleUnpin}
                  className={`
      flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold
      border transition-all duration-150 active:scale-[0.96]
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
          : "bg-black/[0.04] border-black/10 text-slate-500 hover:bg-black/[0.06]"
      }
    `}
                >
                  {/* you can swap icon if you want something else */}
                  <span className="text-xs">✕</span>
                  Hide
                </button>

                {/* Pause / Resume */}
                <button
                  onClick={togglePause}
                  className={`
      flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold
      border transition-all duration-150 active:scale-[0.96]
      ${
        timer.paused
          ? preferences.darkMode
            ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100 hover:bg-emerald-500/25"
            : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          : preferences.darkMode
            ? "bg-amber-500/15 border-amber-300/20 text-amber-100 hover:bg-amber-500/25"
            : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
      }
    `}
                >
                  {timer.paused ? (
                    <>
                      <BiTimer className="text-base" />
                      Resume
                    </>
                  ) : (
                    <>
                      <BiPause className="text-base" />
                      Pause
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {!expanded && (
          <div
            className={`
              absolute inset-x-5 bottom-1.5 h-0.5 overflow-hidden rounded-full
              ${preferences.darkMode ? "bg-white/10" : "bg-black/10"}
            `}
          >
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              className={`
                h-full rounded-full
                ${
                  isDone
                    ? "bg-emerald-400"
                    : timer.paused
                      ? "bg-amber-400"
                      : "bg-cyan-400"
                }
              `}
            />
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Timer;
