import { useContext } from "react";
import UserContext from "../../../context/UserContext";
import NotificationSubscription from "../../Notifications/NotificationSubscription";

const ReminderDeviceSubscriptions = ({ reminder }) => {
  const { preferences, notifSubs } = useContext(UserContext);

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
          These are the devices this reminder is set to notify
        </h3>
        <div>
          {reminder.ignoreDevices?.length < 1 || !reminder.ignoreDevices ? (
            <div className="flex flex-col gap-3">
              {notifSubs.map((subStr, index) => (
                <div className="mt-3" key={index}>
                  <div className="mb-3">
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
                      Disable Device Notification
                    </button>
                  </div>
                  <NotificationSubscription
                    ns={subStr}
                    hasSub={true}
                    simpleView={true}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReminderDeviceSubscriptions;
