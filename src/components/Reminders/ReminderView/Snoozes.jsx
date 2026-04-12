import React, { useContext } from "react";
import { BiAlarmSnooze } from "react-icons/bi";
import UserContext from "../../../context/UserContext";

const Snoozes = ({ reminder }) => {
  const { preferences } = useContext(UserContext);

  const snoozeLength = reminder.snoozes?.count || 0;

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
