import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timepicker } from "react-timepicker";
import "react-timepicker/timepicker.css";

const TimeSetter = ({
  setTime,
  setHours,
  setMinutes,
  setATime,
  amPm,
  setAmPm,
  displayTime,
}) => {
  const changeTime = (hours, minutes) => {
    setHours(hours);
    setMinutes(minutes);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={!displayTime ? { y: 0, opacity: 1 } : { y: 1000, opacity: 0 }}
      className="fixed bottom-0 right-0 left-0 bg-white p-5 flex flex-col justify-center items-center shadow-lg"
    >
      <Timepicker
        militaryTime={false}
        hours={12}
        onChange={changeTime}
        size={250}
        radius={100}
      />
      <div className="flex justify-between items-center w-full p-5">
        <button
          onClick={() => setAmPm(false)}
          className={`${
            !amPm ? "from-blue-200 to-blue-300" : "from-gray-200 to-gray-300"
          } p-3 rounded-full shadow-md bg-gradient-to-tr duration-200`}
        >
          AM
        </button>
        <button
          onClick={() => setAmPm(true)}
          className={`${
            amPm ? "from-blue-200 to-blue-300" : "from-gray-200 to-gray-300"
          } p-3 rounded-full shadow-md bg-gradient-to-tr duration-200`}
        >
          PM
        </button>
      </div>
      <div className="flex justify-between items-center w-full">
        <motion.button
          onClick={() => setTime(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-1 mt-5 rounded-md shadow-md bg-gradient-to-tr from-red-400 to-red-200 text-xs"
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={() => setATime()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-1 mt-5 rounded-md shadow-md bg-gradient-to-tr from-green-400 to-green-200 text-xs"
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TimeSetter;
