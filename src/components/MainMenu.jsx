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

const Dashboard = ({ timeOfDay }) => {
  const { user, upcoming } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ x: "-5%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-5%", opacity: 0 }}
      className="pt-20 px-3 lg:px-16"
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
            Quick glance at your reminders
          </p>
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
        </div>

        {/* Notes */}
        <div className="p-5 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineStickyNote2 className="text-xl text-amber-600" />
            Notes
          </h2>
          <p className="text-sm text-gray-500">
            Jot down thoughts & ideas quickly
          </p>
        </div>

        {/* Weather */}
        <div className="p-5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineWbSunny className="text-xl text-indigo-600" />
            Weather
          </h2>
          <p className="text-sm text-gray-500">72°F, Partly Cloudy</p>
        </div>

        {/* Location */}
        <div className="p-5 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <MdOutlineLocationOn className="text-xl text-slate-600" />
            Location
          </h2>
          <p className="text-sm text-gray-500">New York, USA</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
