import { motion } from "framer-motion";
import { calendarBlocks } from "../motion";
import { holidays, weatherCodes } from "../constants";
import { useContext, useEffect, useState } from "react";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Axios from "axios";
import { Sunny, Cloudy, Windy, Stormy, Rainy, Foggy } from "../assets";

const MonthView = () => {
  const { events } = useContext(UserContext);
  const { setMenu, setShowLogin } = useContext(InteractiveContext);
  const {
    paddingDays,
    daysInMonth,
    month,
    year,
    day,
    rowDays,
    columnDays,
    dateString,
    setOpenModal,
    setString,
  } = useContext(DatesContext);

  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      getInfo(long, lat);
    });
  }, []);

  const getCellStyle = (index) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const isSameMonthAndYear =
      targetDate.getMonth() === currentDate.getMonth() &&
      targetDate.getFullYear() === currentDate.getFullYear();
    if (
      isSameMonthAndYear &&
      (rowDays.includes(index) || columnDays.includes(index))
    ) {
      return { backgroundColor: "rgba(0, 0, 0, 0.1)" };
    } else {
      return { backgroundColor: "#fff" };
    }
  };

  const getInfo = (long, lat) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dayOfWeek = new Date().getDay();
    const start = dayOfWeek - 1;
    const end = 8 - dayOfWeek;
    Axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode&temperature_unit=fahrenheit&past_days=${
        start < 0 ? 0 : start
      }&forecast_days=${end}&timezone=${timeZone}`
    )
      .then((res) => {
        const data = [
          {
            codes: res.data.daily.weathercode,
            dates: res.data.daily.time,
          },
        ];
        setWeatherData(data);
      })
      .catch((err) => console.log(err));
  };

  const getIcon = (weatherCode) => {
    for (const aCode of weatherCodes) {
      if (aCode.codes.includes(weatherCode)) {
        return aCode.icon;
      }
    }
    return null;
  };

  const addEvent = (date) => {
    setMenu(false);
    setShowLogin(false);
    setOpenModal(true);
    setString(date);
  };

  return (
    <>
      {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
        <motion.div
          variants={calendarBlocks}
          onClick={() =>
            index >= paddingDays &&
            addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`)
          }
          key={index}
          style={getCellStyle(index)}
          className={`relative w-full min-h-[12vh] max-h-[15vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start gap-y-1 overflow-hidden cursor-pointer ${
            index - paddingDays + 1 === day &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear() &&
            "shadow-cyan-400 shadow-md"
          }`}
        >
          <div
            className={`text-center text-sm my-1 ${
              index - paddingDays + 1 === day &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear() &&
              "w-[25px] h-[25px] rounded-full bg-cyan-100 shadow-sm"
            }`}
          >
            <p>{index >= paddingDays && index - paddingDays + 1}</p>
          </div>
          {weatherData.length > 0 &&
            weatherData[0].dates.map(
              (time, i) =>
                new Date(time).toLocaleDateString() ===
                  `${month + 1}/${index - paddingDays + 1}/${year}` && (
                  <motion.img
                    key={time}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1 } }}
                    src={
                      getIcon(weatherData[0].codes[i]) === 0
                        ? Sunny
                        : getIcon(weatherData[0].codes[i]) === 1
                        ? Cloudy
                        : getIcon(weatherData[0].codes[i]) === 2
                        ? Rainy
                        : getIcon(weatherData[0].codes[i]) === 3
                        ? Snowy
                        : getIcon(weatherData[0].codes[i]) === 4
                        ? Stormy
                        : getIcon(weatherData[0].codes[i]) === 5
                        ? Foggy
                        : getIcon(weatherData[0].codes[i]) === 6
                        ? Rainy
                        : null
                    }
                    alt="icon"
                    className="absolute top-0 left-0 rounded-md shadow-sm flex justify-center items-center w-[15px] h-[15px] bg-purple-200"
                  />
                )
            )}
          <div className="w-full overflow-y-hidden absolute inset-0 pt-8">
            {[...events, ...holidays].map(
              (event) =>
                new Date(event.date).toLocaleDateString() ===
                  `${month + 1}/${index - paddingDays + 1}/${year}` && (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.8,
                        type: "spring",
                        stiffness: 200,
                      },
                    }}
                    className={`rounded-lg ${event.color} shadow-md p-1 w-[95%] my-1 mx-auto`}
                  >
                    <p
                      className={`whitespace-nowrap text-xs overflow-hidden ${
                        event.color === "bg-black" ? "text-white" : "text-black"
                      }`}
                    >
                      {event.summary}
                    </p>
                  </motion.div>
                )
            )}
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MonthView;
