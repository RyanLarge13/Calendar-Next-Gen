import { useContext, useState } from "react";
import { updateReminderInMap } from "../../../utils/reminderMapHelpers.js";
import UserContext from "../../../context/UserContext";
import NotificationSubscription from "../../Notifications/NotificationSubscription";
import { getAuthToken, isPassed } from "../../../utils/helpers";
import { MdCheck, MdInfo } from "react-icons/md";
import { API_UpdateReminderAndNotificationIgnore } from "../../../utils/api";

const ReminderDeviceSubscriptions = ({ reminder }) => {
  const { preferences, notifSubs, setRemindersMap } = useContext(UserContext);
  const [savingEndpoint, setSavingEndpoint] = useState(null);
  const [toggleError, setToggleError] = useState("");

  const reminderNotPassedTime = isPassed(new Date(reminder.time), new Date());

  const ignoredDevices = reminder.ignoreDevices || [];

  const toggleNotification = async (isIgnored, endpoint) => {
    if (savingEndpoint) return;
    setToggleError("");
    setSavingEndpoint(endpoint);
    const newIgnoredDevices = isIgnored
      ? ignoredDevices.filter((device) => device !== endpoint)
      : [...ignoredDevices, endpoint];
    try {
      await API_UpdateReminderAndNotificationIgnore(
        newIgnoredDevices,
        reminder.id,
        getAuthToken(),
      );
      setRemindersMap((prev) =>
        updateReminderInMap(prev, reminder.id, { ignoreDevices: newIgnoredDevices }),
      );
    } catch (err) {
      console.error("Unable to update reminder device notifications", err);
      setToggleError("Could not update this device. Please try again.");
    } finally {
      setSavingEndpoint(null);
    }
  };

  return (
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
          Devices Set To Notify
        </p>
        <h3
          className={`text-base font-semibold mt-1 ${
            preferences.darkMode ? "text-white/80" : "text-slate-600"
          }`}
        >
          {reminderNotPassedTime
            ? "Your Devices And How This Reminder Will Interact"
            : "Your Devices And How This Reminder Was Delivered"}
        </h3>
        {toggleError && <p role="alert" className="text-sm text-red-500">{toggleError}</p>}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notifSubs.map((subStr, index) => {
              const sub = JSON.parse(subStr);

              const isIgnored = ignoredDevices.includes(sub.endpoint);
              const canToggleNotification = !reminderNotPassedTime;
              const showIgnoredStatus = isIgnored && !reminderNotPassedTime;

              return (
                <div className="mt-3" key={index}>
                  <div className="mb-3">
                    {/* Status Badge */}
                    <div
                      className={`
                        px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] w-min whitespace-nowrap font-semibold
                        ${
                          showIgnoredStatus
                            ? preferences.darkMode
                              ? "bg-red-500/15 border-red-300/20 text-red-100"
                              : "bg-red-50 border-red-200 text-red-700"
                            : preferences.darkMode
                              ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        }
                      `}
                    >
                      <p>
                        {showIgnoredStatus ? (
                          <>
                            Device Ignored <MdInfo className="inline ml-2" />
                          </>
                        ) : (
                          <>
                            Delivered To Device{" "}
                            <MdCheck className="inline ml-2" />
                          </>
                        )}
                      </p>
                    </div>

                    {/* Toggle Button */}
                    {canToggleNotification && (
                      <button
                        type="button"
                        disabled={Boolean(savingEndpoint)}
                        onClick={() =>
                          toggleNotification(isIgnored, sub.endpoint)
                        }
                        className={`
                          px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
                          ${
                            isIgnored
                              ? preferences.darkMode
                                ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : preferences.darkMode
                                ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                                : "bg-rose-50 border-rose-200 text-rose-700"
                          }
                        `}
                      >
                        {isIgnored
                          ? "Enable Device Notification"
                          : "Disable Device Notification"}
                      </button>
                    )}
                  </div>
                  <NotificationSubscription
                    ns={subStr}
                    hasSub={true}
                    simpleView={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderDeviceSubscriptions;
