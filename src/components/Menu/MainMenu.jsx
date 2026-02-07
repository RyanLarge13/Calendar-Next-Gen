import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  MdOutlineAccessAlarm,
  MdOutlineCheckCircle,
  MdOutlineEvent,
  MdOutlineLocationOn,
  MdOutlineOpenInNew,
  MdOutlineStickyNote2,
  MdOutlineWbSunny,
} from "react-icons/md";
import { weekDays } from "../../constants";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { tailwindBgToHex } from "../../utils/helpers";
import weatherCodeMap from "../../utils/weatherCodes";
import StickyBody from "../Stickies/StickyBody";
import TaskItems from "../Tasks/TaskItems";

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

  const weekday = new Date().getDay();
  const newWeekdays = weekDays
    .slice(weekday, weekDays.length)
    .concat(weekDays.slice(0, weekday));

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
            rounded-3xl border shadow-sm transition-all min-w-0
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
                  className="object-contain aspect-square w-16 sm:w-20 flex-shrink-0 mt-[-20px]"
                />
              </div>

              {/* 7-day outlook */}
              <div className="min-w-0 w-full">
                {/* Header row */}
                <div className="flex items-end justify-between gap-3 mb-3 px-5">
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] font-semibold tracking-wide ${
                        preferences.darkMode
                          ? "text-white/60"
                          : "text-slate-500"
                      }`}
                    >
                      Weather
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight truncate">
                      7-day outlook
                    </h3>
                  </div>

                  <div
                    className={`
        flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-2xl border shadow-sm
        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
      `}
                  >
                    {location?.city}, {location?.state}
                  </div>
                </div>

                {/* Outer shell (NO horizontal scroll here) */}
                <div
                  className={`
      mx-5 mb-5
      rounded-3xl border shadow-2xl overflow-hidden
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white/85 border-black/10"}
      backdrop-blur-md
      min-w-0
    `}
                >
                  <div className="px-4 py-4 min-w-0">
                    {/* ✅ The ONLY horizontal scroller */}
                    <div className="min-w-0 overflow-x-auto scrollbar-slick pt-2 pb-3 px-2">
                      <div className="flex gap-3 w-max pr-2">
                        {weatherData?.daily &&
                          newWeekdays.map((d, i) => {
                            const {
                              precipitation_probability_mean,
                              sunrise,
                              sunset,
                              temperature_2m_max,
                              temperature_2m_min,
                              time,
                              weathercode,
                              uv_index_max,
                              windspeed_10m_max,
                            } = weatherData.daily;

                            const code = weathercode?.[i];
                            const icon = weatherCodeMap?.[code]?.icon;
                            const name = weatherCodeMap?.[code]?.name;

                            const dateStr = time?.[i]
                              ? new Date(time[i + 1]).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "";

                            const sunRiseStr = sunrise?.[i]
                              ? new Date(sunrise[i]).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )
                              : "--";

                            const sunSetStr = sunset?.[i]
                              ? new Date(sunset[i]).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )
                              : "--";

                            return (
                              <button
                                key={`${d}-${i}`}
                                type="button"
                                className={`
                  group flex-shrink-0
                  w-[220px] sm:w-[230px]
                  rounded-3xl border shadow-sm overflow-hidden
                  transition-all duration-200
                  hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                  ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
                `}
                              >
                                {/* Top strip */}
                                <div
                                  className={`
                    px-4 pt-4 pb-3
                    border-b
                    ${preferences.darkMode ? "border-white/10" : "border-black/10"}
                    flex items-start justify-between gap-3
                  `}
                                >
                                  <div className="min-w-0 text-left">
                                    <p className="text-sm font-semibold truncate">
                                      {d}
                                    </p>
                                    <p
                                      className={`text-[11px] font-semibold ${
                                        preferences.darkMode
                                          ? "text-white/55"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {dateStr}
                                    </p>

                                    <p
                                      className={`mt-2 text-[11px] font-semibold line-clamp-2 ${
                                        preferences.darkMode
                                          ? "text-white/60"
                                          : "text-slate-500"
                                      }`}
                                      title={name || ""}
                                    >
                                      {name || "—"}
                                    </p>
                                  </div>

                                  <div
                                    className={`
                      grid place-items-center h-12 w-12 rounded-2xl border shadow-sm flex-shrink-0
                      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
                    `}
                                  >
                                    {icon ? (
                                      <img
                                        src={icon}
                                        alt={name || "weather"}
                                        className="h-8 w-8 object-contain"
                                      />
                                    ) : (
                                      <span
                                        className={`text-xs font-semibold ${
                                          preferences.darkMode
                                            ? "text-white/60"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        --
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Body */}
                                <div className="px-4 py-4 text-left space-y-3">
                                  {/* High / Low */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div
                                      className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                      `}
                                    >
                                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                                      High{" "}
                                      <span className="font-bold">
                                        {Math.round(
                                          temperature_2m_max?.[i] ?? 0,
                                        )}
                                        °
                                      </span>
                                    </div>

                                    <div
                                      className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                      `}
                                    >
                                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                      Low{" "}
                                      <span className="font-bold">
                                        {Math.round(
                                          temperature_2m_min?.[i] ?? 0,
                                        )}
                                        °
                                      </span>
                                    </div>
                                  </div>

                                  {/* Chips */}
                                  <div className="flex flex-wrap gap-2">
                                    <div
                                      className={`
                        px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                      `}
                                    >
                                      💧{" "}
                                      {Math.round(
                                        precipitation_probability_mean?.[i] ??
                                          0,
                                      )}
                                      %
                                    </div>

                                    <div
                                      className={`
                        px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                      `}
                                    >
                                      UV {Math.round(uv_index_max?.[i] ?? 0)}
                                    </div>

                                    <div
                                      className={`
                        px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                        ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                      `}
                                    >
                                      🌬{" "}
                                      {Math.round(windspeed_10m_max?.[i] ?? 0)}{" "}
                                      mph
                                    </div>
                                  </div>

                                  {/* Sunrise / Sunset */}
                                  <div
                                    className={`
                      rounded-2xl border shadow-inner px-3 py-2
                      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
                      flex items-center justify-between
                    `}
                                  >
                                    <div>
                                      <p
                                        className={`text-[10px] font-semibold ${
                                          preferences.darkMode
                                            ? "text-white/55"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        Sunrise
                                      </p>
                                      <p className="text-xs font-semibold">
                                        {sunRiseStr}
                                      </p>
                                    </div>
                                    <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
                                    <div className="text-right">
                                      <p
                                        className={`text-[10px] font-semibold ${
                                          preferences.darkMode
                                            ? "text-white/55"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        Sunset
                                      </p>
                                      <p className="text-xs font-semibold">
                                        {sunSetStr}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <p
                      className={`mt-3 text-[11px] ${
                        preferences.darkMode
                          ? "text-white/55"
                          : "text-slate-500"
                      }`}
                    >
                      Tip: swipe sideways to scroll the week.
                    </p>
                  </div>
                </div>
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

            <div className="">
              {stickies?.length > 0 ? (
                <div
                  className={`
                rounded-2xl border shadow-sm
                ${
                  preferences.darkMode
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-white"
                }
              `}
                >
                  <div className="flex items-start justify-between gap-3 py-2 px-3">
                    {/* Title */}
                    <input
                      defaultValue={stickies[0].title}
                      className={`
                                                w-full mt-1 bg-transparent
                                                text-lg font-semibold tracking-tight
                                                outline-none
                                                border-b pb-2
                                                ${preferences.darkMode ? "border-white/10 text-white placeholder:text-white/50" : "border-black/10 text-slate-900 placeholder:text-slate-400"}
                                              `}
                      style={{ caretColor: tailwindBgToHex(stickies[0].color) }}
                      placeholder="Title…"
                    />
                    {/* <p className="text-sm font-semibold">{stickies[0].title}</p> */}
                    <span
                      className={`${stickies[0].color} h-3.5 mt-3 w-3.5 rounded-full ring-1 ring-black/10`}
                    />
                  </div>

                  <div className="max-h-[700px] overflow-y-auto scrollbar-slick">
                    <StickyBody sticky={stickies[0]} />
                  </div>
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
