import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import DatesContext from "../context/DatesContext";

const TimeSetter = ({ setWhen, setReminderTimeString }) => {
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
      return new Date(year, month, day, hours, minutes).toString();
    };
    setReminderTimeString(formattedDateString);
    setWhen(dateTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <TimePicker
        className="w-full"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        onAccept={(ISODate) => calcValues(ISODate)}
      />
    </motion.div>
  );
};

export default TimeSetter;
