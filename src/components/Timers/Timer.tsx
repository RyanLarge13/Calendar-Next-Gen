import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TimerType } from "../../types/timers";

const Timer = ({ timer }: { timer: TimerType }) => {
  const [expanded, setExpanded] = useState(false);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(int);
  }, []);

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

  const handleDragEnd = (e) => {
    e.stopImmediatePropagation();
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      layout
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`
        fixed left-6 top-6 z-50
        select-none cursor-grab overflow-hidden
        rounded-full border shadow-lg backdrop-blur-xl
        ${
          isDone
            ? "border-emerald-300/40 bg-emerald-50/90 text-emerald-950 shadow-emerald-500/10"
            : "border-rose-200/60 bg-white/85 text-slate-800 shadow-rose-500/10"
        }
      `}
    >
      <motion.button
        layout
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={`
          group relative flex items-center gap-2
          rounded-full text-left
          transition-colors duration-200
          ${expanded ? "min-w-[230px] px-4 py-3" : "min-w-[118px] px-3 py-2"}
        `}
      >
        <motion.div
          layout
          className={`
            flex justify-center items-center shrink-0 rounded-full border font-black
            ${expanded ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]"}
            ${
              isDone
                ? "border-emerald-300/50 bg-emerald-100 text-emerald-700"
                : "border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 text-rose-500"
            }
          `}
        >
          {isDone ? "✓" : `${Math.round(progress * 100)}`}
          <span className="text-[8px]">%</span>
        </motion.div>

        <motion.div layout className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`
                font-bold leading-none tracking-tight
                ${expanded ? "text-xl" : "text-sm"}
              `}
            >
              {remainingText}
            </p>

            {timer.pinned && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-rose-500">
                Pin
              </span>
            )}
          </div>

          {expanded && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2"
            >
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className={`
                    h-full rounded-full
                    ${
                      isDone
                        ? "bg-emerald-400"
                        : "bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200"
                    }
                  `}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-slate-400">
                <span>Total {totalText}</span>
                <span>{timer.pauseCount} pauses</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {!expanded && (
          <div className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-slate-200/80">
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-rose-300 to-orange-200"
            />
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Timer;
