import { useContext, useState, useEffect } from "react";
import { weekDays } from "../constants";
import DatesContext from "../context/DatesContext";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import UserContext from "../context/UserContext";
import { formatDbText } from "../utils/helpers";

const SideBar = () => {
  const { events, upcoming } = useContext(UserContext);
  const { dateString, dateObj, setString, setTheDay, setNav } =
    useContext(DatesContext);

  const [temporaryNav, setTemporaryNav] = useState(0);
  const [temporaryString, setTemporaryString] = useState(
    new Date().toLocaleDateString()
  );
  const [temporaryDate, setTemporaryDate] = useState(new Date());
  const [change, setChange] = useState(false);
  const [temporaryYear, setTemporaryYear] = useState(
    temporaryDate.getFullYear()
  );
  const [temporaryMonth, setTemporaryMonth] = useState(
    temporaryDate.getMonth()
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
    setChange(true);
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

  const handleDayClick = (index) => {
    setChange(true);
    const dayString = `${temporaryMonth + 1}/${
      index - temporaryPaddingDays + 1
    }/${temporaryYear}`;
    setTemporaryString(dayString);
  };

  const submitChange = () => {
    setNav(temporaryNav);
    setString(temporaryString);
    setTheDay(new Date(temporaryString));
    setChange(false);
  };

  return (
    <div className="hidden xl:block w-[17vw] bg-white max-h-screen scrollbar-hide border-r border-slate-200 fixed top-0 left-0 bottom-0 z-10 p-3 overflow-y-auto scrollbar-hide pt-20">
      <div className="bg-white bg-opacity-80 backdrop-blur-sm sticky top-0 rounded-md p-2">
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
        <div className="shadow-lg rounded-md p-2">
          <div className="flex justify-between items-start mb-3">
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
                    onClick={() => handleDayClick(index)}
                    key={index}
                    className={`${
                      dayNumber === dateObj.getDay() &&
                      temporaryMonth === dateObj.getMonth() &&
                      temporaryYear === dateObj.getFullYear() &&
                      "shadow-red-300"
                    } ${
                      temporaryString ===
                        `${temporaryMonth + 1}/${
                          index - temporaryPaddingDays + 1
                        }/${temporaryYear}` && "shadow-emerald-300"
                    } relative w-full rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 cursor-pointer hover:scale-[1.25] duration-200`}
                  >
                    <div
                      className={`text-center text-sm my-1 ${
                        event
                          ? `${event.color} w-[20px] h-[20px] rounded-full shadow-sm`
                          : ""
                      }`}
                    >
                      <p>{dayNumber > 0 ? dayNumber : ""}</p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        {change && (
          <button
            type="button"
            onClick={() => submitChange()}
            className="px-3 py-2 rounded-md shadow-md mt-5 bg-gradient-to-tr from-cyan-300 to-cyan-100 text-xs font-semibold"
          >
            Submit
          </button>
        )}
      </div>
      <div>
        {upcoming.length > 0 &&
          upcoming.map((event) => (
            <div
              key={event.id}
              className={`${event.color} p-3 rounded-md shadow-md my-5`}
            >
              <p className="mb-2">
                In <span className="text-2xl font-semibold">{event.diff}</span>{" "}
                days
              </p>
              <p className="text-sm bg-white p-2 rounded-md shadow-md font-semibold">
                {event.summary}
              </p>
              <div className="mt-3">
                {formatDbText(event.description || "").map((text, index) => (
                  <p key={index} className="text-[14px]">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
