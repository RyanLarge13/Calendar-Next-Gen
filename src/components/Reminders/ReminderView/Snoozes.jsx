import React, { useContext } from "react";
import { BiAlarmSnooze } from "react-icons/bi";
import UserContext from "../../../context/UserContext";
import { getAuthToken, isPassedTime } from "../../../utils/helpers";

const Snoozes = ({ reminder }) => {
  const { preferences, setReminders, setNotifications } =
    useContext(UserContext);

  const snoozeLength = reminder.snoozes?.count || 0;
  const isReminderPassed = isPassedTime(new Date(reminder.time), new Date());

  const snoozeReminder = async (amount) => {
    let timeBase = new Date(reminder.time);

    if (isReminderPassed) {
      timeBase.setHours(new Date().getHours());
      timeBase.setMinutes(new Date().getMinutes() + amount);
    } else {
      timeBase.setHours(timeBase.getHours());
      timeBase.setMinutes(timeBase.getMinutes() + amount);
    }

    const newTime = new Date(timeBase);

    const newSnooze = {
      when: new Date(),
      howMuchTime: amount,
    };

    let globalSnoozes;

    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === reminder.id) {
          const newSnoozes = {
            ...r.snoozes,
            count: r.snoozes.count + 1,
            snoozes: [...r.snoozes.snoozes, newSnooze],
          };

          globalSnoozes = newSnoozes;

          return {
            ...r,
            time: newTime.toString(),
            snoozes: newSnoozes,
          };
        }
        return r;
      }),
    );
    setNotifications((prev) =>
      prev.filter((n) => n.reminderRefId !== reminder.id),
    );

    try {
      const token = getAuthToken();
      await API_SnoozeReminderAndNotification(
        reminder.id,
        token,
        newTime.toString(),
        globalSnoozes,
      );
    } catch (err) {
      console.log(
        "Error updating reminder or notification on server to the new snoozed time",
      );
      console.log(err);
    }
  };

  return (
    <div className="mt-3">
      <p
        className={`text-base flex justify-start items-center gap-x-2 font-semibold mt-1 ${
          preferences.darkMode ? "text-white/80" : "text-slate-600"
        }`}
      >
        Snoozes <BiAlarmSnooze />
      </p>
      <div
        className={`
                    rounded-3xl border shadow-sm p-4 sm:p-5
                    backdrop-blur-md mt-2
                    ${
                      preferences.darkMode
                        ? "bg-[#161616]/65 border-white/10"
                        : "bg-white/75 border-black/10"
                    }
                    `}
      >
        {snoozeLength < 1 ? (
          <p
            className={`text-sm ${
              preferences.darkMode ? "text-green-200" : "text-emerald-600"
            }`}
          >
            Good Work!!!
          </p>
        ) : null}
        <p
          className={`text-sm ${
            preferences.darkMode ? "text-white/65" : "text-slate-600"
          }`}
        >
          You have pushed this alarm back{" "}
          <span
            className={`font-semibold text-md ${snoozeLength < 1 ? "text-green-600" : "text-rose-600"}`}
          >
            {snoozeLength}
          </span>{" "}
          times
        </p>
        {reminder.snoozes?.snoozes
          ? reminder.snoozes.snoozes.map((snooze) => <div></div>)
          : null}
      </div>
    </div>
  );
};

export default Snoozes;
