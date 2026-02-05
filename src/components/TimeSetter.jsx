import { useState, useContext } from "react";
import { motion } from "framer-motion";
import UserContext from "../context/UserContext";
import WheelPicker from "./WheelPicker";

const TimeSetter = ({ saveData, cancelTimeSetter }) => {
  const { preferences } = useContext(UserContext);

  const [value, setValue] = useState({
    hour: 12,
    minutes: 0o0,
    meridiem: "AM",
  });

  const resetValues = () => {
    setValue({
      hour: 12,
      minutes: 0o0,
      meridiem: "AM",
    });
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
    w-[92vw] max-w-sm
    rounded-3xl border shadow-2xl overflow-hidden
    backdrop-blur-md
    ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
  `}
    >
      {/* Header */}
      <div
        className={`
      px-4 py-3
      flex justify-between items-center
      border-b
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    `}
      >
        <button
          onClick={cancelTimeSetter}
          className={`
        px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
        active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
        }
      `}
        >
          Cancel
        </button>

        <p
          className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
        >
          Select time
        </p>

        <button
          onClick={resetValues}
          className={`
        px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
        active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-200"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-600"
        }
      `}
        >
          Clear
        </button>
      </div>

      {/* Body */}
      <div className="">
        <div
          className={`
      rounded-2xl border shadow-sm
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
      overflow-hidden
    `} // important: consistent wheel height
        >
          <WheelPicker value={value} setValue={setValue} />
        </div>

        <div className="p-3 flex justify-between items-center">
          <p
            className={`text-[11px] ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
          >
            Tip: scroll each column
          </p>
          <div
            className={`
        text-[11px] font-semibold px-3 py-1.5 rounded-2xl border
        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
      `}
          >
            {value?.hour ?? "--"}:
            {String(value?.minutes ?? "--").padStart(2, "0")}{" "}
            {value?.meridiem ?? ""}
          </div>

          {/* Save button. Probably should be moved */}
          <button
            onClick={() => saveData(value)}
            className={`
        px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
        active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-emerald-200"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-emerald-300"
        }
      `}
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeSetter;
