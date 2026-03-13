import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import {
  addSubscriptionToUser,
  API_PauseAllNotifications,
  checkPermissionsAndCreateNewSub,
  removeNotificationSubFromServer,
  requestAndSubscribe,
} from "../../../utils/api";

const NotificationSubscriptions = () => {
  const { preferences, notifSubs, setNotifSubs, setSystemNotif, setUser } =
    useContext(UserContext);

  const [hasSub, setHasSub] = useState({ hasSub: false, endpoint: null });
  const [allSubsPaused, setAllSubsPaused] = useState(false);

  useEffect(() => {
    checkForSub();
  }, []);

  useEffect(() => {
    checkForAllSubsPaused();
  }, [notifSubs]);

  const checkForAllSubsPaused = () => {
    try {
      const everySubIsPaused = notifSubs.every((s) => {
        const subObj = JSON.parse(s);
        const isPaused = subObj.paused;
        if (isPaused) {
          return true;
        }
        return false;
      });

      if (everySubIsPaused) {
        setAllSubsPaused(true);
        return;
      }

      setAllSubsPaused(false);
    } catch (err) {
      console.log(
        "Error parsing user notification subscription objects when checking for all subs paused",
      );
      console.log(err);
    }
  };

  const checkForSub = async () => {
    const reg = await navigator.serviceWorker.ready;
    const currentSub = await reg.pushManager.getSubscription();

    if (currentSub) {
      setHasSub({ hasSub: true, endpoint: currentSub.endpoint });
    } else {
      setHasSub({ hasSub: false, endpoint: null });
    }
  };

  const pauseNotificationsToDevice = async (info) => {};

  const handleSubscribe = async () => {
    if (notifSubs.length > 0) {
      const newSubscription = await checkPermissionsAndCreateNewSub();
      try {
        const token = localStorage.getItem("authToken");
        await addSubscriptionToUser(newSubscription, token);
        setNotifSubs((prev) => [...prev, JSON.stringify(newSubscription)]);
      } catch (err) {
        console.log(
          "Something went wrong when attempting to add a subscription to the users profile",
        );
        console.log(err);
      }

      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await requestAndSubscribe(token);
      const data = res.json();

      if (data === null) {
        // Print error
        throw new Error(
          "Error, requestAndSubscribe failed. Data returned null",
        );
      }

      setUser(data.user);
      setNotifSubs(data.user.notifSub);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.log("Error starting subscription for user for the first time");
      console.log(err);
    }
  };

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

  const confirmPauseAllSubscriptions = () => {
    const confirmation = {
      show: true,
      title: "Pause All Device Subscriptions?",
      text: "Are you sure you want to pause notifications to all of your devices?",
      color: "bg-red-200",
      hasCancel: false,
      actions: [
        {
          text: "close",
          func: () => setSystemNotif({ show: false }),
        },
        {
          text: "remove sub",
          func: () => pauseAllSubscriptions(),
        },
      ],
    };

    setSystemNotif(confirmation);
  };

  const pauseAllSubscriptions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await API_PauseAllNotifications(token);

      setNotifSubs((prev) =>
        prev.map((s) => ({ ...JSON.parse(s), paused: true })),
      );
    } catch (err) {
      console.log("Error requesting to pause all notifications");
      console.log(err);
    }
  };

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
          {hasSub ? (
            <div>
              <p
                className={`text-[11px] font-semibold ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                You are subscribed to notifications on this device
              </p>
            </div>
          ) : (
            <div>
              <p
                className={`text-[10px] font-semibold max-w-60 ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                It seems as though you are not subscribed to get reminders and
                other notifications on this device
              </p>
              <button
                onClick={handleSubscribe}
                className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      preferences.darkMode
                        ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }
                  `}
              >
                Get Notifications On This Device
              </button>
            </div>
          )}
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
            {!allSubsPaused ? (
              <button
                onClick={confirmPauseAllSubscriptions}
                className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                    ${
                      preferences.darkMode
                        ? "bg-orange-500/15 border-orange-300/20 text-orange-100"
                        : "bg-orange-50 border-orange-200 text-orange-700"
                    }
                  `}
              >
                Pause Notifications To All Devices
              </button>
            ) : null}
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

              const isDeviceSub = hasSub.hasSub
                ? info.endpoint === hasSub.endpoint
                : false;

              return (
                <div
                  key={index}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSubscriptions;
