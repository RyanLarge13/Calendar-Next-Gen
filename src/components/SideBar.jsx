import { useContext } from "react";
import { weekDays } from "../constants";
import DatesContext from "../context/DatesContext";
import { AiFillCalendar } from "react-icons/ai";
import InteractiveContext from "../context/InteractiveContext";

const SideBar = () => {
  const { view } = useContext(InteractiveContext);
  const {
    month,
    year,
    day,
    dateString,
    dateObj,
    paddingDays,
    daysInMonth,
    dt,
    setString,
    string,
  } = useContext(DatesContext);

  const handleDayClick = (index) => {
    const dayString = `${month + 1}/${index - paddingDays + 1}/${year}`;
    if (view === "month") {
      setString(dayString);
    }
  };

  return (
    <div className="hidden xl:block w-[14vw] bg-white h-screen p-3 pt-20 overflow-y-auto border-r border-slate-200">
      <div className="flex gap-x-2 justify-start items-end mb-10">
        <img
          src="/favicon.svg"
          alt="logo"
          width={35}
          height={35}
          className="rounded-md shadow-md"
        />
        <p className="text-xl">CNG</p>
      </div>
      <div className="flex justify-between items-center">
        <p>
          {dt.toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <AiFillCalendar />
      </div>
      <div className="shadow-md rounded-md p-1">
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
          {[...Array(paddingDays + daysInMonth)].map((_, index) => (
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
                }`}
              >
                <p>{index >= paddingDays && index - paddingDays + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
