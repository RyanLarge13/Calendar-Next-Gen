import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const TimeSetter = ({ selectedDate }) => {
  const [value, setValue] = useState(null);
  const [dateString, setDateString] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);

  const calcValues = (ISODate) => {
    const formattedDate = new Date(ISODate);
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const formattedDateString = () => {
      return `${hours > 12 ? hours % 12 : hours === 0 ? "12" : hours}:${
        minutes <= 9 ? "0" + minutes : minutes
      } ${hours >= 12 ? "PM" : "AM"}`;
    };
    setDateString(formattedDateString);
    const dateTime = () => {
      const currentDate = new Date(selectedDate);
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      return new Date(year, month, day, hours, minutes).toString();
    };
    setReminderTime(dateTime);
  };

  return (
    <div>
      <TimePicker value={value} onAccept={(ISODate) => calcValues(ISODate)} />
    </div>
  );
};

export default TimeSetter;
