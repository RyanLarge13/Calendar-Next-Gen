import { motion } from "framer-motion";
import { FaStickyNote } from "react-icons/fa";
import { AiTwotoneHome, AiFillSchedule } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";
import {
  BsListCheck,
  BsFillClipboardDataFill,
  BsListTask,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { IoIosAlarm } from "react-icons/io";
import { TbKeyboardHide } from "react-icons/tb";
import { MdOutlineKeyboardHide } from "react-icons/md";
import { useContext } from "react";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";

const MenuNavigation = () => {
  const { showCategory, setShowCategory, hideMenuNav, setHideMenuNav } =
    useContext(InteractiveContext);
  const { preferences } = useContext(UserContext);

  return (
    <motion.div
      initial={{ y: "-110%" }}
      animate={hideMenuNav ? { y: "-70%" } : { y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`
    fixed top-0 left-0 right-0 z-20
    px-3 pt-3 pb-20
    ${preferences.darkMode ? "text-white" : "text-slate-900"}
  `}
    >
      {/* Glass dock */}
      <div
        className={`
      relative mx-auto max-w-2xl
      rounded-3xl border pb-5 shadow-2xl backdrop-blur-md
      ${preferences.darkMode ? "bg-[#161616]/90 border-white/10" : "bg-white/90 border-black/10"}
    `}
      >
        {/* Tiles */}
        <div className="grid grid-cols-4 gap-2 p-3">
          {[
            { key: "reminder", label: "reminders", icon: <IoIosAlarm /> },
            { key: "todo-list", label: "lists", icon: <BsListCheck /> },
            { key: "task", label: "tasks", icon: <BsListTask /> },
            {
              key: "kanban",
              label: "kanban",
              icon: <BsFillClipboardDataFill />,
            },
            {
              key: "event",
              label: "events",
              icon: <BsFillCalendar2EventFill />,
            },
            { key: "groupevent", label: "group", icon: <HiUserGroup /> },
            { key: "stickynote", label: "sticky", icon: <FaStickyNote /> },
            { key: "appointment", label: "appts", icon: <AiFillSchedule /> },
          ].map((item) => {
            const selected = showCategory === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  setShowCategory((prev) =>
                    prev === item.key ? null : item.key,
                  )
                }
                className={`
              group w-full
              rounded-2xl border px-2 py-3
              transition-all duration-200
              active:scale-[0.98]
              ${
                selected
                  ? preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/25 shadow-sm"
                    : "bg-cyan-50 border-cyan-200 shadow-sm"
                  : preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/7"
                    : "bg-white border-black/10 hover:bg-black/[0.02]"
              }
            `}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div
                    className={`
                  grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition
                  ${
                    selected
                      ? preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/25 text-cyan-100"
                        : "bg-cyan-100 border-cyan-200 text-cyan-700"
                      : preferences.darkMode
                        ? "bg-white/5 border-white/10 text-white/75 group-hover:text-cyan-200"
                        : "bg-black/[0.03] border-black/10 text-slate-600 group-hover:text-cyan-600"
                  }
                `}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  <p
                    className={`
                  text-[11px] font-semibold tracking-tight
                  ${selected ? (preferences.darkMode ? "text-cyan-100" : "text-slate-800") : "opacity-80"}
                `}
                  >
                    {item.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating action pills */}
        <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-3">
          {/* Home / Clear */}
          <button
            type="button"
            onClick={() => setShowCategory(null)}
            className={`
          grid place-items-center h-10 w-20 rounded-2xl border shadow-xl backdrop-blur-md transition
          active:scale-95
          ${
            preferences.darkMode
              ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
              : "bg-white/95 border-black/10 text-slate-700 hover:bg-white"
          }
        `}
            aria-label="Home"
          >
            <AiTwotoneHome className="text-lg" />
          </button>

          {/* Hide */}
          <button
            type="button"
            onClick={() => setHideMenuNav((prev) => !prev)}
            className={`
          grid place-items-center h-10 w-10 rounded-2xl border shadow-xl backdrop-blur-md transition
          active:scale-95
          ${
            preferences.darkMode
              ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
              : "bg-white/95 border-black/10 text-slate-700 hover:bg-white"
          }
        `}
            aria-label="Hide menu"
          >
            {hideMenuNav ? <MdOutlineKeyboardHide /> : <TbKeyboardHide />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuNavigation;
