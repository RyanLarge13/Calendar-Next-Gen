import { useContext, useEffect, useState } from "react";
import { weekDays } from "../../constants.js";
import { AiFillCalendar } from "react-icons/ai";
import { formatDbText, formatTime } from "../../utils/helpers.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import {
  BsAlarmFill,
  BsFillCalendarPlusFill,
  BsStickies,
  BsStickiesFill,
} from "react-icons/bs";

const AgendaView = () => {
  const { view, setEvent } = useContext(InteractiveContext);
  const { events, preferences } = useContext(UserContext);
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
  const [timesForEvents, setTimesForEvents] = useState([]);

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
    const times = dayEvents.map((event) =>
      new Date(event.start.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
    const timesSet = Array.from(new Set(times));
    setTimesForEvents(timesSet);
    setSelectedEvents(dayEvents);
  }, [string]);

  return (
    <div className="p-3">
      <div className="shadow-md rounded-md p-2">
        <div className="flex justify-between items-center mb-2 font-semibold">
          <p className={`py-1 px-2 bg-cyan-100 rounded-md shadow-md`}>
            {theDay.toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <AiFillCalendar
            className={`${preferences.darkMode ? "text-white" : "text-black"}`}
          />
        </div>
        <div className="grid grid-cols-7 place-items-center font-semibold mb-3 gap-3">
          {weekDays.map((day, index) => (
            <p
              key={day}
              className={`${
                index === new Date().getDay() &&
                new Date(dateString).getMonth() === dateObj.getMonth() &&
                new Date(dateString).getYear() === dateObj.getYear()
                  ? "text-cyan-300"
                  : ""
              } ${
                preferences.darkMode ? "text-white" : "text-black"
              } rounded-md shadow-md p-3 w-full text-center`}
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
                  year === dateObj.getFullYear()
                    ? "bg-cyan-100 text-black"
                    : preferences.darkMode
                    ? "text-white"
                    : "text-black"
                } h-20 duration-200 relative w-full rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer`}
              >
                <div
                  className={`text-center text-sm my-1 ${
                    event
                      ? `${event.color} w-[20px] h-[20px] rounded-full shadow-md text-black`
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
        {timesForEvents.map((time, index) => (
          <div key={index} className="my-20">
            <div>
              <p className="mb-5 text-xl font-semibold border-b-cyan-300">
                {time}
              </p>
              <p className="text-semibold ml-5 mt-3">
                In {formatTime(new Date(time))}
              </p>
            </div>
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => {
                if (
                  new Date(event.start.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }) === time
                ) {
                  return (
                    <div
                      key={event.id}
                      className={`p-2 pl-5 rounded-md my-3 bg-white relative shadow-md`}
                      onClick={() => setEvent(event)}
                    >
                      <div
                        className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-md`}
                      ></div>
                      <p className="text-2xl font-semibold">{event.summary}</p>
                      <div className="mt-3">
                        {formatDbText(event.description || "").map(
                          (text, index) => (
                            <p
                              key={index}
                              className="text-[14px] font-semibold"
                            >
                              {text}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <p className="text-xl mt-10 font-semibold">
                You have nothing on your agenda for this day
              </p>
            )}
            <div className="mt-3 flex justify-start items-center gap-x-2">
              <button className="p-3 rounded-md bg-slate-200 hover:bg-slate-300 duration-200">
                <BsFillCalendarPlusFill />
              </button>
              <button className="p-3 rounded-md bg-slate-200 hover:bg-slate-300 duration-200">
                <BsAlarmFill />
              </button>
              <button className="p-3 rounded-md bg-slate-200 hover:bg-slate-300 duration-200">
                <BsStickiesFill />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaView;
