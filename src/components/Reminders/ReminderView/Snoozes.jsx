import { useContext } from "react";
import { BiAlarmSnooze } from "react-icons/bi";
import UserContext from "../../../context/UserContext";
import { formatRelativeTime } from "../../../utils/helpers";

const Snoozes = ({ reminder }) => {
  const { preferences } = useContext(UserContext);

  const snoozeLength = reminder.snoozes?.count || 0;
  const snoozeHistory = reminder.snoozes?.snoozes || [];

  // Pattern summary calculations
  const snoozeDurations = snoozeHistory.map((s) => Number(s.howMuchTime) || 0);

  const averageSnooze =
    snoozeDurations.length > 0
      ? Math.round(
          snoozeDurations.reduce((sum, val) => sum + val, 0) /
            snoozeDurations.length,
        )
      : 0;

  const longestSnooze =
    snoozeDurations.length > 0 ? Math.max(...snoozeDurations) : 0;

  const mostCommonSnooze = (() => {
    if (snoozeDurations.length < 1) return 0;

    const counts = {};
    for (const duration of snoozeDurations) {
      counts[duration] = (counts[duration] || 0) + 1;
    }

    return Number(
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 0,
    );
  })();

  const lastSnoozed =
    snoozeHistory.length > 0
      ? [...snoozeHistory].sort(
          (a, b) => new Date(b.when).getTime() - new Date(a.when).getTime(),
        )[0]
      : null;

  const maxBar = longestSnooze > 0 ? longestSnooze : 1;

  return (
    <div
      className={`mt-4 ${preferences.darkMode ? "text-white" : "text-black"}`}
    >
      {/* Section Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold tracking-wide ${
              preferences.darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            Reminder Insights
          </p>
          <p className="mt-1 text-base font-semibold flex items-center gap-2">
            Snoozes
            <span
              className={`
                grid place-items-center h-8 w-8 rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
                }
              `}
            >
              <BiAlarmSnooze className="text-base" />
            </span>
          </p>
        </div>

        <div
          className={`
            px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
            ${
              snoozeLength < 1
                ? preferences.darkMode
                  ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
                : preferences.darkMode
                  ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                  : "bg-rose-50 border-rose-200 text-rose-700"
            }
          `}
        >
          {snoozeLength} total
        </div>
      </div>

      {/* Main Card */}
      <div
        className={`
          rounded-3xl border shadow-sm p-4 sm:p-5 backdrop-blur-md mt-3
          ${
            preferences.darkMode
              ? "bg-[#161616]/65 border-white/10"
              : "bg-white/75 border-black/10"
          }
        `}
      >
        {/* Summary */}
        <div
          className={`
            rounded-3xl border shadow-sm p-4
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/[0.03] border-black/10"
            }
          `}
        >
          {snoozeLength < 1 ? (
            <>
              <p
                className={`text-sm font-semibold ${
                  preferences.darkMode ? "text-emerald-200" : "text-emerald-600"
                }`}
              >
                Good work!!!
              </p>
              <p
                className={`mt-1 text-sm ${
                  preferences.darkMode ? "text-white/65" : "text-slate-600"
                }`}
              >
                You haven’t snoozed this reminder yet.
              </p>
            </>
          ) : (
            <p
              className={`text-sm leading-relaxed ${
                preferences.darkMode ? "text-white/65" : "text-slate-600"
              }`}
            >
              You have pushed this reminder back{" "}
              <span
                className={`font-semibold text-base ${
                  preferences.darkMode ? "text-rose-200" : "text-rose-600"
                }`}
              >
                {snoozeLength}
              </span>{" "}
              {snoozeLength === 1 ? "time" : "times"}.
            </p>
          )}
        </div>

        {/* Pattern Summary Row */}
        {snoozeHistory.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }
              `}
            >
              <p
                className={`text-[10px] font-semibold tracking-wide ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Most Common
              </p>
              <p className="mt-1 text-sm font-semibold">
                {mostCommonSnooze} min
              </p>
            </div>

            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }
              `}
            >
              <p
                className={`text-[10px] font-semibold tracking-wide ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Average
              </p>
              <p className="mt-1 text-sm font-semibold">{averageSnooze} min</p>
            </div>

            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }
              `}
            >
              <p
                className={`text-[10px] font-semibold tracking-wide ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Longest
              </p>
              <p className="mt-1 text-sm font-semibold">{longestSnooze} min</p>
            </div>

            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10"
                }
              `}
            >
              <p
                className={`text-[10px] font-semibold tracking-wide ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Last Snoozed
              </p>
              <p className="mt-1 text-sm font-semibold">
                {lastSnoozed
                  ? formatRelativeTime(new Date(lastSnoozed.when))
                  : "--"}
              </p>
            </div>
          </div>
        ) : null}

        {/* Mini visual bar strip */}
        {snoozeHistory.length > 0 ? (
          <div
            className={`
              mt-4 rounded-3xl border shadow-sm p-4
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p
                  className={`text-[10px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/45" : "text-slate-500"
                  }`}
                >
                  Snooze Pattern
                </p>
                <p className="text-sm font-semibold">Visual history</p>
              </div>

              <div
                className={`
                  px-3 py-1.5 rounded-2xl border text-[10px] font-semibold shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/65"
                      : "bg-black/[0.03] border-black/10 text-slate-600"
                  }
                `}
              >
                Peak {longestSnooze} min
              </div>
            </div>

            <div className="flex items-end gap-2 mt-5 h-min overflow-x-auto scrollbar-hide pb-1">
              {snoozeHistory.map((snooze, index) => {
                const amount = Number(snooze.howMuchTime) || 0;
                const barHeight = Math.max(16, (amount / maxBar) * 88);

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end gap-2 min-w-[34px]"
                    title={`${amount} min • ${new Date(
                      snooze.when,
                    ).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}`}
                  >
                    <div
                      className={`
                        w-8 rounded-2xl border shadow-sm transition-all duration-200
                        ${
                          preferences.darkMode
                            ? "bg-cyan-500/20 border-cyan-300/20 hover:bg-cyan-500/30"
                            : "bg-cyan-100 border-cyan-200 hover:bg-cyan-200"
                        }
                      `}
                      style={{ height: `${barHeight}px` }}
                    />
                    <p
                      className={`text-[10px] font-semibold ${
                        preferences.darkMode
                          ? "text-white/45"
                          : "text-slate-500"
                      }`}
                    >
                      {amount}
                    </p>
                  </div>
                );
              })}
            </div>

            <p
              className={`mt-3 text-[10px] font-semibold ${
                preferences.darkMode ? "text-white/40" : "text-slate-500"
              }`}
            >
              Taller bars represent longer snoozes.
            </p>
          </div>
        ) : null}

        {/* Snooze History */}
        {snoozeHistory.length > 0 ? (
          <div className="mt-4 space-y-3">
            {snoozeHistory.map((snooze, index) => (
              <div
                key={index}
                className={`
                  rounded-3xl border shadow-sm p-4
                  transition-all duration-200
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-black/10"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {new Date(snooze.when).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>

                    <p
                      className={`mt-1 text-[11px] font-semibold ${
                        preferences.darkMode
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      {formatRelativeTime(new Date(snooze.when))}
                    </p>
                  </div>

                  <div
                    className={`
                      flex-shrink-0 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                      ${
                        preferences.darkMode
                          ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }
                    `}
                  >
                    +{snooze.howMuchTime} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Snoozes;
