import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { MdOutlineOpenInNew } from "react-icons/md";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import {
  formatDbText,
  formatRelativeTime,
  setStateAndPushWindowState,
} from "../../utils/helpers.js";
import Lists from "../Lists/Lists.jsx";
import MainMenu from "./MainMenu.jsx";
import Reminders from "../Reminders/Reminders.jsx";
import Kanbans from "../Kanban/Kanbans.jsx";
import StaticStickies from "../Stickies/StaticStickies.jsx";
import Switch from "../Misc/Switch.jsx";
import Tasks from "../Tasks/Tasks";
import Events from "../Events/Events.jsx";

const Menu = () => {
  const { menu, showCategory, setShowCategory, setMenu, setEvent } =
    useContext(InteractiveContext);
  const { lists, setLists, preferences, events } = useContext(UserContext);
  const { dateObj } = useContext(DatesContext);

  const [timeOfDay, setTimeOfDay] = useState(null);
  const [reminderSort, setReminderSort] = useState(false);
  const [reminderSearch, setReminderSearch] = useState(false);
  const [reminderSortOpt, setReminderSortOpt] = useState("");
  const [reminderSearchTxt, setReminderSearchTxt] = useState("");
  const [listSort, setListSort] = useState(false);
  const [listSearch, setListSearch] = useState(false);
  const [listSortOpt, setListSortOpt] = useState("");
  const [listSearchTxt, setListSearchTxt] = useState("");
  const [taskSort, setTaskSort] = useState(false);
  const [taskSearch, setTaskSearch] = useState(false);
  const [taskSortOpt, setTaskSortOpt] = useState("");
  const [taskSearchTxt, setTaskSearchTxt] = useState("");

  const backspaceRef = useRef(false);

  useEffect(() => {
    if (backspaceRef.current === true) {
      return;
    }

    const handleBack = () => {
      if (showCategory !== null) {
        setShowCategory(null);
      }
      if (showCategory === null) {
        backspaceRef.current = false;
        setMenu(false);
      }
    };

    backspaceRef.current = true;
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [showCategory]);

  useEffect(() => {
    const hours = dateObj.getHours();
    if (hours < 12) {
      setTimeOfDay("Good Morning");
    }
    if (hours >= 12 && hours <= 16) {
      setTimeOfDay("Good Afternoon");
    }
    if (hours > 16 && hours <= 19) {
      setTimeOfDay("Good Evening");
    }
    if (hours > 19) {
      setTimeOfDay("Goodnight");
    }
  }, []);

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10"
        >
          {/* Panel */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`
          relative mx-auto h-full
          px-3 sm:px-6
          pt-12
          `}
          >
            {/* Backdrop */}
            <div
              onClick={() => {
                // optional: click outside to close
                setMenu(false);
              }}
              className={`
          absolute inset-0
          ${preferences.darkMode ? "bg-black/50" : "bg-black/30"}
          backdrop-blur-sm
        `}
            />
            <div
              className={`
            mx-auto max-w-6xl h-[calc(100vh-5rem)]
            rounded-3xl border shadow-2xl overflow-hidden
            ${
              preferences.darkMode
                ? "bg-[#161616]/90 border-white/10 text-white"
                : "bg-white/90 border-black/10 text-slate-900"
            }
            backdrop-blur-md
          `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Inner scroll container */}
              <div className="h-full overflow-auto scrollbar-slick">
                {/* Content padding */}
                <div className="px-3 sm:px-6 pb-10">
                  {/* MAIN MENU */}
                  {showCategory === null && (
                    <div className="pt-2 sm:pt-4">
                      <MainMenu timeOfDay={timeOfDay} />
                    </div>
                  )}

                  {/* CATEGORY VIEWS */}
                  {showCategory && (
                    <div className="">
                      {/* REMINDERS */}
                      {showCategory === "reminder" && (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          {/* Controls bar */}
                          <div
                            className={`
                          sticky top-0 z-10
                          -mx-3 sm:-mx-6
                          px-3 sm:px-6 pt-3 pb-3
                          border-b
                          ${
                            preferences.darkMode
                              ? "bg-[#161616]/90 border-white/10"
                              : "bg-white/90 border-black/10"
                          }
                          backdrop-blur-md
                        `}
                          >
                            <div className="mx-auto max-w-6xl">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex gap-3">
                                  <Switch
                                    title="Sort"
                                    styles=""
                                    value={reminderSort}
                                    toggle={setReminderSort}
                                  />
                                  <Switch
                                    title="Search"
                                    styles=""
                                    value={reminderSearch}
                                    toggle={setReminderSearch}
                                  />
                                </div>

                                {/* Sort pills */}
                                {reminderSort ? (
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      ["title", "Title"],
                                      ["important", "Important"],
                                      ["event", "Event"],
                                      ["today", "Today"],
                                      ["tomorrow", "Tomorrow"],
                                      ["month", "This Month"],
                                      ["week", "This Week"],
                                      ["past", "Past"],
                                    ].map(([val, label]) => (
                                      <button
                                        key={val}
                                        onClick={() => setReminderSortOpt(val)}
                                        className={`
                                      rounded-2xl px-3 py-2 text-xs font-semibold border shadow-sm transition
                                      active:scale-95
                                      ${
                                        reminderSortOpt === val
                                          ? preferences.darkMode
                                            ? "bg-cyan-500/15 border-cyan-300/25 text-cyan-100"
                                            : "bg-cyan-50 border-cyan-200 text-slate-800"
                                          : preferences.darkMode
                                            ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                            : "bg-white border-black/10 text-slate-700 hover:bg-black/[0.02]"
                                      }
                                    `}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>
                                ) : null}

                                {/* Search */}
                                {reminderSearch ? (
                                  <input
                                    className={`
                                  w-full sm:w-[320px]
                                  rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition
                                  ${
                                    preferences.darkMode
                                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-500/20"
                                      : "bg-white border-black/10 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-500/10"
                                  }
                                `}
                                    placeholder="Search reminders…"
                                    onChange={(e) =>
                                      setReminderSearchTxt(e.target.value)
                                    }
                                  />
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <Reminders
                            sort={reminderSort}
                            sortOpt={reminderSortOpt}
                            search={reminderSearch}
                            searchTxt={reminderSearchTxt}
                          />
                        </motion.div>
                      )}

                      {/* LISTS */}
                      {showCategory === "todo-list" && (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <div
                            className={`
                          sticky top-0 z-10
                          -mx-3 sm:-mx-6
                          px-3 sm:px-6 pt-3 pb-3
                          border-b
                          ${
                            preferences.darkMode
                              ? "bg-[#161616]/90 border-white/10"
                              : "bg-white/90 border-black/10"
                          }
                          backdrop-blur-md
                        `}
                          >
                            <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex gap-3">
                                <Switch
                                  title="Sort"
                                  styles=""
                                  value={listSort}
                                  toggle={setListSort}
                                />
                                <Switch
                                  title="Search"
                                  styles=""
                                  value={listSearch}
                                  toggle={setListSearch}
                                />
                              </div>

                              {listSort ? (
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    ["title", "Title"],
                                    ["event", "Event"],
                                    ["length", "Items"],
                                  ].map(([val, label]) => (
                                    <button
                                      key={val}
                                      onClick={() => setListSortOpt(val)}
                                      className={`
                                    rounded-2xl px-3 py-2 text-xs font-semibold border shadow-sm transition active:scale-95
                                    ${
                                      listSortOpt === val
                                        ? preferences.darkMode
                                          ? "bg-cyan-500/15 border-cyan-300/25 text-cyan-100"
                                          : "bg-cyan-50 border-cyan-200 text-slate-800"
                                        : preferences.darkMode
                                          ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                          : "bg-white border-black/10 text-slate-700 hover:bg-black/[0.02]"
                                    }
                                  `}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              ) : null}

                              {listSearch ? (
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    setListSearchTxt(e.target.value)
                                  }
                                  placeholder="Search lists…"
                                  className={`
                                w-full sm:w-[320px]
                                rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition
                                ${
                                  preferences.darkMode
                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-500/20"
                                    : "bg-white border-black/10 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-500/10"
                                }
                              `}
                                />
                              ) : null}
                            </div>
                          </div>

                          <Lists
                            listSort={listSort}
                            listSortOpt={listSortOpt}
                            listSearch={listSearch}
                            listSearchTxt={listSearchTxt}
                          />
                        </motion.div>
                      )}

                      {/* TASKS */}
                      {showCategory === "task" && (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <div
                            className={`
                          sticky top-0 z-10
                          -mx-3 sm:-mx-6
                          px-3 sm:px-6 pt-3 pb-3
                          border-b
                          ${
                            preferences.darkMode
                              ? "bg-[#161616]/90 border-white/10"
                              : "bg-white/90 border-black/10"
                          }
                          backdrop-blur-md
                        `}
                          >
                            <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex gap-3">
                                <Switch
                                  title="Sort"
                                  styles=""
                                  value={taskSort}
                                  toggle={setTaskSort}
                                />
                                <Switch
                                  title="Search"
                                  styles=""
                                  value={taskSearch}
                                  toggle={setTaskSearch}
                                />
                              </div>

                              {taskSort ? (
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    ["title", "Title"],
                                    ["length", "Count"],
                                  ].map(([val, label]) => (
                                    <button
                                      key={val}
                                      onClick={() => setTaskSortOpt(val)}
                                      className={`
                                    rounded-2xl px-3 py-2 text-xs font-semibold border shadow-sm transition active:scale-95
                                    ${
                                      taskSortOpt === val
                                        ? preferences.darkMode
                                          ? "bg-cyan-500/15 border-cyan-300/25 text-cyan-100"
                                          : "bg-cyan-50 border-cyan-200 text-slate-800"
                                        : preferences.darkMode
                                          ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                          : "bg-white border-black/10 text-slate-700 hover:bg-black/[0.02]"
                                    }
                                  `}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              ) : null}

                              {taskSearch ? (
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    setTaskSearchTxt(e.target.value)
                                  }
                                  placeholder="Search tasks…"
                                  className={`
                                w-full sm:w-[320px]
                                rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition
                                ${
                                  preferences.darkMode
                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-500/20"
                                    : "bg-white border-black/10 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-500/10"
                                }
                              `}
                                />
                              ) : null}
                            </div>
                          </div>

                          <Tasks
                            taskSort={taskSort}
                            taskSortOpt={taskSortOpt}
                            taskSearch={taskSearch}
                            taskSearchTxt={taskSearchTxt}
                          />
                        </motion.div>
                      )}

                      {/* SIMPLE CATEGORIES (just wrap in spacing) */}
                      {showCategory === "kanban" && (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <Kanbans />
                        </motion.div>
                      )}

                      {showCategory === "stickynote" && (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="relative"
                        >
                          <StaticStickies />
                        </motion.div>
                      )}

                      {/* EVENTS (we'll style this card list next, but wrapper improved now) */}
                      {showCategory === "event" ? (
                        <motion.div
                          initial={{ x: "-6%", opacity: 0 }}
                          exit={{ x: "-6%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="px-3 sm:px-6"
                        >
                          <Events />
                        </motion.div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
