import { useContext, useState } from "react";
import UserContext from "../../../context/UserContext";
import TimeSetter from "../../DatePickers/TimeSetter";
import Portal from "../../Misc/Portal";
import { getAuthToken, isPassed, makeDateTime } from "../../../utils/helpers";
import { API_UpdateReminderTime } from "../../../utils/api";

const ChangeDateAndTime = ({ reminder }) => {
  const { preferences, setReminders, setNotifications, setSystemNotif } =
    useContext(UserContext);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDateStr, setTempDateStr] = useState(
    new Date(reminder.time).toLocaleDateString(),
  );

  const saveNewReminderDate = async (newDate) => {
    const { hour, minutes, meridiem } = newDate;

    const newReminderDate = makeDateTime(tempDateStr, hour, minutes, meridiem);

    // Make sure the user did not select a time that is previous. Still allow but warn

    const isReminderPassed = isPassed(new Date(), new Date(newReminderDate));

    const continueRequest = async () => {
      setShowTimePicker(false);
      setSystemNotif({ show: false });
      setReminders((prev) =>
        prev.map((r) => {
          if (r.id === reminder.id) {
            return { ...r, time: newReminderDate.toString() };
          }
          return r;
        }),
      );

      setNotifications((prev) =>
        prev.map((n) => {
          if (n.reminderRefId === reminder.id) {
            return { ...n, time: newReminderDate.toString() };
          }
          return n;
        }),
      );

      try {
        const token = getAuthToken();
        await API_UpdateReminderTime(
          newReminderDate.toString(),
          reminder.id,
          token,
        );
      } catch (err) {
        console.log(
          "Error updating reminder time on the server when setting a new time for reminder in ReminderView",
        );
        console.log(err);
      }
    };

    if (isReminderPassed) {
      // Call notification
      const newNotif = {
        show: true,
        title: "Past Time",
        text: "The time you are trying to update the reminder to has already passed, are you sure you want to do this?",
        color: "bg-red-300",
        hasCancel: true,
        actions: [
          {
            text: "close",
            func: () => setSystemNotif({ show: false }),
          },
          { text: "yes", func: async () => await continueRequest() },
        ],
      };
      setSystemNotif(newNotif);
      return;
    }

    continueRequest();
  };

  return (
    <div className="mb-5">
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
          Date Set
        </p>
        <h3
          className={`text-base font-semibold mt-1 ${
            preferences.darkMode ? "text-white/80" : "text-slate-600"
          }`}
        >
          Change The Date Of Your Reminder
        </h3>
        <div className="flex justify-start items-center gap-x-3 mt-3">
          <div>
            <p
              className={`text-[15px] font-semibold ${
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              {new Date(reminder.time).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowTimePicker(true)}
              className={`
              px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              Change Date
            </button>
            {showTimePicker ? (
              <Portal>
                <TimeSetter
                  saveData={saveNewReminderDate}
                  cancelTimeSetter={() => setShowTimePicker(false)}
                  dateChangerCallback={(str) => setTempDateStr(str)}
                />
              </Portal>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDateAndTime;
