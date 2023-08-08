import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import DatesContext from "../context/DatesContext";

const TimeSetter = ({ setDateTime, setDateTimeString, openTimeSetter }) => {
  const { string } = useContext(DatesContext);

  const [value, setValue] = useState(null);

  const calcValues = (ISODate) => {
    const formattedDate = new Date(ISODate);
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const formattedDateString = () => {
      return `${hours > 12 ? hours % 12 : hours === 0 ? "12" : hours}:${
        minutes <= 9 ? "0" + minutes : minutes
      } ${hours >= 12 ? "PM" : "AM"}`;
    };
    const dateTime = () => {
      const currentDate = new Date(string);
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      // console.log(new Date(year, month, day, hours, minutes).toString());
      return new Date(year, month, day, hours, minutes).toString();
    };
    setDateTimeString(formattedDateString);
    setDateTime(dateTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, bottom: "-100%" }}
      animate={{ opacity: 1, bottom: 0 }}
      className="fixed right-0 bottom-0 left-0 w-full z-[150] isolate overflow-hidden rounded-t-md"
    >
      <div className="py-2 px-5 flex justify-between items-center bg-white">
        <button onClick={() => openTimeSetter(false)}>close</button>
        <button
          onClick={() => {
            setDateTime(null);
            setDateTimeString("");
            setValue(null);
          }}
        >
          clear
        </button>
      </div>
      <StaticTimePicker
        value={value}
        onChange={(newValue) => setValue(newValue)}
        onAccept={(ISODate) => calcValues(ISODate)}
        //onClose={() => openTimeSetter(false)}
        className=""
      />
    </motion.div>
  );
};

export default TimeSetter;
