import { useContext } from "react";
import UserContext from "../../../context/UserContext";

const NotificationSubscriptions = () => {
  const { preferences, notifSubs } = useContext(UserContext);

  const pauseNotificationsToDevice = async (info) => {};

  const cancelNotificationsToDevice = async (info) => {};

  return (
    <div className="mt-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            Notifications
          </p>
          <h3 className="text-lg font-semibold tracking-tight">Your Devices</h3>
        </div>

        <div
          className={`
        text-[11px] font-semibold px-3 py-1.5 rounded-2xl border shadow-sm
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 text-slate-600"
        }
      `}
        >
          {notifSubs.length} connected
        </div>
      </div>

      <div className="mt-3">
        {notifSubs.length < 1 ? (
          <div
            className={`
          rounded-3xl border shadow-sm p-5
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white border-black/10"
          }
        `}
          >
            <p
              className={`text-sm font-semibold ${
                preferences.darkMode ? "text-white/70" : "text-slate-700"
              }`}
            >
              No subscribed devices
            </p>
            <p
              className={`text-[11px] mt-1 font-semibold ${
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              No devices are currently subscribed to receive push notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifSubs.map((ns, index) => {
              const info = JSON.parse(ns);

              const created =
                info.createdAt &&
                new Date(info.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

              const lastSeen =
                info.lastSeenAt &&
                new Date(info.lastSeenAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

              const deviceBrowser = info;

              return (
                <div
                  key={info.id || index}
                  className={`
                rounded-3xl border shadow-sm overflow-hidden
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }
              `}
                >
                  {/* Header */}
                  <div
                    className={`
                  px-4 py-4 flex items-start justify-between gap-3 border-b
                  ${
                    preferences.darkMode ? "border-white/10" : "border-black/10"
                  }
                `}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {info.platform || "Unknown Platform"}
                      </p>
                      <p
                        className={`text-[11px] mt-1 font-semibold truncate ${
                          preferences.darkMode
                            ? "text-white/50"
                            : "text-slate-500"
                        }`}
                      >
                        {info.browser || "Unknown Browser"}
                      </p>
                    </div>

                    <div
                      className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      info.isStandalone
                        ? preferences.darkMode
                          ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                          : "bg-cyan-50 border-cyan-200 text-cyan-700"
                        : preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-black/10 text-slate-600"
                    }
                  `}
                    >
                      {info.isStandalone ? "App Installed" : "Not Installed"}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-4 space-y-3">
                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`
                      px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-black/10 text-slate-700"
                      }
                    `}
                      >
                        🌐 {info.language || "Unknown Language"}
                      </div>

                      <div
                        className={`
                      px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-black/10 text-slate-700"
                      }
                    `}
                      >
                        🕒 {info.timezone || "Unknown Timezone"}
                      </div>

                      <div
                        className={`
                      px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-black/10 text-slate-700"
                      }
                    `}
                      >
                        📱 {info.screen?.width || "?"}×
                        {info.screen?.height || "?"}
                      </div>

                      <div
                        className={`
                      px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-black/10 text-slate-700"
                      }
                    `}
                      >
                        App v{info.appVersion ?? "?"}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div
                      className={`
                    rounded-2xl border shadow-inner px-3 py-3
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-black/[0.03] border-black/10"
                    }
                    flex items-center justify-between gap-3
                  `}
                    >
                      <div>
                        <p
                          className={`text-[10px] font-semibold ${
                            preferences.darkMode
                              ? "text-white/45"
                              : "text-slate-500"
                          }`}
                        >
                          Created
                        </p>
                        <p className="text-xs font-semibold">
                          {created || "--"}
                        </p>
                      </div>

                      <div
                        className={`h-6 w-px ${
                          preferences.darkMode ? "bg-white/10" : "bg-black/10"
                        }`}
                      />

                      <div className="text-right">
                        <p
                          className={`text-[10px] font-semibold ${
                            preferences.darkMode
                              ? "text-white/45"
                              : "text-slate-500"
                          }`}
                        >
                          Last Seen
                        </p>
                        <p className="text-xs font-semibold">
                          {lastSeen || "--"}
                        </p>
                      </div>
                    </div>

                    {/* Endpoint preview */}
                    {info.endpoint && (
                      <div
                        className={`
                      rounded-2xl border px-3 py-2 text-[11px] font-semibold truncate
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/50"
                          : "bg-black/[0.03] border-black/10 text-slate-500"
                      }
                    `}
                        title={info.endpoint}
                      >
                        Endpoint: {info.endpoint}
                      </div>
                    )}
                    <button
                      onClick={() => pauseNotificationsToDevice(info)}
                      className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      info.isStandalone
                        ? preferences.darkMode
                          ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                          : "bg-cyan-50 border-emerald-200 text-emerald-700"
                        : preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-emerald-200 text-emerald-600"
                    }
                  `}
                    >
                      {info.paused
                        ? "Resume Notifications To This Device"
                        : "Pause Notifications To This Device"}
                    </button>
                    <button
                      onClick={() => cancelNotificationsToDevice(info)}
                      className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      info.isStandalone
                        ? preferences.darkMode
                          ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                          : "bg-cyan-50 border-red-200 text-red-700"
                        : preferences.darkMode
                          ? "bg-white/5 border-white/10 text-white/70"
                          : "bg-black/[0.03] border-red-200 text-red-600"
                    }
                  `}
                    >
                      Remove Notification Subscription From Device
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSubscriptions;
