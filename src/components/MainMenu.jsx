import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdOutlineEvent,
  MdOutlineCheckCircle,
  MdOutlineStickyNote2,
  MdOutlineAccessAlarm,
  MdOutlineOpenInNew,
  MdOutlineLocationOn,
  MdOutlineWbSunny,
} from "react-icons/md";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import weatherCodeMap from "../utils/weatherCodes";
import DatesContext from "../context/DatesContext";
import TaskItems from "./TaskItems";
import { tailwindBgToHex } from "../utils/helpers";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = ({ timeOfDay }) => {
  const {
    user,
    upcoming,
    weatherData,
    location,
    reminders,
    userTasks,
    stickies,
    preferences,
  } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { string, theDay } = useContext(DatesContext);

  const [todaysReminders, setTodaysReminders] = useState([]);

  useEffect(() => {
    const todaysReminders = reminders.filter(
      (r) =>
        new Date(r.time).toLocaleDateString() === theDay.toLocaleDateString(),
    );

    setTodaysReminders(todaysReminders);
  }, [reminders]);

  return (
    <motion.div
      initial={{ x: "-5%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-5%", opacity: 0 }}
      className="pt-24 px-3 sm:px-6 lg:px-10"
    >
      {/* Centered container so desktop doesn't look stretched */}
      <div className="mx-auto max-w-6xl">
        {/* Greeting / Hero */}
        <div
          className={`
        rounded-3xl border shadow-2xl backdrop-blur-md
        px-5 py-5 sm:px-6 sm:py-6
        ${
          preferences.darkMode
            ? "bg-[#161616]/90 border-white/10 text-white"
            : "bg-white/90 border-black/10 text-slate-900"
        }
      `}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {timeOfDay},
              </h1>
              {user.username && (
                <p
                  className={`text-base sm:text-lg mt-1 ${
                    preferences.darkMode ? "text-white/70" : "text-slate-600"
                  }`}
                >
                  {user.username}
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-2">
              <div
                className={`
              rounded-2xl border px-3 py-2 text-sm font-semibold
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/80"
                  : "bg-black/[0.03] border-black/10 text-slate-700"
              }
            `}
              >
                <span className="opacity-70 mr-2">Upcoming</span>
                {upcoming.length}
              </div>
              <div
                className={`
              rounded-2xl border px-3 py-2 text-sm font-semibold
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/80"
                  : "bg-black/[0.03] border-black/10 text-slate-700"
              }
            `}
              >
                <span className="opacity-70 mr-2">Reminders</span>
                {todaysReminders.length}
              </div>
              <div
                className={`
              rounded-2xl border px-3 py-2 text-sm font-semibold
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/80"
                  : "bg-black/[0.03] border-black/10 text-slate-700"
              }
            `}
              >
                <span className="opacity-70 mr-2">Notes</span>
                {stickies?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-6 grid grid-cols-12 gap-4">
          {/* Upcoming Events (wide) */}
          <div
            className={`
          col-span-12 lg:col-span-7
          rounded-3xl border shadow-sm transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            <div
              className={`flex justify-between items-center px-5 py-4 border-b ${
                preferences.darkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span
                  className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
                }
              `}
                >
                  <MdOutlineEvent className="text-lg" />
                </span>
                Upcoming Events
              </h2>
              <span
                className={`text-xs font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                {upcoming.length} total
              </span>
            </div>

            <div className="p-5">
              {upcoming.length > 0 ? (
                <div className="space-y-2">
                  {upcoming.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`
                    relative rounded-2xl border px-4 py-3 shadow-sm transition
                    ${
                      preferences.darkMode
                        ? "border-white/10 bg-white/5 hover:bg-white/7"
                        : "border-black/10 bg-white hover:bg-black/[0.02]"
                    }
                  `}
                    >
                      <button
                        className={`
                      absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                      ${
                        preferences.darkMode
                          ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-cyan-200"
                          : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-500 hover:text-cyan-600"
                      }
                    `}
                        onClick={() => setEvent(event)}
                        aria-label="Open event"
                      >
                        <MdOutlineOpenInNew />
                      </button>

                      {event.diff < 1 ? (
                        <p className="text-xs font-semibold text-rose-500">
                          Today
                        </p>
                      ) : event.diff < 2 ? (
                        <p className="text-xs font-semibold text-amber-500">
                          Tomorrow
                        </p>
                      ) : (
                        <p
                          className={`text-xs ${
                            preferences.darkMode
                              ? "text-white/55"
                              : "text-slate-500"
                          }`}
                        >
                          In <span className="font-semibold">{event.diff}</span>{" "}
                          days
                        </p>
                      )}

                      <p className="text-sm font-semibold mt-1 pr-12">
                        {event.summary}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    preferences.darkMode ? "text-white/55" : "text-slate-500"
                  }`}
                >
                  You have no upcoming events
                </p>
              )}
            </div>
          </div>

          {/* Weather + Location (stacked) */}
          <div className="col-span-12 lg:col-span-5 grid gap-4">
            {/* Weather */}
            <div
              className={`
            rounded-3xl border shadow-sm transition-all
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 hover:bg-white/7"
                : "bg-white border-black/10 hover:bg-black/[0.02]"
            }
          `}
            >
              <div
                className={`flex justify-between items-center px-5 py-4 border-b ${
                  preferences.darkMode ? "border-white/10" : "border-black/10"
                }`}
              >
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <span
                    className={`
                  grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700"
                  }
                `}
                  >
                    <MdOutlineWbSunny className="text-lg" />
                  </span>
                  Weather
                </h2>
              </div>

              <div className="p-5 flex justify-between items-start gap-3">
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      preferences.darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {weatherData?.current_weather?.temperature || 0}°F
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      preferences.darkMode ? "text-white/60" : "text-slate-500"
                    }`}
                  >
                    {weatherCodeMap[weatherData?.current_weather?.weathercode]
                      ?.name || ""}
                  </p>
                </div>

                <img
                  src={
                    weatherCodeMap[weatherData?.current_weather?.weathercode]
                      ?.icon
                  }
                  alt={
                    weatherCodeMap[weatherData?.current_weather?.weathercode]
                      ?.name
                  }
                  className="object-contain aspect-square w-16 sm:w-20 flex-shrink-0"
                />
              </div>
            </div>

            {/* Location */}
            <div
              className={`
            rounded-3xl border shadow-sm transition-all
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 hover:bg-white/7"
                : "bg-white border-black/10 hover:bg-black/[0.02]"
            }
          `}
            >
              <div
                className={`flex justify-between items-center px-5 py-4 border-b ${
                  preferences.darkMode ? "border-white/10" : "border-black/10"
                }`}
              >
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <span
                    className={`
                  grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-slate-500/15 border-white/10 text-white/80"
                      : "bg-slate-50 border-black/10 text-slate-700"
                  }
                `}
                  >
                    <MdOutlineLocationOn className="text-lg" />
                  </span>
                  Location
                </h2>
              </div>

              <div className="p-5">
                <p
                  className={`text-sm font-semibold ${
                    preferences.darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {location.city}, {location.state}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    preferences.darkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Based on your selected location
                </p>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div
            className={`
          col-span-12 lg:col-span-6
          rounded-3xl border shadow-sm transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            <div
              className={`flex justify-between items-center px-5 py-4 border-b ${
                preferences.darkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span
                  className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "bg-rose-500/15 border-rose-300/20 text-rose-100"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }
              `}
                >
                  <MdOutlineAccessAlarm className="text-lg" />
                </span>
                Reminders
              </h2>
              <span
                className={`text-xs font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                {todaysReminders.length} today
              </span>
            </div>

            <div className="p-5">
              <p
                className={`text-xs mb-3 ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Quick glance at your reminders today
              </p>

              {todaysReminders.length > 0 ? (
                <div className="space-y-2">
                  {todaysReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`
                    rounded-2xl border px-4 py-3 shadow-sm
                    ${
                      preferences.darkMode
                        ? "border-white/10 bg-white/5"
                        : "border-black/10 bg-white"
                    }
                  `}
                    >
                      <p className="text-sm font-semibold">{reminder.title}</p>
                      <p
                        className={`text-xs mt-1 ${
                          preferences.darkMode
                            ? "text-white/60"
                            : "text-slate-500"
                        }`}
                      >
                        {reminder.notes}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    preferences.darkMode ? "text-white/55" : "text-slate-500"
                  }`}
                >
                  You have no reminders today
                </p>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div
            className={`
          col-span-12 lg:col-span-6
          rounded-3xl border shadow-sm transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            <div
              className={`flex justify-between items-center px-5 py-4 border-b ${
                preferences.darkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span
                  className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }
              `}
                >
                  <MdOutlineCheckCircle className="text-lg" />
                </span>
                Tasks
              </h2>
            </div>

            <div className="p-5">
              <p
                className={`text-xs mb-3 ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Stay on top of your to-do list
              </p>

              {userTasks?.length > 0 ? (
                <div
                  className={`
                  rounded-2xl p-2 border shadow-sm overflow-hidden
                  ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}
                `}
                >
                  <TaskItems
                    task={userTasks[0]}
                    styles={"p-2 max-h-64 overflow-y-auto scrollbar-hide"}
                  />
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    preferences.darkMode ? "text-white/55" : "text-slate-500"
                  }`}
                >
                  You have no tasks today
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div
            className={`
          col-span-12
          rounded-3xl border shadow-sm transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            <div
              className={`flex justify-between items-center px-5 py-4 border-b ${
                preferences.darkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span
                  className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                }
              `}
                >
                  <MdOutlineStickyNote2 className="text-lg" />
                </span>
                Notes
              </h2>
              <span
                className={`text-xs font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Latest
              </span>
            </div>

            <div className="p-5">
              {stickies?.length > 0 ? (
                <div
                  className={`
                rounded-2xl border shadow-sm p-4
                ${
                  preferences.darkMode
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-white"
                }
              `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{stickies[0].title}</p>
                    <span
                      className={`${stickies[0].color} h-3.5 w-3.5 rounded-full ring-1 ring-black/10`}
                    />
                  </div>

                  <div
                    className={`mt-3 text-sm leading-relaxed ${
                      preferences.darkMode ? "text-white/70" : "text-slate-600"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: stickies[0].body.slice(0, 240) + "...",
                    }}
                  />
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    preferences.darkMode ? "text-white/55" : "text-slate-500"
                  }`}
                >
                  You have no notes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
