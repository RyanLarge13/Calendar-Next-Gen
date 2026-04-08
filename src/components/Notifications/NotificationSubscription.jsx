import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { removeNotificationSubFromServer } from "../../utils/api";

const NotificationSubscription = ({ ns, hasSub, simpleView = false }) => {
  const { preferences, setSystemNotif, setUser } = useContext(UserContext);

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

  const isDeviceSub = hasSub.hasSub ? info.endpoint === hasSub.endpoint : false;

  const confirmRemoveSub = (info) => {
    const confirmation = {
      show: true,
      title: "Remove Subscription From Device?",
      text: "Are you sure you want to remove this notification subscription from the device shown?",
      color: "bg-red-200",
      hasCancel: false,
      actions: [
        {
          text: "close",
          func: () => setSystemNotif({ show: false }),
        },
        {
          text: "remove sub",
          func: () => cancelNotificationsToDevice(info.endpoint),
        },
      ],
    };

    setSystemNotif(confirmation);
  };

  const cancelNotificationsToDevice = async (endpoint) => {
    const reg = await navigator.serviceWorker.ready;
    const currentSub = await reg.pushManager.getSubscription();

    if (endpoint === currentSub.endpoint) {
      currentSub.unsubscribe();
    }

    try {
      const token = localStorage.getItem("authToken");
      setSystemNotif({ show: false });

      const newSubs = notifSubs.filter(
        (ns) => JSON.parse(ns).endpoint !== endpoint,
      );

      await removeNotificationSubFromServer(newSubs, token);

      setUser((prev) => ({
        ...prev,
        notifSubs: newSubs,
      }));
    } catch (err) {
      console.log("Failed to remove the notification subscription from server");
      console.log(err);
    }
  };

  return (
    <div
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
            {isDeviceSub
              ? "Current Device Subscription"
              : info.platform || "Unknown Platform"}
          </p>
          <p
            className={`text-[11px] mt-1 font-semibold truncate ${
              preferences.darkMode ? "text-white/50" : "text-slate-500"
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
            📱 {info.screen?.width || "?"}×{info.screen?.height || "?"}
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
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              Created
            </p>
            <p className="text-xs font-semibold">{created || "--"}</p>
          </div>

          <div
            className={`h-6 w-px ${
              preferences.darkMode ? "bg-white/10" : "bg-black/10"
            }`}
          />

          <div className="text-right">
            <p
              className={`text-[10px] font-semibold ${
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              Last Seen
            </p>
            <p className="text-xs font-semibold">{lastSeen || "--"}</p>
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
                      preferences.darkMode
                        ? "bg-orange-500/15 border-orange-300/20 text-orange-100"
                        : "bg-orange-50 border-orange-200 text-orange-700"
                    }
                  `}
        >
          {info.paused
            ? "Resume Notifications To This Device"
            : "Pause Notifications To This Device"}
        </button>
        <button
          onClick={() => confirmRemoveSub(info)}
          className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      preferences.darkMode
                        ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                        : "bg-rose-50 border-rose-200 text-rose-700"
                    }
                  `}
        >
          Remove Notification Subscription From Device
        </button>
      </div>
    </div>
  );
};

export default NotificationSubscription;
