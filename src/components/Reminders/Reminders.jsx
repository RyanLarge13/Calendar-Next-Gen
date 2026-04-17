import { motion } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
import { BiAlarmSnooze, BiCheckCircle } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs";
import GroupedReminders from "./GroupedReminders.jsx";
import { MdOutlineClearAll } from "react-icons/md";
import { useModalActions } from "../../context/ContextHooks/ModalContext.jsx";

const Reminders = ({ sort, sortOpt, search, searchTxt }) => {
  const { reminders, preferences } = useContext(UserContext);
  const { dateObj, string, setString } = useContext(DatesContext);
  const { setType, setMenu, setAddNewEvent } = useContext(InteractiveContext);

  const { openModal } = useModalActions();

  // Pull this from user preferences in the future
  const [grouping, setGrouping] = useState({
    complete: "week",
    incomplete: "week",
  });

  const incompleteReminders = useMemo(() => {
    return reminders.filter((r) => !r.completed);
  }, [reminders, grouping]);
  const completedRemindersToRender = useMemo(() => {
    return reminders.filter((r) => r.completed);
  }, [reminders, grouping]);

  // useEffect(() => {
  //   setIncompleteReminders(reminders.filter((r) => !r.completed));
  //   setCompletedRemindersToRender(reminders.filter((r) => r.completed));
  // }, [reminders, grouping]);

  // useEffect(() => {
  //   if (sort && sortOpt) {
  //     const now = new Date();
  //     const d = new Date();
  //     const startOfDay = d.setHours(0, 0, 0, 0);
  //     switch (sortOpt) {
  //       case "title":
  //         {
  //           const copy = [...incompleteReminders];
  //           const sortedByTitle = copy.sort((a, b) =>
  //             a.title.localeCompare(b.title),
  //           );
  //           setIncompleteReminders(sortedByTitle);
  //         }
  //         break;
  //       case "important":
  //         {
  //           const d = new Date();
  //           const hourAgo = new Date(d.getTime() - 60 * 60 * 1000);
  //           const importantReminders = reminders.filter(
  //             (rem) => new Date(rem.time) >= hourAgo && new Date(rem.time) <= d,
  //           );
  //           setIncompleteReminders(importantReminders);
  //         }
  //         break;
  //       case "event":
  //         {
  //           const copy = [...incompleteReminders];
  //           const eventCarryingRems = copy.filter(
  //             (rem) => rem.eventRefId !== null,
  //           );
  //           const sortedEventRems = eventCarryingRems.sort((a, b) =>
  //             a.title.localeCompare(b.title),
  //           );
  //           setIncompleteReminders(sortedEventRems);
  //         }
  //         break;
  //       case "today":
  //         {
  //           const dayAhead = new Date();
  //           dayAhead.setTime(23, 59, 59, 999);
  //           const todaysRems = reminders.filter((rem) => {
  //             const remTime = new Date(rem.time);
  //             return remTime >= startOfDay && remTime <= dayAhead;
  //           });
  //           setIncompleteReminders(todaysRems);
  //         }
  //         break;
  //       case "tomorrow":
  //         {
  //           const midnight = new Date(startOfDay);
  //           const midnightTomorrow = new Date(midnight);
  //           midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
  //           const endOfTomorrow = new Date(midnightTomorrow);
  //           endOfTomorrow.setHours(23, 59, 59, 999);
  //           const tomorrowsRems = reminders.filter((rem) => {
  //             const remTime = new Date(rem.time);
  //             return remTime >= midnightTomorrow && remTime <= endOfTomorrow;
  //           });
  //           setIncompleteReminders(tomorrowsRems);
  //         }
  //         break;
  //       case "month":
  //         {
  //           const monthAhead = new Date(now.getMonth() + 1);
  //           const monthRems = reminders.filter((rem) => {
  //             const remTime = new Date(rem.time);
  //             return remTime <= monthAhead && remTime >= d;
  //           });
  //           setIncompleteReminders(monthRems);
  //         }
  //         break;
  //       case "week":
  //         {
  //           const weekAhead = new Date(startOfDay);
  //           weekAhead.setDate(now.getDate() + 7);
  //           const weekRems = reminders.filter((rem) => {
  //             const remTime = new Date(rem.time);
  //             return remTime <= weekAhead && remTime >= now;
  //           });
  //           setIncompleteReminders(weekRems);
  //         }
  //         break;
  //       case "past":
  //         {
  //           const pastRems = reminders.filter((rem) => {
  //             const remTime = new Date(rem.time);
  //             return remTime < now;
  //           });
  //           setIncompleteReminders(pastRems);
  //         }
  //         break;
  //       default:
  //         setIncompleteReminders(incompleteReminders);
  //     }
  //   } else {
  //     setIncompleteReminders(incompleteReminders);
  //   }
  // }, [sort, sortOpt, reminders]);

  // useEffect(() => {
  //   if (search && searchTxt) {
  //     const filteredReminders = incompleteReminders.filter((rem) =>
  //       rem.title.toLowerCase().includes(searchTxt.toLowerCase()),
  //     );
  //     setIncompleteReminders(filteredReminders);
  //   } else {
  //     setIncompleteReminders(incompleteReminders);
  //   }
  // }, [search, searchTxt]);

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("reminder");
    setMenu(false);
    openModal();
    setAddNewEvent(true);
  };

  const updateGroup = (complete, type) => {
    setGrouping((prev) => ({
      complete: complete ? type : prev.complete,
      incomplete: complete ? prev.incomplete : type,
    }));
  };

  return (
    <motion.div className="mt-6 px-3 sm:px-6 mb-96">
      {/* Center container to prevent "stretching across the universe" */}
      <div className="mx-auto max-w-6xl">
        {incompleteReminders.length < 1 ? (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-rose-500/15 border-rose-300/20 text-rose-100" : "bg-rose-50 border-rose-200 text-rose-700"}
                `}
                  >
                    <BiAlarmSnooze className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No upcoming reminders
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Create one and we’ll keep you on track.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModalAndSetType()}
                  className={`
                grid place-items-center h-11 w-11 rounded-2xl border shadow-md transition
                hover:scale-[1.02] active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/10 border-white/10 hover:bg-white/15 text-white" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"}
              `}
                  aria-label="Add reminder"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-y-5 justify-between items-start gap-3 mb-3 mt-40">
              <div className="flex gap-x-5 items-center">
                <div
                  className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100" : "bg-cyan-50 border-cyan-200 text-cyan-700"}
                `}
                >
                  <BiAlarmSnooze className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Active Reminders
                  </h2>
                  <p
                    className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                  >
                    Here are your active reminders
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Delete Completed */}
                <button
                  className={`
                flex flex-col items-center justify-center
                h-14 w-14 rounded-2xl border shadow-sm
                text-[10px] font-semibold gap-1
                transition active:scale-[0.95]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 text-white/70 hover:bg-rose-500/20 hover:text-rose-200"
                    : "bg-white border-black/10 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                }
              `}
                >
                  <MdOutlineClearAll className="text-sm" />
                  Delete All
                </button>
                {/* Clear Grouping */}
                <button
                  onClick={() => updateGroup(false, null)}
                  className={`
                    flex flex-col items-center justify-center
                    h-14 w-14 rounded-2xl border shadow-sm
                    text-[10px] font-semibold gap-1
                    transition-colors active:scale-[0.95]
                    ${
                      grouping.incomplete === null
                        ? preferences.darkMode
                          ? "bg-orange-500/20 border-orange-400/30 text-orange-200"
                          : "bg-orange-50 border-orange-200 text-orange-600"
                        : preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70 hover:bg-orange-500/20 hover:text-orange-200"
                          : "bg-white border-black/10 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }
                  `}
                >
                  <FaTrashAlt className="text-sm" />
                  Clear
                </button>

                {/* Group by Day */}
                <button
                  onClick={() => updateGroup(false, "day")}
                  className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.incomplete === "day"
      ? preferences.darkMode
        ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-200"
        : "bg-cyan-50 border-cyan-200 text-cyan-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-cyan-500/20 hover:text-cyan-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600"
  }
