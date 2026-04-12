import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Portal from "../Misc/Portal";
import UserContext from "../../context/UserContext";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  API_SnoozeNotification,
  markAsRead,
  updateReminderComplete,
  updateReminderSnoozeCount,
} from "../../utils/api";
import { getAuthToken } from "../../utils/helpers";

const ReminderNotification = ({ notification, remindersVibrated }) => {
  const {
    preferences,
    setReminderNotifications,
    setReminders,
    reminders,
    setNotifications,
  } = useContext(UserContext);

  const [snoozeMinutes, setSnoozeMinutes] = useState(10);

  useEffect(() => {
    if ("vibrate" in navigator) {
      if (remindersVibrated.current.length < 1) {
        navigator.vibrate([100, 50, 300]);
        remindersVibrated.current.push(notification.id);
        return;
      }
      if (!remindersVibrated.current.includes(notification.id)) {
        navigator.vibrate([100, 50, 300]);
        remindersVibrated.current.push(notification.id);
      }
    }
  }, []);

  const dismissReminder = async () => {
    setReminderNotifications((prev) =>
      prev.filter((r) => r.id !== notification.id),
    );

    try {
      // Update reminder association
      if (notification.reminderRefId) {
        await updateReminderComplete({
          reminderId: notification.reminderRefId,
          completed: true,
        });
        setReminders((prev) => {
          const newReminders = prev.map((r) => {
            if (r.id === notification.reminderRefId) {
              return { ...r, completed: true };
            }
            return r;
          });

          return newReminders;
        });
      }

      // Update actual notification
      await markAsRead(notification.id);
      setNotifications((prev) => {
        const newNotifs = prev.map((notif) => {
          if (notif.id === notification.id) {
            return {
              ...notif,
              read: true,
              readTime: new Date(),
            };
          }
          return notif;
        });

        return newNotifs;
      });
    } catch (err) {
      console.log("Error updating reminder to complete with server request");
      console.log(err);
    }
  };

  const snoozeNotification = async () => {
    setReminderNotifications((prev) =>
      prev.filter((r) => r.id !== notification.id),
    );

    try {
      const token = getAuthToken();

      // Update notification to notify again later
      // const nDate = new Date(notification.time);
      const nDate = new Date();
      nDate.setMinutes(nDate.getMinutes() + snoozeMinutes);

      await API_SnoozeNotification(notification.id, nDate.toString(), token);
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notification.id),
      );

      // Update snoozing information on reminder association
      if (notification.reminderRefId) {
        const reminder = reminders.find(
          (r) => r.id === notification.reminderRefId,
        );

        if (reminder && reminder.snoozes) {
          const newSnooze = {
            when: new Date(),
            howMuchTime: snoozeMinutes,
          };
          const newSnoozes = {
            count: reminder.snoozes.count + 1,
            snoozes: [...reminder.snoozes.snoozes, newSnooze],
          };

          await updateReminderSnoozeCount(
            notification.reminderRefId,
            newSnoozes,
            token,
          );
          setReminders((prev) =>
            prev.map((r) => {
              if (r.id === notification.reminderRefId) {
                return { ...r, snoozes: newSnoozes };
              }
              return r;
            }),
          );
        }
      }
    } catch (err) {
      console.log("Error updating reminders or notifications on the server");
      console.log(err);
    }
  };

  return (
    <Portal
      key={
        notification.id || notification.time || notification.notifData?.title
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`
              fixed inset-0 z-[999]
              ${preferences.darkMode ? "bg-[#0a1216]" : "bg-cyan-50"}
            `}
      >
        <div className="relative h-full min-h-screen overflow-y-auto">
          {/* soft color wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-cyan-400/10 to-transparent" />

          {/* radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(34,211,238,0.18),transparent_35%)]" />

          {/* content shell */}
          <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
            {/* Centered content */}
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-2xl text-center">
                <div
                  className={`
                        mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border shadow-sm
                        ${
                          preferences.darkMode
                            ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                            : "bg-cyan-50 border-cyan-200 text-cyan-700"
                        }
                      `}
                >
                  <span className="text-2xl">⏰</span>
                </div>

                <p
                  className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Reminder Alert
                </p>

                <h2
                  className={`mx-auto max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${
                    preferences.darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {notification.notifData.title}
                </h2>

                {notification.notifData.notes ? (
                  <div
                    className={`
                          mx-auto mt-6 max-w-xl rounded-3xl border px-5 py-4 shadow-sm backdrop-blur-md
                          ${
                            preferences.darkMode
                              ? "bg-white/5 border-white/10 text-white/75"
                              : "bg-white/70 border-black/10 text-slate-700"
                          }
                        `}
                  >
                    <p className="text-sm leading-7 sm:text-base">
                      {notification.notifData.notes}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Bottom action area */}
            <div className="sticky bottom-0 pt-6">
              <div
                className={`
                      mx-auto w-full max-w-3xl rounded-[28px] border p-4 shadow-2xl backdrop-blur-md
                      ${
                        preferences.darkMode
                          ? "bg-[#161616]/75 border-white/10"
                          : "bg-white/80 border-black/10"
                      }
                    `}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.4fr]">
                  {/* Dismiss */}
                  <button
                    onClick={() => dismissReminder()}
                    type="button"
                    className={`
                          flex h-16 items-center justify-center rounded-3xl border text-sm font-semibold shadow-sm transition
                          active:scale-[0.98]
                          ${
                            preferences.darkMode
                              ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                              : "bg-black/[0.03] border-black/10 text-slate-800 hover:bg-black/[0.05]"
                          }
                        `}
                  >
                    Dismiss
                  </button>

                  {/* Snooze controls */}
                  <div
                    className={`
                          flex h-16 items-center rounded-3xl border shadow-sm overflow-hidden
                          ${
                            preferences.darkMode
                              ? "bg-cyan-500/15 border-cyan-300/20"
                              : "bg-cyan-50 border-cyan-200"
                          }
                        `}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSnoozeMinutes((prev) => Math.max(1, prev - 1))
                      }
                      className={`
                            grid h-full w-14 place-items-center border-r transition
                            active:scale-[0.97]
                            ${
                              preferences.darkMode
                                ? "border-white/10 text-cyan-100 hover:bg-white/10"
                                : "border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                            }
                          `}
                      aria-label="Decrease snooze time"
                    >
                      <FaMinus className="text-sm" />
                    </button>

                    <button
                      onClick={() => snoozeNotification()}
                      type="button"
                      className={`
                            flex h-full flex-1 items-center justify-center gap-3 px-4 text-sm font-semibold transition
                            ${
                              preferences.darkMode
                                ? "text-cyan-100 hover:bg-white/5"
                                : "text-cyan-800 hover:bg-cyan-100/60"
                            }
                          `}
                    >
                      <span>Snooze</span>
                      <span
                        className={`
                              rounded-2xl border px-3 py-1 text-xs font-bold shadow-sm
                              ${
                                preferences.darkMode
                                  ? "bg-white/10 border-white/10 text-white"
                                  : "bg-white border-cyan-200 text-cyan-800"
                              }
                            `}
                      >
                        {snoozeMinutes} min
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSnoozeMinutes((prev) => prev + 1)}
                      className={`
                            grid h-full w-14 place-items-center border-l transition
                            active:scale-[0.97]
                            ${
                              preferences.darkMode
                                ? "border-white/10 text-cyan-100 hover:bg-white/10"
                                : "border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                            }
                          `}
                      aria-label="Increase snooze time"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                <p
                  className={`mt-3 text-center text-[11px] font-semibold ${
                    preferences.darkMode ? "text-white/45" : "text-slate-500"
                  }`}
                >
                  Adjust the snooze duration, or dismiss this reminder now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Portal>
  );
};

export default ReminderNotification;
