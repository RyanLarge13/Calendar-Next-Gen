import React, { useContext, useState, useEffect } from "react";
import { deleteNotification, markAsRead, markAsUnread } from "../utils/api";
import { formatTime, formatDbText } from "../utils/helpers";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosAlarm } from "react-icons/io";
import { MdEventAvailable, MdSystemSecurityUpdateGood } from "react-icons/md";
import { RxDragHandleHorizontal } from "react-icons/rx";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Notification = ({ idsToUpdate, setIdsToUpdate }) => {
  const { notifications, setNotifications, setSystemNotif, preferences } =
    useContext(UserContext);
  const { showNotifs, setShowNotifs } = useContext(InteractiveContext);

  const [notifOpen, setNotifOpen] = useState("");

  const controls = useDragControls();

  useEffect(() => {
    const hasUnread = notifications.some((notif) => !notif.read);
    if (!hasUnread) return;
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        command: "close-notifications",
      });
    }
  }, [notifications]);

  const openNotif = (id, read) => {
    setNotifOpen((prev) => (prev === id ? "" : id));
    if (read) return;
    if (!read) readNotif(id);
  };

  const readNotif = (id) => {
    if (!idsToUpdate.includes(id)) {
      setIdsToUpdate((prev) => [...prev, id]);
    }
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif,
    );
    const sortedNotifications = updatedNotifications.sort(
      (a, b) => b.time - a.time,
    );
    setNotifications(sortedNotifications);
  };

  const unReadNotif = (id) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: false } : notif,
    );
    setNotifications(updatedNotifications);
    markAsUnread(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getIcon = (type) => {
    if (type === "reminder") return <IoIosAlarm />;
    if (type === "event") return <MdEventAvailable />;
    if (type === "appointment") return;
    if (type === "task") return;
    if (type === "board") return;
    if (type === "list") return;
    if (type === "complete") return;
    if (type === "begin") return;
    if (type === "end") return;
    if (type === "map") return;
    if (type === "memory") return;
  };

  const initiateDeletion = (notifId) => {
    const newConfirmation = {
      show: true,
      title: "Delete Notification",
      text: "Are you sure you want to delete this notification?",
      color: "bg-red-200",
      hasCancel: true,
      actions: [
        { text: "close", func: () => setSystemNotif({ show: false }) },
        {
          text: "delete",
          func: () => {
            deleteNotif(notifId);
            setSystemNotif({ show: false });
          },
        },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteNotif = (notifId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const newNotifs = notifications.filter((item) => item.id !== notifId);
    setNotifications(newNotifs);
    deleteNotification(token, notifId)
      .then((res) => {
        console.log(`Notification deleted: ${res.data}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkToClose = (e, info) => {
    const distance = Math.abs(info.offset.y);
    const cancelThreshold = 150;
    if (info.offset.y < 0 && distance > cancelThreshold) {
      setShowNotifs(false);
    }
  };

  const startDrag = (e) => {
    controls.start(e);
  };

  return (
    <AnimatePresence>
      {showNotifs && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          drag="y"
          dragSnapToOrigin={true}
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ bottom: 0 }}
          onDragEnd={checkToClose}
          className={`
        fixed inset-0 z-20
        overflow-y-auto will-change-transform
        ${
          preferences.darkMode
            ? "bg-[#0f0f10]/70 text-white"
            : "bg-black/20 text-slate-900"
        }
      `}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setShowNotifs(false)}
          />

          {/* Panel */}
          <div
            className={`
          relative ml-auto h-full w-full
          lg:w-[520px] lg:max-w-[520px]
          ${preferences.darkMode ? "bg-[#161616]/90" : "bg-white/90"}
          backdrop-blur-md
          border-l
          ${preferences.darkMode ? "border-white/10" : "border-black/10"}
          shadow-2xl
        `}
          >
            {/* Sticky Header */}
            <div
              className={`
            sticky top-0 z-[30]
            px-5 pt-5 pb-4
            border-b
            ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            ${preferences.darkMode ? "bg-[#161616]/85" : "bg-white/70"}
            backdrop-blur-md
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-xs font-semibold tracking-wide ${
                      preferences.darkMode ? "text-white/60" : "text-slate-500"
                    }`}
                  >
                    Notifications
                  </p>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Inbox
                  </h2>

                  {/* Optional count chip (no logic required; wire later) */}
                  <div className="mt-2">
                    <span
                      className={`
                    inline-flex items-center gap-2
                    text-[11px] font-semibold px-3 py-1.5 rounded-2xl border
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 text-slate-600"
                    }
                  `}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                      {/* Replace later with unread count */}
                      Manage your updates
                    </span>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setShowNotifs(false)}
                  className={`
                grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition active:scale-95
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                }
              `}
                  aria-label="Close notifications"
                  type="button"
                >
                  <AiFillCloseCircle className="text-lg" />
                </button>
              </div>

              {/* Global Actions (no logic, just buttons) */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className={`
                px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/75"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
                }
              `}
                >
                  <span className="text-sm">✓</span> Mark all read
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className={`
                px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/75"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
                }
              `}
                >
                  <span className="text-sm">↺</span> Mark all unread
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className={`
                px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                ${
                  preferences.darkMode
                    ? "bg-rose-500/15 border-rose-300/20 hover:bg-rose-500/20 text-rose-100"
                    : "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700"
                }
              `}
                >
                  <span className="text-sm">🗑</span> Delete all
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className={`
                px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
                text-white
              `}
                >
                  <span className="text-sm">⤴</span> Share
                </button>

                {/* Optional extra */}
                <button
                  type="button"
                  onClick={() => {}}
                  className={`
                col-span-2 px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
                }
              `}
                >
                  <span className="text-sm">⚙</span> Notification settings
                </button>
              </div>
            </div>

            {/* Filters */}
            <div
              className={`
    mt-4 -mx-1 px-1
    flex gap-2 overflow-x-auto scrollbar-hide
  `}
            >
              {[
                { label: "All", accent: "cyan" },
                { label: "Unread", accent: "rose" },
                { label: "Events", accent: "indigo" },
                { label: "Reminders", accent: "amber" },
                { label: "System", accent: "emerald" },
              ].map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => {}}
                  className={`
        flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold
        border shadow-sm transition active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/75"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
        }
      `}
                >
                  <span
                    className={`
          inline-flex items-center gap-2
        `}
                  >
                    <span
                      className={`
            h-2 w-2 rounded-full
            ${
              filter.accent === "cyan"
                ? "bg-cyan-400"
                : filter.accent === "rose"
                  ? "bg-rose-400"
                  : filter.accent === "indigo"
                    ? "bg-indigo-400"
                    : filter.accent === "amber"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
            }
          `}
                    />
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="px-5 pt-4 pb-28">
              {notifications.length < 1 ? (
                <div className="min-h-[50vh] grid place-items-center">
                  <div
                    className={`
                  w-full max-w-sm rounded-3xl border shadow-2xl backdrop-blur-md p-6 text-center
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white/80 border-black/10"
                  }
                `}
                  >
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-lg font-semibold"
                    >
                      All Caught Up!
                    </motion.p>
                    <p
                      className={`text-sm mt-2 ${
                        preferences.darkMode
                          ? "text-white/60"
                          : "text-slate-500"
                      }`}
                    >
                      Nothing new right now.
                    </p>
                    <MdSystemSecurityUpdateGood className="text-3xl mt-5 opacity-80 mx-auto" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      animate={
                        notifOpen === notif.id
                          ? { height: 240 }
                          : { height: 132 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      onClick={() => openNotif(notif.id, notif.read)}
                      className={`
                    relative rounded-3xl border shadow-sm overflow-hidden cursor-pointer
                    transition hover:shadow-md
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-black/10"
                    }
                  `}
                    >
                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="absolute top-4 left-4 h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-rose-400 to-red-400 shadow-sm" />
                      )}

                      <div className="px-5 py-4 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <p
                                className={`text-[11px] font-semibold ${
                                  preferences.darkMode
                                    ? "text-white/60"
                                    : "text-slate-500"
                                }`}
                              >
                                {new Date(notif.time).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}{" "}
                                • {formatTime(new Date(notif.time))}
                              </p>

                              <p className="text-sm font-semibold mt-2 truncate">
                                {notif.notifData.title}
                              </p>
                            </div>

                            <div
                              className={`
                            grid place-items-center h-10 w-10 rounded-2xl border shadow-sm flex-shrink-0
                            ${
                              preferences.darkMode
                                ? "bg-white/5 border-white/10 text-white/70"
                                : "bg-black/[0.03] border-black/10 text-slate-600"
                            }
                          `}
                            >
                              {getIcon(notif.type)}
                            </div>
                          </div>

                          {notifOpen === notif.id && (
                            <div
                              className={`
                            mt-3 p-4 rounded-2xl border shadow-inner max-h-[120px] overflow-y-auto scrollbar-slick
                            ${
                              preferences.darkMode
                                ? "bg-white/5 border-white/10 text-white/75"
                                : "bg-black/[0.03] border-black/10 text-slate-700"
                            }
                          `}
                            >
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: 1,
                                  transition: { delay: 0.12 },
                                }}
                                className="text-xs leading-relaxed"
                              >
                                {notif.notifData.notes
                                  .split(/\|\|\||\n/)
                                  .map((line, index) => (
                                    <React.Fragment key={index}>
                                      {line}
                                      <br />
                                    </React.Fragment>
                                  ))}
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Per-notif actions */}
                        <div className="mt-4 flex justify-between items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              notif.read
                                ? unReadNotif(notif.id)
                                : readNotif(notif.id);
                            }}
                            className={`
                          px-3 py-2 rounded-2xl text-[11px] font-semibold border shadow-sm transition active:scale-[0.97]
                          ${
                            preferences.darkMode
                              ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/75"
                              : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
                          }
                        `}
                          >
                            {notif.read ? "Mark unread" : "Mark read"}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              initiateDeletion(notif.id);
                            }}
                            className={`
                          px-3 py-2 rounded-2xl text-[11px] font-semibold border shadow-sm transition active:scale-[0.97]
                          ${
                            preferences.darkMode
                              ? "bg-rose-500/15 border-rose-300/20 hover:bg-rose-500/20 text-rose-100"
                              : "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700"
                          }
                        `}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom handle bar */}
            <div
              className={`
            sticky bottom-0 z-[40]
            px-5 py-4
            border-t
            ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            ${
              preferences.darkMode
                ? "bg-[#161616]/85 text-white"
                : "bg-white/70 text-slate-900"
            }
            backdrop-blur-md
            flex justify-between items-center
            pointer-events-auto
          `}
              style={{ touchAction: "none" }}
              onPointerDown={startDrag}
            >
              <button
                onClick={() => setShowNotifs(false)}
                className={`
              px-4 py-2 rounded-2xl text-sm font-semibold border shadow-sm transition active:scale-[0.97]
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
              }
            `}
                type="button"
              >
                Close
              </button>

              <div
                className={`
              grid place-items-center h-10 w-16 rounded-2xl border shadow-sm
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/60"
                  : "bg-black/[0.03] border-black/10 text-slate-500"
              }
            `}
              >
                <RxDragHandleHorizontal className="text-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
