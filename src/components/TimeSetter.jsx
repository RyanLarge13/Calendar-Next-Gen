import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";

const TimeSetter = ({ openTimeSetter }) => {
  const { string } = useContext(DatesContext);
  const { preferences } = useContext(UserContext);

  const [value, setValue] = useState({ hour: 12, minute: 0o0, meridiem: "AM" });

  // const calcValues = (ISODate) => {
  //   const formattedDate = new Date(ISODate);
  //   const hours = formattedDate.getHours();
  //   const minutes = formattedDate.getMinutes();
  //   const formattedDateString = () => {
  //     return `${hours > 12 ? hours % 12 : hours === 0 ? "12" : hours}:${
  //       minutes <= 9 ? "0" + minutes : minutes
  //     } ${hours >= 12 ? "PM" : "AM"}`;
  //   };
  //   const dateTime = () => {
  //     const currentDate = new Date(string);
  //     const month = currentDate.getMonth();
  //     const day = currentDate.getDate();
  //     const year = currentDate.getFullYear();
  //     // console.log(new Date(year, month, day, hours, minutes).toString());
  //     return new Date(year, month, day, hours, minutes).toString();
  //   };
  //   // setDateTimeString(formattedDateString);
  //   // setDateTime(dateTime);
  // };

  const createArray = (length, add = 0) =>
    Array.from({ length }, (_, i) => {
      const value = i + add;
      return {
        label: value.toString().padStart(2, "0"),
        value: value,
      };
    });

  const hours = createArray(12, 1);
  const minutes = createArray(60);
  const meridiem = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`
    fixed z-[999]
    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
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
          onClick={() => openTimeSetter()}
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
          Close
        </button>

        <p
          className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
        >
          Select time
        </p>

        <button
          onClick={() => {
            setDateTime(null);
            setDateTimeString("");
            setValue(null);
          }}
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
      <div className="px-4 py-4">
        <div
          className={`
      rounded-2xl border shadow-sm
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
      overflow-hidden
    `}
          style={{ height: 210 }} // important: consistent wheel height
        >
          <WheelPickerWrapper>
            <div className="w-1/3 min-w-0">
              <WheelPicker
                options={hours}
                defaultValue={12}
                infinite
                onValueChange={(h) =>
                  setValue((prev) => ({ ...prev, hour: h }))
                }
              />
            </div>

            <div className="w-1/3 min-w-0">
              <WheelPicker
                options={minutes}
                defaultValue={10}
                infinite
                onValueChange={(m) =>
                  setValue((prev) => ({ ...prev, minute: m }))
                }
              />
            </div>

            <div className="w-1/3 min-w-0">
              <WheelPicker
                options={meridiem}
                defaultValue="AM"
                onValueChange={(mer) =>
                  setValue((prev) => ({ ...prev, meridiem: mer }))
                }
              />
            </div>
          </WheelPickerWrapper>
        </div>

        <div className="mt-3 flex justify-between items-center">
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
            {value?.hour - 1 ?? "--"}:
            {String(value?.minute - 1 ?? "--").padStart(2, "0")}{" "}
            {value?.meridiem ?? ""}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeSetter;
