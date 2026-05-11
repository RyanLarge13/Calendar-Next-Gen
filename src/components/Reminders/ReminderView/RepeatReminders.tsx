import { useContext } from "react";
import UserContext from "../../../context/UserContext";
import { PreferencesType } from "../../../types/preferences";
import { reminderFutureDays } from "../../../utils/helpers";

const RepeatReminders = ({ reminder }) => {
  const { preferences } = useContext(UserContext) as {
    preferences: PreferencesType;
  };

  return reminder.repeat?.on ? (
    <div className="space-y-4">
      <div
        className={`
      rounded-3xl border shadow-sm p-4 sm:p-5
      backdrop-blur-md overflow-hidden
      ${
        preferences.darkMode
          ? "bg-[#161616]/65 border-white/10"
          : "bg-white/75 border-black/10"
      }
    `}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              Repeating Reminders
            </p>

            <h3
              className={`mt-1 text-lg font-bold ${
                preferences.darkMode ? "text-white/90" : "text-slate-800"
              }`}
            >
              {reminder.repeat?.howOften || "Does not repeat"}
            </h3>
          </div>

          <div
            className={`
          shrink-0 rounded-full px-3 py-1 text-[11px] font-bold border
          ${
            preferences.darkMode
              ? "bg-white/10 border-white/10 text-white/75"
              : "bg-slate-900/5 border-black/10 text-slate-600"
          }
        `}
          >
            {reminder.repeat?.interval === "infinity"
              ? "Forever"
              : `${reminder.repeat?.interval || 1} times`}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={`
          rounded-2xl border p-3
          ${
            preferences.darkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/70 border-black/10"
          }
        `}
          >
            <p
              className={
                preferences.darkMode
                  ? "text-white/40 text-[11px]"
                  : "text-slate-400 text-[11px]"
              }
            >
              Frequency
            </p>
            <p
              className={
                preferences.darkMode
                  ? "text-white/85 font-semibold mt-1"
                  : "text-slate-800 font-semibold mt-1"
              }
            >
              {reminder.repeat?.howOften || "—"}
            </p>
          </div>

          <div
            className={`
          rounded-2xl border p-3
          ${
            preferences.darkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/70 border-black/10"
          }
        `}
          >
            <p
              className={
                preferences.darkMode
                  ? "text-white/40 text-[11px]"
                  : "text-slate-400 text-[11px]"
              }
            >
              Ends
            </p>
            <p
              className={
                preferences.darkMode
                  ? "text-white/85 font-semibold mt-1"
                  : "text-slate-800 font-semibold mt-1"
              }
            >
              {reminder.repeat?.interval === "infinity"
                ? "Never"
                : `After ${reminder.repeat?.interval || 1} occurrences`}
            </p>
          </div>

          <div
            className={`
          rounded-2xl border p-3
          ${
            preferences.darkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/70 border-black/10"
          }
        `}
          >
            <p
              className={
                preferences.darkMode
                  ? "text-white/40 text-[11px]"
                  : "text-slate-400 text-[11px]"
              }
            >
              Skipped
            </p>
            <p
              className={
                preferences.darkMode
                  ? "text-white/85 font-semibold mt-1"
                  : "text-slate-800 font-semibold mt-1"
              }
            >
              {reminder.repeat?.skipDates?.length || 0} dates
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              Upcoming Repeat Days
            </p>

            <p
              className={`text-[11px] ${
                preferences.darkMode ? "text-white/35" : "text-slate-400"
              }`}
            >
              Next 4 occurrences
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminderFutureDays(reminder, 4)?.map((date, index) => {
              const isNext = index === 0;

              return (
                <div
                  key={date}
                  className={`
              relative overflow-hidden rounded-2xl border p-3
              transition-all duration-200
              ${
                preferences.darkMode
                  ? "bg-black/20 border-white/10"
                  : "bg-white/70 border-black/10"
              }
            `}
                >
                  {isNext && (
                    <div
                      className={`
                  absolute top-0 right-0 px-2 py-1 text-[10px] font-bold rounded-bl-xl
                  ${
                    preferences.darkMode
                      ? "bg-emerald-400/15 text-emerald-200"
                      : "bg-emerald-100 text-emerald-700"
                  }
                `}
                    >
                      NEXT
                    </div>
                  )}

                  <p
                    className={`text-[11px] ${
                      preferences.darkMode ? "text-white/35" : "text-slate-400"
                    }`}
                  >
                    Occurrence {index + 1}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div
                      className={`
                  h-10 w-10 rounded-2xl flex items-center justify-center
                  border shrink-0
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-slate-100 border-black/5"
                  }
                `}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isNext
                            ? "bg-emerald-400"
                            : preferences.darkMode
                              ? "bg-white/40"
                              : "bg-slate-400"
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`font-semibold truncate ${
                          preferences.darkMode
                            ? "text-white/85"
                            : "text-slate-800"
                        }`}
                      >
                        {date}
                      </p>

                      <p
                        className={`text-xs mt-0.5 ${
                          preferences.darkMode
                            ? "text-white/35"
                            : "text-slate-400"
                        }`}
                      >
                        {isNext
                          ? "Next reminder notification"
                          : "Future repeating occurrence"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((_, index) => {
              const skipped = index < (reminder.repeat?.skipDates?.length || 0);

              return (
                <div key={index} className="flex items-center gap-2 flex-1">
                  <div
                    className={`
                  h-9 w-9 rounded-full border flex items-center justify-center text-xs font-bold
                  ${
                    skipped
                      ? preferences.darkMode
                        ? "bg-red-500/15 border-red-400/20 text-red-200"
                        : "bg-red-50 border-red-200 text-red-500"
                      : preferences.darkMode
                        ? "bg-emerald-400/15 border-emerald-300/20 text-emerald-200"
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                  }
                `}
                  >
                    {skipped ? "×" : index + 1}
                  </div>

                  {index !== 4 && (
                    <div
                      className={`h-px flex-1 ${
                        preferences.darkMode ? "bg-white/10" : "bg-black/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p
            className={`mt-3 text-xs leading-relaxed ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            This reminder will repeat{" "}
            <span
              className={
                preferences.darkMode
                  ? "text-white/75 font-semibold"
                  : "text-slate-700 font-semibold"
              }
            >
              {reminder.repeat?.howOften || "on its schedule"}
            </span>
            {reminder.repeat?.interval === "infinity"
              ? " until you turn repeating off."
              : ` for ${reminder.repeat?.interval || 1} total occurrences.`}{" "}
            Skipped dates are ignored and the reminder continues on the next
            valid repeat date.
          </p>
        </div>

        {!!reminder.repeat?.skipDates?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {reminder.repeat.skipDates.slice(0, 4).map((date) => (
              <span
                key={date}
                className={`
              rounded-full px-3 py-1 text-[11px] font-semibold border
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/55"
                  : "bg-slate-100 border-black/5 text-slate-500"
              }
            `}
              >
                Skipped {date}
              </span>
            ))}

            {reminder.repeat.skipDates.length > 4 && (
              <span
                className={`
              rounded-full px-3 py-1 text-[11px] font-semibold border
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/55"
                  : "bg-slate-100 border-black/5 text-slate-500"
              }
            `}
              >
                +{reminder.repeat.skipDates.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default RepeatReminders;
