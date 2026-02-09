import { useContext, useEffect, useState } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { weekDays } from "../../constants/dateAndTimeConstants";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";

const SideBar = () => {
  const { events, upcoming, preferences } = useContext(UserContext);
  const { dateString, dateObj, setString, setTheDay, setNav } =
    useContext(DatesContext);
  const { setEvent } = useContext(InteractiveContext);

  const [temporaryNav, setTemporaryNav] = useState(0);
  const [temporaryString, setTemporaryString] = useState(
    new Date().toLocaleDateString(),
  );
  const [temporaryDate, setTemporaryDate] = useState(new Date());
  const [temporaryYear, setTemporaryYear] = useState(
    temporaryDate.getFullYear(),
  );
  const [temporaryMonth, setTemporaryMonth] = useState(
    temporaryDate.getMonth(),
  );
  const [temporaryPaddingDays, setTemporaryPaddingDays] = useState(0);
  const [temporaryDaysInMonth, setTemporaryDaysInMonth] = useState(0);

  useEffect(() => {
    const firstDayOfMonth = new Date(temporaryYear, temporaryMonth, 1);
    const lastDayOfMonth = new Date(temporaryYear, temporaryMonth + 1, 0);
    const tempPaddingDays = firstDayOfMonth.getDay();
    const tempDaysInMonth = lastDayOfMonth.getDate();
    setTemporaryPaddingDays(tempPaddingDays);
    setTemporaryDaysInMonth(tempDaysInMonth);
  }, [temporaryYear, temporaryMonth]);

  useEffect(() => {
    const currentDate = new Date();
    setTemporaryMonth(currentDate.getMonth());
    setTemporaryYear(currentDate.getFullYear());
  }, []);

  const handleMonthYearChange = (operand) => {
    let newMonth = temporaryMonth;
    let newYear = temporaryYear;
    if (operand === "minus") {
      setTemporaryNav((prev) => prev - 1);
      newMonth = temporaryMonth - 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = temporaryYear - 1;
      }
    } else if (operand === "plus") {
      setTemporaryNav((prev) => prev + 1);
      newMonth = temporaryMonth + 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = temporaryYear + 1;
      }
    }
    const updatedTemporaryDate = new Date(newYear, newMonth);
    setTemporaryDate(updatedTemporaryDate);
    setTemporaryMonth(newMonth);
    setTemporaryYear(newYear);
    const firstDayOfMonth = new Date(newYear, newMonth, 1);
    const lastDayOfMonth = new Date(newYear, newMonth + 1, 0);
    const tempPaddingDays = firstDayOfMonth.getDay();
    const tempDaysInMonth = lastDayOfMonth.getDate();
    const dayString = updatedTemporaryDate.toLocaleDateString();
    setTemporaryString(dayString);
    setTemporaryPaddingDays(tempPaddingDays);
    setTemporaryDaysInMonth(tempDaysInMonth);
  };

  const submitChange = (index) => {
    const dayString = `${temporaryMonth + 1}/${
      index - temporaryPaddingDays + 1
    }/${temporaryYear}`;
    setNav(temporaryNav);
    setString(dayString);
    setTheDay(new Date(temporaryString));
  };

  return (
    <div
      className={`hidden xl:block ${
        preferences.darkMode ? "bg-[#222] border-none" : "bg-white"
      } max-h-screen scrollbar-hide w-[20vw] border-slate-200 overflow-y-auto relative pt-[70px]`}
    >
      <div
        className={`${
          preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
        } rounded-b-md shadow-lg sticky top-0 pt-5 z-[1]`}
      >
        <div className="flex justify-between items-center px-3 mb-3">
          <BsFillArrowLeftCircleFill
            onClick={() => handleMonthYearChange("minus")}
            className="cursor-pointer"
          />
          <p>
            {temporaryDate.toLocaleDateString("en-us", {
              month: "short",
              year: "numeric",
            })}
          </p>
          <BsFillArrowRightCircleFill
            onClick={() => handleMonthYearChange("plus")}
            className="cursor-pointer"
          />
        </div>
        <div className="pl-3 p-2">
          <div className="grid grid-cols-7 place-items-center mb-3">
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
            {[...Array(temporaryPaddingDays + temporaryDaysInMonth)].map(
              (_, index) => {
                const dayNumber = index - temporaryPaddingDays + 1;
                const dateStr = `${
                  temporaryMonth + 1
                }/${dayNumber}/${temporaryYear}`;
                const event = events?.find((event) => event.date === dateStr);

                return (
                  <div
                    onClick={() => submitChange(index)}
                    key={index}
                    className={`${
                      temporaryString ===
                        `${temporaryMonth + 1}/${
                          index - temporaryPaddingDays + 1
                        }/${temporaryYear}` && "shadow-emerald-300"
                    } relative w-full rounded-sm ${
                      preferences.darkMode
                        ? "shadow-slate-700"
                        : "shadow-slate-200"
                    } shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer hover:scale-[1.2] duration-100`}
                  >
                    <div
                      className={`text-center text-sm my-1 ${
                        event
                          ? `${event.color} w-[20px] h-[20px] rounded-full shadow-md text-black`
                          : preferences.darkMode
                            ? "text-white"
                            : "text-black"
                      }`}
                    >
                      <p>{dayNumber > 0 ? dayNumber : ""}</p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
      <div className="px-3">
        {upcoming.length > 0 &&
          upcoming.map((event) => (
            <div
              key={event.id}
              onClick={() => setEvent(event)}
              className={`${
                preferences.darkMode ? "text-white" : "text-black"
              } p-3 rounded-xl shadow-lg my-5 relative hover:scale-[1.01] cursor-pointer duration-200 hover:shadow-xl will-change-transform pl-5`}
            >
              <div
                className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-l-md`}
              ></div>
              {event.diff < 1 && event.diff >= 0 ? (
                <p className="text-2xl font-semibold mb-2">Today</p>
              ) : event.diff >= 1 && event.diff < 2 ? (
                <p className="text-2xl font-semibold mb-2">Tomorrow</p>
              ) : (
                <p className="mb-2">
                  In{" "}
                  <span className="text-2xl font-semibold">{event.diff}</span>{" "}
                  days
                </p>
              )}
              <p className="text-sm font-semibold truncate mt-3 mb-1">
                {event.summary}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                {event.start?.startTime
                  ? new Date(event.start.startTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    ) + "-"
                  : "All Day Event"}{" "}
                {event.end?.endTime
                  ? new Date(event.end.endTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
              <div className="text-xs leading-snug text-gray-700 whitespace-pre-wrap">
                <p>{event.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
