import { useContext } from "react";
import {
  getAuthToken,
  isPassedTime,
  isSameCalendarDay,
} from "../../../utils/helpers";
import UserContext from "../../../context/UserContext";
import { MdOutlineUpdate, MdSnooze } from "react-icons/md";
import { API_SnoozeReminderAndNotification } from "../../../utils/api";

const QuickPanel = ({ reminder }) => {
  const { preferences, setReminders, setNotifications } =
    useContext(UserContext);

  const reminderNotPassedTime = isPassedTime(
    new Date(reminder.time),
    new Date(),
  );

  const snoozeReminder = async (amount, resettingToday = false) => {
    let dateRef;
    const timeRef = new Date(reminder.time);

    if (resettingToday) {
      dateRef = new Date();
    } else {
      dateRef = new Date(reminder.time);
    }

    dateRef.setMinutes(timeRef.getMinutes() + amount);
    dateRef.setHours(timeRef.getHours());

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
            count: r.snoozes?.count || 0 + 1,
            snoozes: [...(r.snoozes?.snoozes || []), newSnooze],
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
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
      {!isSameCalendarDay(new Date(reminder.time), new Date()) ? (
        <button
          onClick={() => snoozeReminder(0, true)}
          type="button"
          className={`
                  group rounded-2xl border shadow-sm px-3 py-3
                  flex flex-col items-center justify-center gap-2
                  transition active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                  }
                `}
        >
          <div
            className={`
                    grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                    ${
                      preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 group-hover:bg-cyan-500/20"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700 group-hover:bg-cyan-100"
                    }
                  `}
          >
            <MdOutlineUpdate className="text-lg" />
          </div>
          <p className="text-[11px] font-semibold text-center leading-tight">
            Reset Today
          </p>
        </button>
      ) : null}

      {reminderNotPassedTime ? (
        <>
          <button
            onClick={() => snoozeReminder(5)}
            type="button"
            className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
          >
            <div
              className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-orange-500/15 border-orange-300/20 text-orange-100 group-hover:bg-orange-500/20"
                      : "bg-orange-50 border-orange-200 text-orange-700 group-hover:bg-orange-100"
                  }
                `}
            >
              <MdSnooze className="text-lg" />
            </div>
            <p className="text-[11px] font-semibold text-center leading-tight">
              Snooze 5
            </p>
          </button>

          <button
            onClick={() => snoozeReminder(10)}
            type="button"
            className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
          >
            <div
              className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100 group-hover:bg-indigo-500/20"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700 group-hover:bg-indigo-100"
                  }
                `}
            >
              <MdSnooze className="text-lg" />
            </div>
            <p className="text-[11px] font-semibold text-center leading-tight">
              Snooze 10
            </p>
          </button>

          <button
            onClick={() => snoozeReminder(15)}
            type="button"
            className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
          >
            <div
              className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-amber-500/15 border-amber-300/20 text-amber-100 group-hover:bg-amber-500/20"
                      : "bg-amber-50 border-amber-200 text-amber-700 group-hover:bg-amber-100"
                  }
                `}
            >
              <MdSnooze className="text-lg" />
            </div>
            <p className="text-[11px] font-semibold text-center leading-tight">
              Snooze 15
            </p>
          </button>

          <button
            onClick={() => snoozeReminder(30)}
            type="button"
            className={`
                group rounded-2xl border shadow-sm px-3 py-3
                flex flex-col items-center justify-center gap-2
                transition active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-black/10 hover:bg-black/[0.02] text-slate-800"
                }
              `}
          >
            <div
              className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                  ${
                    preferences.darkMode
                      ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100 group-hover:bg-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 group-hover:bg-emerald-100"
                  }
                `}
            >
              <MdSnooze className="text-lg" />
            </div>
            <p className="text-[11px] font-semibold text-center leading-tight">
              Snooze 30
            </p>
          </button>
        </>
      ) : null}
    </div>
  );
};

export default QuickPanel;
