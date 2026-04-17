import { useContext } from "react";
import UserContext from "../../../context/UserContext";
import { MdDeleteSweep } from "react-icons/md";
import { BiCheckCircle, BiCircle, BiPause, BiRepeat } from "react-icons/bi";
import { deleteReminder } from "../../../utils/api";

const QuickPanelTop = ({ reminder }) => {
  const { preferences, setReminders, user } = useContext(UserContext);

  const completeReminder = async () => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === reminder.id) {
          return {
            ...r,
            completed: true,
          };
        } else {
          return r;
        }
      }),
    );

    try {
      const token = localStorage.getItem("authToken");
      await updateReminderComplete(
        { reminderId: reminder.id, completed: true },
        token,
      );
    } catch (err) {
      console.log("Error trying to mark reminder as complete");
      console.log(err);
    }
  };

  const deleteThisReminder = async () => {
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));

    try {
      await deleteReminder(user.username, reminder.id, token);
    } catch (err) {
      console.log("Error attempting to delete reminder");
      console.log(err);
    }
  };

  return (
    <div
      className={`mb-4 flex flex-wrap gap-2 
          rounded-3xl border shadow-sm px-5 py-4
          backdrop-blur-md
          ${
            preferences.darkMode
              ? "bg-[#161616]/70 border-white/10 text-white"
              : "bg-white/70 border-black/10 text-slate-900"
          }
        `}
    >
      {!reminder.completed ? (
        <button
          onClick={completeReminder}
          className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-green-500/15 border-green-300/20 text-green-100"
                  : "bg-green-50 border-green-200 text-green-700"
              }
            `}
        >
          Mark Reminder As Complete <BiCheckCircle className="text-lg" />
        </button>
      ) : (
        <button
          onClick={() => {}}
          className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }
            `}
        >
          Mark Reminder As InComplete <BiCircle className="text-lg" />
        </button>
      )}
      <button
        onClick={deleteThisReminder}
        className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-red-500/15 border-red-300/20 text-red-100"
                  : "bg-red-50 border-red-200 text-red-700"
              }
            `}
      >
        Delete This Reminder <MdDeleteSweep className="text-lg" />
      </button>
      {/* If not repeating */}
      {!reminder.repeats?.repeat ? (
        <button
          onClick={() => {}}
          className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700"
              }
            `}
        >
          Make Repeatable <BiRepeat className="text-lg" />
        </button>
      ) : null}
      {/* If repeating */}
      {reminder.repeats?.repeat ? (
        <button
          onClick={() => {}}
          className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-pink-500/15 border-pink-300/20 text-pink-100"
                  : "bg-pink-50 border-pink-200 text-pink-700"
              }
            `}
        >
          Delete All Reminders <MdDeleteSweep className="text-lg" />
        </button>
      ) : null}
      {reminder.repeats?.repeat ? (
        <button
          onClick={() => {}}
          className={`
              px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }
            `}
        >
          Pause Reminders <BiPause className="text-lg" />
        </button>
      ) : null}
    </div>
  );
};

export default QuickPanelTop;
