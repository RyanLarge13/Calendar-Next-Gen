import { useContext } from "react";
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
import { tailwindBgToHex } from "../utils/helpers";

const Dashboard = ({ timeOfDay }) => {
  const {
    user,
    upcoming,
    weatherData,
    location,
    reminders,
    userTasks,
    stickies,
  } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { string } = useContext(DatesContext);

  return (
    <motion.div
      initial={{ x: "-5%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-5%", opacity: 0 }}
      className="pt-20 px-2 lg:px-16"
    >
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{timeOfDay},</h1>
        {user.username && (
          <p className="text-xl text-gray-600 mt-1">{user.username}</p>
        )}
      </div>

      {/* Tile Layout */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Upcoming Events */}
        <div className="p-5 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MdOutlineEvent className="text-xl text-cyan-600" />
              Upcoming Events
            </h2>
            <span className="text-xs text-gray-500">
              {upcoming.length} total
            </span>
          </div>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm p-3 relative"
                >
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-cyan-600"
                    onClick={() => setEvent(event)}
                  >
                    <MdOutlineOpenInNew />
                  </button>
                  {event.diff < 1 ? (
                    <p className="text-sm font-semibold text-rose-500">Today</p>
                  ) : event.diff < 2 ? (
                    <p className="text-sm font-semibold text-amber-500">
                      Tomorrow
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      In <span className="font-semibold">{event.diff}</span>{" "}
                      days
                    </p>
                  )}
                  <p className="text-base font-medium mt-1">{event.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">You have no upcoming events</p>
          )}
        </div>

        {/* Reminders */}
        <div className="p-5 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineAccessAlarm className="text-xl text-rose-600" />
            Reminders
          </h2>
          <p className="text-sm text-gray-500">
            Quick glance at your reminders today
          </p>
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders
                .filter((r) => r.time === string)
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-lg shadow-sm p-3 relative"
                  >
                    <p className="absolute top-2 right-2 text-gray-400 hover:text-cyan-600">
                      <MdOutlineAccessAlarm />
                    </p>
                    <p className="text-sm font-semibold text-amber-500">
                      {reminder.title}
                    </p>
                    <p className="text-base font-medium mt-1">
                      {reminder.notes}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">You have no reminders today</p>
          )}
        </div>

        {/* Tasks */}
        <div className="p-5 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineCheckCircle className="text-xl text-emerald-600" />
            Tasks
          </h2>
          <p className="text-sm text-gray-500">
            Stay on top of your to-do list
          </p>
          {userTasks?.length > 0 ? (
            <div className="space-y-3">
              {userTasks
                .filter((t) => t.date === string)
                .map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 my-5 md:mx-3 lg:mx-5 rounded-md shadow-md ${t.color} text-black`}
                  >
                    <tItems t={{ ...t, tasks: t.tasks.slice(0, 5) }} />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">You have no tasks today</p>
          )}
        </div>

        {/* Notes */}
        <div className="p-5 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineStickyNote2 className="text-xl text-amber-600" />
            Notes
          </h2>
          <p className="text-sm text-gray-500">Your latest note</p>
          {stickies?.length > 0 ? (
            <div className="space-y-3">
              <div
                key={stickies[0].id}
                className={`p-3 my-5 md:mx-3 lg:mx-5 rounded-md shadow-md ${stickies[0].color} text-black`}
              >
                <p
                  style={{ color: tailwindBgToHex(stickies[0].color) }}
                  className="font-semibold"
                >
                  {stickies[0].title}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">You have no notes</p>
          )}
        </div>

        {/* Weather */}
        <div className="p-5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-md flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <MdOutlineWbSunny className="text-xl text-indigo-600" />
              Weather
            </h2>
            <div>
              <p className="text-sm text-gray-500">
                {weatherData.current_weather.temperature}°F,{" "}
                {weatherCodeMap[weatherData.current_weather.weathercode].name}
              </p>
            </div>
          </div>
          <img
            src={weatherCodeMap[weatherData.current_weather.weathercode].icon}
            alt={weatherCodeMap[weatherData.current_weather.weathercode].name}
            className="object-cover aspect-square w-20 ml-2 flex-shrink-0"
          />
        </div>

        {/* Location */}
        <div className="p-5 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineLocationOn className="text-xl text-slate-600" />
            Location
          </h2>
          <p className="text-sm text-gray-500">
            {location.city}, {location.state}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
