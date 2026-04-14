import { useContext, useState } from "react";
import UserContext from "../../../context/UserContext";
import TimeSetter from "../../DatePickers/TimeSetter";
import Portal from "../../Misc/Portal";
import {
  getAuthToken,
  isPassedTime,
  makeDateTime,
} from "../../../utils/helpers";
import { API_UpdateReminderTime } from "../../../utils/api";

const ChangeDateAndTime = ({ reminder }) => {
  const { preferences } = useContext(UserContext);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDateStr, setTempDateStr] = useState(
    new Date(reminder.time).toLocaleDateString(),
  );
  const [warningState, setWarningState] = useState(0);

  const saveNewReminderDate = async (newDate) => {
    const { hour, minutes, meridiem } = newDate;

    const newReminderDate = makeDateTime(tempDateStr, hour, minutes, meridiem);

    // Make sure the user did not select a time that is previous. Still allow but warn

    const isPassed = isPassedTime(new Date(newReminderDate), new Date());

    if (isPassed) {
      if (warningState < 1) {
        // Call notification
        return;
      }

      setWarningState((prev) => prev + 1);
    }

    try {
      const token = getAuthToken();
      await API_UpdateReminderTime(newReminderDate, reminder.id, token);

      // Update state reminder and notification
    } catch (err) {
      console.log(
        "Error updating reminder time on the server when setting a new time for reminder in ReminderView",
      );
      console.log(err);
    }
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
