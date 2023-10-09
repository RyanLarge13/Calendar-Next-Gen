import { useContext, useEffect, useState } from "react";
import { weekDays } from "../constants";
import { AiFillCalendar } from "react-icons/ai";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const AgendaView = () => {
  const { view } = useContext(InteractiveContext);
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
        <div className="flex justify-between items-center mb-2">
          <p>
            {theDay.toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <AiFillCalendar />
        </div>
        <div className="flex justify-between items-center mb-5 mx-20">
          {weekDays.map((day, index) => (
            <p
              key={day}
              className={`${
                index === new Date().getDay() &&
                new Date(dateString).getMonth() === dateObj.getMonth() &&
                new Date(dateString).getYear() === dateObj.getYear()
                  ? "text-cyan-400"
                  : ""
              }`}
            >
              {day.split("")[0]}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(paddingDays + daysInMonth)].map((_, index) => {
            // const dayNumber = index - temporaryPaddingDays + 1;
            const dateStr = `${month + 1}/${index - paddingDays + 1}/${year}`;
            const event = events.find((event) => event.date === dateStr);

            return (
              <div
                onClick={() => handleDayClick(index)}
                key={index}
                className="relative w-full rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer"
              >
                <div
                  className={`text-center text-sm my-1 ${
                    index - paddingDays + 1 === day &&
                    month === dateObj.getMonth() &&
                    year === dateObj.getFullYear() &&
                    "w-[20px] h-[20px] rounded-full bg-cyan-100 shadow-sm"
                  } ${
                    string === `${month + 1}/${index - paddingDays + 1}/${year}`
                      ? "w-[20px] h-[20px] rounded-full bg-red-100 shadow-sm"
                      : ""
                  } ${
                    event
                      ? `${event.color} w-[20px] h-[20px] rounded-full shadow-sm`
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
              className={`${event.color} p-3 rounded-md shadow-md my-3`}
            >
              <p className="bg-white p-2 rounded-md shadow-md">
                {event.summary}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AgendaView;