`}
                >
                  <BsCalendarDay className="text-sm" />
                  Day
                </button>

                {/* Group by Week */}
                <button
                  onClick={() => updateGroup(false, "week")}
                  className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.incomplete === "week"
      ? preferences.darkMode
        ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-200"
        : "bg-indigo-50 border-indigo-200 text-indigo-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-indigo-500/20 hover:text-indigo-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
  }
`}
                >
                  <BsCalendarWeek className="text-sm" />
                  Week
                </button>

                {/* Group by Month */}
                <button
                  onClick={() => updateGroup(false, "month")}
                  className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.incomplete === "month"
      ? preferences.darkMode
        ? "bg-amber-500/20 border-amber-400/30 text-amber-200"
        : "bg-amber-50 border-amber-200 text-amber-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-amber-500/20 hover:text-amber-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-amber-50 hover:text-amber-600"
  }
`}
                >
                  <BsCalendarMonth className="text-sm" />
                  Month
                </button>
              </div>
            </div>
            <GroupedReminders
              groupType={grouping.incomplete}
              reminders={incompleteReminders}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-y-5 justify-between items-start gap-3 mb-3 mt-40">
          <div className="flex gap-x-5 items-center">
            <div
              className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100" : "bg-cyan-50 border-cyan-200 text-cyan-700"}
                `}
            >
              <BiCheckCircle className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Completed Reminders
              </h2>
              <p
                className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
              >
                Here are your complete reminders
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Delete Completed */}
            <button
              className={`
                flex flex-col items-center justify-center
                h-14 w-14 rounded-2xl border shadow-sm
                text-[10px] font-semibold gap-1
                transition active:scale-[0.95]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 text-white/70 hover:bg-rose-500/20 hover:text-rose-200"
                    : "bg-white border-black/10 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                }
              `}
            >
              <MdOutlineClearAll className="text-sm" />
              Delete All
            </button>
            {/* Clear Grouping */}
            <button
              onClick={() => updateGroup(true, null)}
              className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.complete === null
      ? preferences.darkMode
        ? "bg-orange-500/20 border-orange-400/30 text-orange-200"
        : "bg-orange-50 border-orange-200 text-orange-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-orange-500/20 hover:text-orange-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
  }
