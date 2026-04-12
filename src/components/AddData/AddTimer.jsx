import React, { useContext } from "react";
import { BiTimer, BiPlus, BiMinus, BiPlay } from "react-icons/bi";
import { MdOutlineTimer, MdOutlineAccessTime, MdClear } from "react-icons/md";
import UserContext from "../../context/UserContext";

const AddTimer = () => {
  const { preferences } = useContext(UserContext);

  // placeholders only
  const quickTimes = [5, 10, 15, 25, 30, 45, 60];
  const selectedMinutes = 25;

  return (
    <div className="w-full mt-20">
      <div
        className={`
          border overflow-hidden
          ${
            preferences.darkMode
              ? "bg-[#161616]/90 border-white/10 text-white"
              : "bg-white/90 border-black/10 text-slate-900"
          }
          backdrop-blur-md
        `}
      >
        {/* Header */}
        <div
          className={`
            px-4 py-4 sm:px-5 sm:py-5 border-b
            ${
              preferences.darkMode
                ? "border-white/10 bg-[#161616]/70"
                : "border-black/10 bg-white/70"
            }
            backdrop-blur-md
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase ${
                  preferences.darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                Timer
              </p>
              <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                Create Timer
              </h2>
              <p
                className={`mt-1.5 sm:mt-2 text-xs sm:text-sm ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Set a quick countdown or choose a custom duration.
              </p>
            </div>

            <div
              className={`
                grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-2xl sm:rounded-3xl border shadow-sm flex-shrink-0
                ${
                  preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
                }
              `}
            >
              <BiTimer className="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4 sm:space-y-5">
          {/* Quick preset buttons */}
          <div
            className={`
              rounded-3xl border shadow-sm p-3 sm:p-4
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Quick Presets
                </p>
                <p className="text-xs sm:text-sm font-semibold">Start fast</p>
              </div>

              <div
                className={`
                  px-2.5 py-1.5 sm:px-3 rounded-2xl border text-[10px] sm:text-[11px] font-semibold shadow-sm flex-shrink-0
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70"
                      : "bg-black/[0.03] border-black/10 text-slate-600"
                  }
                `}
              >
                One tap
              </div>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
              {quickTimes.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={`
                    rounded-2xl border shadow-sm px-3 py-2.5 sm:px-3 sm:py-3 text-xs sm:text-sm font-semibold transition
                    hover:shadow-md active:scale-[0.97]
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                        : "bg-black/[0.03] border-black/10 text-slate-700 hover:bg-black/[0.05]"
                    }
                  `}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Custom time picker controls */}
          <div
            className={`
              rounded-3xl border shadow-sm p-3 sm:p-4
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <p
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Custom Time
                </p>
                <p className="text-xs sm:text-sm font-semibold">
                  Adjust manually
                </p>
              </div>

              <button
                type="button"
                className={`
                  flex items-center gap-2 px-3 py-2 sm:px-4 rounded-2xl border shadow-sm text-xs sm:text-sm font-semibold transition
                  hover:shadow-md active:scale-[0.97] flex-shrink-0
                  ${
                    preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/20"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                  }
                `}
              >
                <MdOutlineAccessTime className="text-base sm:text-lg" />
                <span className="hidden xs:inline">Pick Time</span>
                <span className="xs:hidden">Pick</span>
              </button>
            </div>

            <div className="grid grid-cols-[48px_1fr_48px] sm:grid-cols-[56px_1fr_56px] gap-2 sm:gap-3 items-center">
              <button
                type="button"
                className={`
                  h-12 w-12 sm:h-14 sm:w-14 grid place-items-center rounded-2xl border shadow-sm transition
                  hover:shadow-md active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.05]"
                  }
                `}
                aria-label="Decrease time"
              >
                <BiMinus className="text-xl sm:text-2xl" />
              </button>

              <div
                className={`
                  rounded-3xl border shadow-inner px-3 py-3 sm:px-4 sm:py-4 text-center min-w-0
                  ${
                    preferences.darkMode
                      ? "bg-[#161616]/40 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <p
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/45" : "text-slate-500"
                  }`}
                >
                  Timer Duration
                </p>
                <p className="mt-1 text-lg sm:text-3xl md:text-4xl font-bold tracking-tight truncate">
                  {selectedMinutes} min
                </p>
              </div>

              <button
                type="button"
                className={`
                  h-12 w-12 sm:h-14 sm:w-14 grid place-items-center rounded-2xl border shadow-sm transition
                  hover:shadow-md active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.05]"
                  }
                `}
                aria-label="Increase time"
              >
                <BiPlus className="text-xl sm:text-2xl" />
              </button>
            </div>
          </div>

          {/* Display / preview */}
          <div
            className={`
              rounded-3xl border shadow-sm p-3 sm:p-4
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Ready To Start
                </p>
                <p className="text-xs sm:text-sm font-semibold">
                  Current selection
                </p>
              </div>

              <div
                className={`
                  grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border shadow-sm flex-shrink-0
                  ${
                    preferences.darkMode
                      ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700"
                  }
                `}
              >
                <MdOutlineTimer className="text-lg sm:text-xl" />
              </div>
            </div>

            <div
              className={`
                mt-4 rounded-3xl border shadow-inner px-3 py-4 sm:px-4 sm:py-5 text-center
                ${
                  preferences.darkMode
                    ? "bg-[#161616]/40 border-white/10"
                    : "bg-black/[0.03] border-black/10"
                }
              `}
            >
              <p
                className={`text-[10px] sm:text-[11px] font-semibold ${
                  preferences.darkMode ? "text-white/45" : "text-slate-500"
                }`}
              >
                Timer will run for
              </p>
              <p className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight break-all">
                00:{String(selectedMinutes).padStart(2, "0")}:00
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className={`
            px-4 py-4 sm:px-5 border-t
            ${
              preferences.darkMode
                ? "border-white/10 bg-[#161616]/70"
                : "border-black/10 bg-white/70"
            }
            backdrop-blur-md
          `}
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <button
              type="button"
              className={`
                flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition
                hover:shadow-md active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10"
                    : "bg-black/[0.03] border border-black/10 text-slate-700 hover:bg-black/[0.05]"
                }
              `}
            >
              <MdClear className="text-lg" />
              Clear
            </button>

            <button
              type="button"
              className={`
                flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition
                hover:shadow-lg active:scale-[0.97]
                bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
              `}
            >
              <BiPlay className="text-lg" />
              Start Timer
            </button>
          </div>

          <p
            className={`mt-3 text-center text-[10px] sm:text-[11px] font-semibold ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            Choose a quick preset or build a custom timer duration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddTimer;
