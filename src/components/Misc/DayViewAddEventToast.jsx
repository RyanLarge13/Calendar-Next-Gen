import { motion, AnimatePresence } from "framer-motion";

const DayViewAddEventToast = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 
        z-50 w-[90%] max-w-md 
        p-4 rounded-2xl shadow-lg border
        bg-white/90 backdrop-blur-md border-gray-200 text-gray-900
        dark:bg-[#1e1e1e]/90 dark:border-gray-700 dark:text-gray-100"
      >
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Create an event from
        </p>
        <p className="text-base font-semibold">
          <span className="text-cyan-600 dark:text-cyan-400">
            {new Date(
              `${theDay.toDateString()} ${findTime(times[0])}`
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>{" "}
          –{" "}
          <span className="text-cyan-600 dark:text-cyan-400">
            {new Date(
              `${theDay.toDateString()} ${findTime(times[times.length - 1])}`
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>{" "}
          on{" "}
          <span className="text-amber-600 dark:text-amber-400">
            {new Date(theDay).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => createEvent()}
            className="px-4 py-2 rounded-xl font-medium shadow-sm 
            bg-gradient-to-tr from-cyan-400 to-sky-500 text-white 
            hover:scale-105 transition"
          >
            Yes, Create
          </button>
          <button
            onClick={() => setTimes([])}
            className="px-4 py-2 rounded-xl font-medium shadow-sm 
            bg-gradient-to-tr from-rose-400 to-pink-500 text-white 
            hover:scale-105 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DayViewAddEventToast;
