import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { getDueStatus } from "../../../utils/helpers";
import Portal from "../../Misc/Portal";
import Reminder from "../Reminder";
import EventCard from "../../Events/EventCard";
import FollowUpReminder from "./FollowUpReminder";
import Snoozes from "./Snoozes";
import QuickPanel from "./QuickPanel";
import ChangeDateAndTime from "./ChangeDateAndTime";
import QuickPanelTop from "./QuickPanelTop";
import ReminderDeviceSubscriptions from "./ReminderDeviceSubscriptions";

const ReminderView = ({ reminder, setShowFullReminder }) => {
  const { preferences, eventMap } = useContext(UserContext);

  const [associatedEvent, setAssociatedEvent] = useState(null);

  const reminderStatus = getDueStatus(new Date(reminder.time));

  useEffect(() => {
    if (reminder.eventRefId) {
      const time = new Date(reminder.time);
      const key = `${time.getFullYear()}-${time.getMonth()}`;
      const eventsToSearch = eventMap.get(key)?.events || [];

      if (eventsToSearch.length > 0) {
        const foundEvent = eventsToSearch.find(
          (e) => e.id === reminder.eventRefId,
        );

        if (foundEvent) {
          setAssociatedEvent(foundEvent);
        }
      }
    }
  }, []);

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`
      fixed inset-0 z-[999]
      ${
        reminder.completed
          ? preferences.darkMode
            ? "bg-[#0b1210]"
            : "bg-lime-50"
          : reminderStatus === "past"
            ? preferences.darkMode
              ? "bg-[#160d10]"
              : "bg-rose-50"
            : reminderStatus === "today"
              ? preferences.darkMode
                ? "bg-[#17120a]"
                : "bg-amber-50"
              : preferences.darkMode
                ? "bg-[#0a1216]"
                : "bg-cyan-50"
      }
    `}
      >
        <div className="h-full min-h-full max-h-full overflow-y-auto">
          {/* soft color wash */}
          <div
            className={`
        pointer-events-none absolute inset-0
        ${
          reminder.completed
            ? "bg-gradient-to-br from-lime-500/15 via-emerald-400/10 to-transparent"
            : reminderStatus === "past"
              ? "bg-gradient-to-br from-rose-500/15 via-pink-400/10 to-transparent"
              : reminderStatus === "today"
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
            : reminderStatus === "past"
              ? "bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.16),transparent_35%)]"
              : reminderStatus === "today"
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
          sticky top-3 z-20 mb-4
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

                <div className="flex justify-start items-center gap-x-2">
                  <div
                    className={`
              px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                reminder.completed
                  ? preferences.darkMode
                    ? "bg-lime-500/15 border-lime-300/20 text-lime-100"
                    : "bg-lime-50 border-lime-200 text-lime-700"
                  : reminderStatus === "past"
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
                      : reminderStatus === "past"
                        ? "Overdue"
                        : new Date(reminder.time).toLocaleDateString() ===
                            new Date().toLocaleDateString()
                          ? "Today"
                          : "Upcoming"}
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setShowFullReminder(false)}
                    className={`
              px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }
            `}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <QuickPanelTop reminder={reminder} />

            {/* main layout */}
            <ChangeDateAndTime reminder={reminder} />

            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4 items-start">
              {/* left content */}

              {/* Parent Reminder instance */}
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
                  <QuickPanel reminder={reminder} />
                </div>
                <FollowUpReminder
                  originalTitle={reminder.title}
                  originalDesc={reminder.notes}
                  reminderTime={new Date(reminder.time)}
                />

                {/* Repeating Reminders */}
                {reminder.repeat?.repeats ? (
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
                          preferences.darkMode
                            ? "text-white/50"
                            : "text-slate-500"
                        }`}
                      >
                        Repeating Reminders
                      </p>
                      {/* Show event here maybe <EventCard /> */}
                    </div>
                  </div>
                ) : null}
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
                          preferences.darkMode
                            ? "text-white/50"
                            : "text-slate-500"
                        }`}
                      >
                        Event Association
                      </p>
                      {associatedEvent ? (
                        <EventCard event={associatedEvent} />
                      ) : null}
                    </div>
                  </div>
                ) : null}
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
                  <h3
                    className={`text-base font-semibold mt-1 ${
                      preferences.darkMode ? "text-white/80" : "text-slate-600"
                    }`}
                  >
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

                  <Snoozes reminder={reminder} />
                </div>

                <ReminderDeviceSubscriptions reminder={reminder} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Portal>
  );
};

export default ReminderView;
