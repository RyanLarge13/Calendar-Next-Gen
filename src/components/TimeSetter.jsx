import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import DatesContext from "../context/DatesContext";

const TimeSetter = ({ setDateTime, setDateTimeString, closePicker }) => {
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
    setDateTimeString(formattedDateString);
    setDateTime(dateTime);
    closePicker(false);
  };

  return (
    <StaticTimePicker
      className="w-full fixed bottom-0 right-0 left-0"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      onAccept={(ISODate) => calcValues(ISODate)}
      onClose={() => closePicker(false)}
    />
  );
};

export default TimeSetter;