`}
            >
              <FaTrashAlt className="text-sm" />
              Clear
            </button>

            {/* Group by Day */}
            <button
              onClick={() => updateGroup(true, "day")}
              className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.complete === "day"
      ? preferences.darkMode
        ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-200"
        : "bg-cyan-50 border-cyan-200 text-cyan-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-cyan-500/20 hover:text-cyan-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600"
  }
`}
            >
              <BsCalendarDay className="text-sm" />
              Day
            </button>

            {/* Group by Week */}
            <button
              onClick={() => updateGroup(true, "week")}
              className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.complete === "week"
      ? preferences.darkMode
        ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-200"
        : "bg-indigo-50 border-indigo-200 text-indigo-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-indigo-500/20 hover:text-indigo-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
  }
`}
            >
              <BsCalendarWeek className="text-sm" />
              Week
            </button>

            {/* Group by Month */}
            <button
              onClick={() => updateGroup(true, "month")}
              className={`
  flex flex-col items-center justify-center
  h-14 w-14 rounded-2xl border shadow-sm
  text-[10px] font-semibold gap-1
  transition-colors active:scale-[0.95]
  ${
    grouping.complete === "month"
      ? preferences.darkMode
        ? "bg-amber-500/20 border-amber-400/30 text-amber-200"
        : "bg-amber-50 border-amber-200 text-amber-600"
      : preferences.darkMode
        ? "bg-white/5 border-white/10 text-white/70 hover:bg-amber-500/20 hover:text-amber-200"
        : "bg-white border-black/10 text-slate-600 hover:bg-amber-50 hover:text-amber-600"
  }
`}
            >
              <BsCalendarMonth className="text-sm" />
              Month
            </button>
          </div>
        </div>
        <GroupedReminders
          groupType={grouping.complete}
          reminders={completedRemindersToRender}
        />
      </div>
    </motion.div>
  );
};

export default Reminders;
