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
import {
  getNewTimes,
  removeTimerFromStorage,
  togglePinInStorage,
  toggleTimerPaused,
} from "../../utils/helpers";

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
    if (isDone) {
      triggerAlarm();
      return;
    }

    if (timer.paused) return;

    const int = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(int);
  }, [timer.paused, isDone]);

  const triggerAlarm = async () => {
    // Please check permissions and use in app notification system if it does not work or is denied
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.showNotification) {
      await reg.showNotification("Timer Finished", {
        body: `Your ${timer.title + " "}timer has finished`,
        icon: "/sys-icon.svg",
        badge: "/badge.svg",
        tag: "timer-alert",
        data: {
          url: "/",
        },
      });
      if ("vibrate" in navigator) {
        navigator.vibrate([1000, 250, 250]);
      }
    }
  };

  const togglePause = (e) => {
    e.preventDefault();

    setTimers((prev) =>
      prev.map((t: TimerType) => {
        if (t.id === timer.id) {
          if (t.paused) {
            const { start, end } = getNewTimes(timer);
            return {
              ...t,
              paused: false,
              endTime: end,
              startTime: start,
            };
          }
          return {
            ...t,
            paused: true,
            lastPausedAt: new Date().toString(),
          };
        }
        return t;
      }),
    );

    toggleTimerPaused(timer);
  };

  const handleUnpin = () => {
    setTimers((prev: TimerType[]) =>
      prev.map((t: TimerType) => {
        if (t.id === timer.id) {
          return {
            ...t,
            pinned: false,
          };
        }
        return t;
      }),
    );

    togglePinInStorage(timer.id, timer.pinned);
  };

  const handleTimerCancel = () => {
    setTimers((prev) => prev.filter((t) => t.id !== timer.id));
    removeTimerFromStorage(timer.id);
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
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      className={`
    fixed left-6 top-6 z-50
    w-[240px]
    select-none cursor-grab overflow-hidden
    rounded-[26px] border shadow-2xl backdrop-blur-md
    ${
      preferences.darkMode
        ? "bg-[#161616]/90 border-white/10 text-white"
        : "bg-white/90 border-black/10 text-slate-900"
    }
  `}
    >
      <div
        className={`
      absolute left-0 top-0 bottom-0 w-[7px]
      ${
        isDone
          ? "bg-gradient-to-b from-lime-400 to-emerald-400"
          : timer.paused
            ? "bg-gradient-to-b from-amber-400 to-orange-300"
            : "bg-gradient-to-b from-cyan-400 to-sky-400"
      }
    `}
      />

      <button
        type="button"
        onClick={() => {
          if (wasDragging.current) return;
          setExpanded((prev) => !prev);
        }}
        className="relative w-full text-left pl-5 pr-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div
            className={`
          grid h-10 w-10 shrink-0 place-items-center rounded-2xl border shadow-sm font-black text-[11px]
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
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="w-[70px] text-lg font-bold leading-none tracking-tight tabular-nums">
                {remainingText}
              </p>

              <div className="flex min-w-[74px] justify-end gap-1">
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
          </div>
        </div>

        {!expanded && (
          <div
            className={`
          mt-2 h-0.5 overflow-hidden rounded-full
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
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pl-5">
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

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={handleTimerCancel}
              className="rounded-full border px-3 py-1.5 text-[11px] font-bold"
            >
              Cancel
            </button>

            <button
              onClick={handleUnpin}
              className="rounded-full border px-3 py-1.5 text-[11px] font-bold"
            >
              Hide
            </button>

            <button
              onClick={togglePause}
              className="rounded-full border px-3 py-1.5 text-[11px] font-bold"
            >
              {timer.paused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Timer;
