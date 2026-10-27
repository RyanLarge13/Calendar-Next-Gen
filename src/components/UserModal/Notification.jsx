import { AnimatePresence, motion, useDragControls } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosAlarm } from "react-icons/io";
import { MdEventAvailable, MdSystemSecurityUpdateGood } from "react-icons/md";
import { RxDragHandleHorizontal } from "react-icons/rx";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { deleteNotification, markAsUnread, markAsRead } from "../../utils/api";
import { formatRelativeTime } from "../../utils/helpers";
// import mockNotifications from "../../constants/mockNotifications";

const Notification = ({ idsToUpdate, setIdsToUpdate }) => {
  // const { setNotifications, setSystemNotif, preferences } =
  //   useContext(UserContext);
  const { notifications, setNotifications, setSystemNotif, preferences } =
    useContext(UserContext);
  const { showNotifs, setShowNotifs } = useContext(InteractiveContext);

  const [notifOpen, setNotifOpen] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [bulkBusy, setBulkBusy] = useState(false);
  const visibleNotifications = [...notifications].filter((notif) => {
    if (filter === "Unread") return !notif.read;
    if (filter === "Events") return notif.type === "event";
    if (filter === "Reminders") return notif.type === "reminder";
    if (filter === "System") return !["event", "reminder"].includes(notif.type);
    return true;
  }).sort((a, b) => sort === "oldest" ? new Date(a.time) - new Date(b.time) : sort === "unread" ? Number(a.read) - Number(b.read) || new Date(b.time) - new Date(a.time) : new Date(b.time) - new Date(a.time));

  const bulkRead = async (read) => {
    if (bulkBusy) return;
    const changed = notifications.filter((notif) => notif.read !== read);
    if (!changed.length) return;
    setBulkBusy(true);
    try {
      const results = await Promise.allSettled(changed.map((notif) => read ? markAsRead(notif.id) : markAsUnread(notif.id)));
      const successful = new Set(changed.filter((_, i) => results[i].status === "fulfilled").map((notif) => notif.id));
      setNotifications((prev) => prev.map((notif) => successful.has(notif.id) ? { ...notif, read } : notif));
      if (!read) setIdsToUpdate((prev) => prev.filter((id) => !successful.has(id)));
      if (results.some((result) => result.status === "rejected")) console.error("Some notification updates failed");
    } finally { setBulkBusy(false); }
  };

  const bulkDelete = () => {
    if (bulkBusy || !notifications.length) return;
    setSystemNotif({ show: true, title: "Delete all notifications", text: `Permanently delete all ${notifications.length} notifications?`, color: "bg-red-200", hasCancel: true, actions: [
      { text: "cancel", func: () => setSystemNotif({ show: false }) },
      { text: "delete all", func: async () => {
        setSystemNotif({ show: false });
        const token = localStorage.getItem("authToken");
        if (!token) return;
        setBulkBusy(true);
        try {
          const snapshot = [...notifications];
          const results = await Promise.allSettled(snapshot.map((notif) => deleteNotification(token, notif.id)));
          const deleted = new Set(snapshot.filter((_, i) => results[i].status === "fulfilled").map((notif) => notif.id));
          setNotifications((prev) => prev.filter((notif) => !deleted.has(notif.id)));
          setIdsToUpdate((prev) => prev.filter((id) => !deleted.has(id)));
          if (results.some((result) => result.status === "rejected")) console.error("Some notification deletions failed");
        } finally { setBulkBusy(false); }
      } },
    ] });
  };

  const controls = useDragControls();

  // const notifications = mockNotifications;

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
       will-change-transform
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
          relative ml-auto h-full w-full flex flex-col min-h-0
          lg:w-[520px] lg:max-w-[520px]
          ${preferences.darkMode ? "bg-[#181818]" : "bg-white"}
          border-l
          ${preferences.darkMode ? "border-white/10" : "border-black/10"}
          shadow-2xl
        `}
          >
            {/* Sticky Header */}
            <div
              className={`
            relative z-[30] shrink-0
            px-3 sm:px-5 pt-3 sm:pt-5 pb-2 sm:pb-4
            border-b
            ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            ${preferences.darkMode ? "bg-[#181818]" : "bg-white"}
          `}
            >
              <div className="flex items-start justify-between gap-2">
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
                  <div className="mt-1 hidden sm:block">
                    <span
                      className={`
                    inline-flex items-center gap-2
                    text-[11px] font-semibold px-3 py-1.5 rounded-2xl border
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-amber-200/15 text-white/70"
                        : "bg-black/[0.03] border-black/10 text-slate-600"
                    }
                  `}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
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
              <div className="mt-2 sm:mt-4 grid grid-cols-3 sm:grid-cols-2 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => bulkRead(true)}
                  className={`
                px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-sm text-[10px] sm:text-xs font-semibold transition active:scale-[0.97]
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
                  onClick={() => bulkRead(false)}
                  className={`
                px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-sm text-[10px] sm:text-xs font-semibold transition active:scale-[0.97]
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
                  onClick={bulkDelete}
                  className={`
                px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-sm text-[10px] sm:text-xs font-semibold transition active:scale-[0.97]
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
                px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-sm text-[10px] sm:text-xs font-semibold transition active:scale-[0.97]
                flex items-center justify-center gap-2
                bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400
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
                col-span-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-sm text-[10px] sm:text-xs font-semibold transition active:scale-[0.97]
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

            <div className="px-3 sm:px-5 pt-2 flex items-center justify-between gap-2 shrink-0"><label htmlFor="notification-sort" className="text-xs font-semibold">Sort notifications</label><select id="notification-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border px-2 py-1 bg-transparent text-xs sm:text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="unread">Unread first</option></select></div>
            {/* Filters */}
            <div
              className={`
    py-2 sm:py-4 px-3 sm:px-5 shrink-0
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
                  onClick={() => setFilter(filter.label)}
                  aria-pressed={filter.label === filter}
                  className={`
        flex-shrink-0 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-semibold
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
                ? "bg-amber-400"
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
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-5 pt-2 sm:pt-4 pb-12" style={{ scrollbarGutter: "stable" }}>
              {visibleNotifications.length < 1 ? (
                <div className="min-h-[50vh] grid place-items-center">
                  <div
                    className={`
                  w-full max-w-sm rounded-3xl border shadow-2xl backdrop-blur-md p-6 text-center
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-amber-200/40"
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
                <div className="space-y-2 sm:space-y-4">
                  {visibleNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout="size"
                      transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
                      onClick={() => openNotif(notif.id, notif.read)}
                      className={`
                    relative rounded-xl sm:rounded-3xl border shadow-sm overflow-hidden cursor-pointer
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
                        <div className="absolute top-3 left-3 h-2 w-2 rounded-full bg-gradient-to-tr from-rose-400 to-red-400 shadow-sm" />
                      )}

                      <div className="px-3 sm:px-5 py-2.5 sm:py-4 flex flex-col gap-2 sm:gap-4">
                        <div>
                          <div className="flex justify-between items-start gap-2">
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
                                • {formatRelativeTime(new Date(notif.time))}
                              </p>

                              <p className="text-sm font-semibold mt-1 truncate pl-3 sm:pl-0">
                                {notif.notifData.title}
                              </p>
                            </div>

                            <div
                              className={`
                            grid place-items-center h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl border shadow-sm flex-shrink-0
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

                          <AnimatePresence initial={false}>
                          {notifOpen === notif.id && (
                            <motion.div
                              key="expanded-notification"
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.26, ease: "easeInOut" }}
                              className={`
                            p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-inner max-h-[120px] overflow-y-auto scrollbar-slick
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
                            </motion.div>
                          )}
                          </AnimatePresence>
                        </div>

                        {/* Per-notif actions */}
                        <div className="mt-1 sm:mt-4 flex justify-between items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              notif.read
                                ? unReadNotif(notif.id)
                                : readNotif(notif.id);
                            }}
                            className={`
                          px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] font-semibold border shadow-sm transition active:scale-[0.97]
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
                          px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] font-semibold border shadow-sm transition active:scale-[0.97]
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
            relative shrink-0 z-[40]
            px-3 sm:px-5 py-1.5 sm:py-4
            border-t
            ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            ${
              preferences.darkMode
                ? "bg-[#181818] text-white"
                : "bg-white text-slate-900"
            }
            flex justify-between items-center
            pointer-events-auto
          `}
              style={{ touchAction: "none" }}
              onPointerDown={startDrag}
            >
              <button
                onClick={() => setShowNotifs(false)}
                className={`
              px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold border shadow-sm transition active:scale-[0.97]
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
              grid place-items-center h-7 w-12 sm:h-10 sm:w-16 rounded-xl sm:rounded-2xl border shadow-sm
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
