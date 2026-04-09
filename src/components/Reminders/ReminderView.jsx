import { motion } from "framer-motion";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { MdOutlineUpdate, MdSnooze } from "react-icons/md";
import { isSameCalendarDay } from "../../utils/helpers";
import Portal from "../Misc/Portal";
import Reminder from "./Reminder";
import DayEvent from "../Events/DayEvent";

const ReminderView = ({ reminder }) => {
  const { preferences } = useContext(UserContext);

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`
      fixed inset-0 z-[999] overflow-y-auto
      ${
        reminder.completed
          ? preferences.darkMode
            ? "bg-[#0b1210]"
            : "bg-lime-50/80"
          : new Date(reminder.time) < new Date()
            ? preferences.darkMode
              ? "bg-[#160d10]"
              : "bg-rose-50/80"
            : new Date(reminder.time).toLocaleDateString() ===
                new Date().toLocaleDateString()
              ? preferences.darkMode
                ? "bg-[#17120a]"
                : "bg-amber-50/80"
              : preferences.darkMode
                ? "bg-[#0a1216]"
                : "bg-cyan-50/80"
      }
    `}
      >
        {/* soft color wash */}
        <div
          className={`
        pointer-events-none absolute inset-0
        ${
          reminder.completed
            ? "bg-gradient-to-br from-lime-500/15 via-emerald-400/10 to-transparent"
            : new Date(reminder.time) < new Date()
              ? "bg-gradient-to-br from-rose-500/15 via-pink-400/10 to-transparent"
              : new Date(reminder.time).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                ? "bg-gradient-to-br from-amber-500/15 via-orange-400/10 to-transparent"
                : "bg-gradient-to-br from-cyan-500/15 via-sky-400/10 to-transparent"
        }
      `}
        />

        {/* radial glow */}
        <div
          className={`
        pointer-events-none absolute inset-0
        ${
          reminder.completed
            ? "bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.16),transparent_35%)]"
            : new Date(reminder.time) < new Date()
              ? "bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.16),transparent_35%)]"
              : new Date(reminder.time).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                ? "bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_35%)]"
                : "bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%)]"
        }
      `}
        />

        {/* content shell */}
        <div className="relative mx-auto max-w-6xl min-h-screen px-3 sm:px-6 lg:px-8 py-6">
          {/* top bar */}
          <div
            className={`
          sticky top-0 z-20 mb-4
          rounded-3xl border shadow-sm px-5 py-4
          backdrop-blur-md
          ${
            preferences.darkMode
              ? "bg-[#161616]/70 border-white/10 text-white"
              : "bg-white/70 border-black/10 text-slate-900"
          }
        `}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className={`text-[11px] font-semibold ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Reminder Details
                </p>
                <h2 className="text-lg font-semibold tracking-tight">
                  Full Reminder View
                </h2>
              </div>

              <div
                className={`
              px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                reminder.completed
                  ? preferences.darkMode
                    ? "bg-lime-500/15 border-lime-300/20 text-lime-100"
                    : "bg-lime-50 border-lime-200 text-lime-700"
                  : new Date(reminder.time) < new Date()
                    ? preferences.darkMode
                      ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                    : new Date(reminder.time).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                      ? preferences.darkMode
                        ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                      : preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700"
              }
            `}
              >
                {reminder.completed
                  ? "Completed"
                  : new Date(reminder.time) < new Date()
                    ? "Overdue"
                    : new Date(reminder.time).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                      ? "Today"
                      : "Upcoming"}
              </div>
            </div>
          </div>

          {/* main layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4 items-start">
            {/* left content */}
            <div className="space-y-4">
              <div
                className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
              >
                <Reminder
                  reminder={reminder}
                  showOpenEvent={false}
                  styles={{}}
                  showFullViewButton={false}
                />
              </div>

              <div
                className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
              >
                {/* your quick actions section goes here */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
                  {!isSameCalendarDay(new Date(reminder.time), new Date()) ? (
                    <button
                      type="button"
                      className={`
                  group rounded-2xl border shadow-sm px-3 py-3
                  flex flex-col items-center justify-center gap-2
                  transition active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                  }
                `}
                    >
                      <div
                        className={`
                    grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                    ${
                      preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 group-hover:bg-cyan-500/20"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700 group-hover:bg-cyan-100"
                    }
                  `}
                      >
                        <MdOutlineUpdate className="text-lg" />
                      </div>
                      <p className="text-[11px] font-semibold text-center leading-tight">
                        Reset Today
                      </p>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
                  >
                    <div
                      className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-orange-500/15 border-orange-300/20 text-orange-100 group-hover:bg-orange-500/20"
                      : "bg-orange-50 border-orange-200 text-orange-700 group-hover:bg-orange-100"
                  }
                `}
                    >
                      <MdSnooze className="text-lg" />
                    </div>
                    <p className="text-[11px] font-semibold text-center leading-tight">
                      Snooze 5
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
                  >
                    <div
                      className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100 group-hover:bg-indigo-500/20"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700 group-hover:bg-indigo-100"
                  }
                `}
                    >
                      <MdSnooze className="text-lg" />
                    </div>
                    <p className="text-[11px] font-semibold text-center leading-tight">
                      Snooze 10
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
                  >
                    <div
                      className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-amber-500/15 border-amber-300/20 text-amber-100 group-hover:bg-amber-500/20"
                      : "bg-amber-50 border-amber-200 text-amber-700 group-hover:bg-amber-100"
                  }
                `}
                    >
                      <MdSnooze className="text-lg" />
                    </div>
                    <p className="text-[11px] font-semibold text-center leading-tight">
                      Snooze 15
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
                  >
                    <div
                      className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100 group-hover:bg-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 group-hover:bg-emerald-100"
                  }
                `}
                    >
                      <MdSnooze className="text-lg" />
                    </div>
                    <p className="text-[11px] font-semibold text-center leading-tight">
                      Snooze 30
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* right insights / future sections */}
            <div className="space-y-4">
              <div
                className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Reminder Impact
                </p>
                <h3 className="text-base font-semibold mt-1">
                  More context coming here
                </h3>
                <p
                  className={`text-sm mt-2 ${
                    preferences.darkMode ? "text-white/65" : "text-slate-600"
                  }`}
                >
                  This area can show streaks, completion rate, snooze history,
                  overdue frequency, related events, and how this reminder
                  affects your schedule.
                </p>
              </div>
            </div>

            {/* Event if any */}
            {reminder.eventRefId ? (
              <div className="space-y-4">
                <div
                  className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
                >
                  <p
                    className={`text-[11px] font-semibold ${
                      preferences.darkMode ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    Event Association
                  </p>
                  {/* Show event here maybe <EventCard /> */}
                </div>
              </div>
            ) : null}

            {/* Repeating Reminders */}
            <div className="space-y-4">
              <div
                className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Repeating Reminders
                </p>
                {/* Show event here maybe <EventCard /> */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Portal>
  );
};

export default ReminderView;
