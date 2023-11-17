import { useContext, useEffect, useState } from "react";
import { weekDays } from "../constants";
import { AiFillCalendar } from "react-icons/ai";
import { formatDbText } from "../utils/helpers.js";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const AgendaView = () => {
  const { view, setEvent } = useContext(InteractiveContext);
  const { events } = useContext(UserContext);
  const {
    month,
    year,
    day,
    dateString,
    dateObj,
    paddingDays,
    daysInMonth,
    setString,
    theDay,
    string,
  } = useContext(DatesContext);

  const [selectedEvents, setSelectedEvents] = useState([]);

  const handleDayClick = (index) => {
    const dayString = `${month + 1}/${index - paddingDays + 1}/${year}`;
    if (view === "month" || view === "agenda") {
      setString(dayString);
    }
  };

  useEffect(() => {
    const dayEvents = events.filter(
      (evnt) =>
        new Date(evnt.date).toLocaleDateString() ===
        new Date(string).toLocaleDateString()
    );
    setSelectedEvents(dayEvents);
  }, [string]);

  return (
    <div className="p-3">
      <div className="shadow-md rounded-md p-2">
        <div className="flex justify-between items-center mb-2 font-semibold">
          <p className="py-1 px-2 bg-cyan-100 rounded-md shadow-md">
            {theDay.toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <AiFillCalendar />
        </div>
        <div className="grid grid-cols-7 place-items-center">
          {weekDays.map((day, index) => (
            <p
              key={day}
              className={`${
                index === new Date().getDay() &&
                new Date(dateString).getMonth() === dateObj.getMonth() &&
                new Date(dateString).getYear() === dateObj.getYear()
                  ? "text-cyan-300"
                  : ""
              }`}
            >
              {day.split("")[0]}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(paddingDays + daysInMonth)].map((_, index) => {
            const dateStr = `${month + 1}/${index - paddingDays + 1}/${year}`;
            const event = events?.find((event) => event.date === dateStr);

            return (
              <div
                onClick={() => handleDayClick(index)}
                key={index}
                className={`${
                  string === `${month + 1}/${index - paddingDays + 1}/${year}`
                    ? "shadow-blue-300 scale-[1.1]"
                    : ""
                } ${
                  index - paddingDays + 1 === day &&
                  month === dateObj.getMonth() &&
                  year === dateObj.getFullYear() &&
                  "bg-cyan-100"
                } duration-200 relative w-full rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer`}
              >
                <div
                  className={`text-center text-sm my-1 ${
                    event
                      ? `${event.color} w-[20px] h-[20px] rounded-full shadow-md`
                      : ""
                  }`}
                >
                  <p>{index >= paddingDays && index - paddingDays + 1}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-10">
        {selectedEvents.length > 0 &&
          selectedEvents.map((event) => (
            <div
              key={event.id}
              className={`${event.color} p-2 rounded-md my-3 shadow-md`}
              onClick={() => setEvent(event)}
            >
              <p className="bg-white p-2 rounded-md shadow-md font-semibold">
                {event.summary}
              </p>
              <p className="bg-white p-2 rounded-md shadow-md bg-opacity-75 mt-2">
                {formatDbText(event.description)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AgendaView;
