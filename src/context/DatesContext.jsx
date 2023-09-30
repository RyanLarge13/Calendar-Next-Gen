import { createContext, useState, useEffect } from "react";
import { weekDays } from "../constants";

const DatesContext = createContext({});

export const DatesProvider = ({ children }) => {
  const dateObj = new Date();
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(dt.getMonth());
  const [year, setYear] = useState(dt.getFullYear());
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    new Date(year, month, 1)
  );
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(year, month + 1, 0).getDate()
  );
  const [dateString, setDateString] = useState(``);
  const [paddingDays, setPaddingDays] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [string, setString] = useState("");
  const [theDay, setTheDay] = useState(new Date());
  const [rowDays, setRowDays] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [updatedDate, setUpdatedDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    const newDate = new Date(updatedDate);
    newDate.setMonth(newDate.getMonth() + nav);
    setDt(newDate);
  }, [nav, updatedDate]);

  const finish = (e, info) => {
    const dragDistance = info.offset.x;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setNav((prev) => prev - 1);
    } else if (dragDistance < -cancelThreshold) {
      setNav((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setMonth(dt.getMonth());
    setYear(dt.getFullYear());
  }, [dt]);

  useEffect(() => {
    setFirstDayOfMonth(new Date(year, month, 1));
    setDaysInMonth(new Date(year, month + 1, 0).getDate());
  }, [year, month]);

  useEffect(() => {
    setDateString(
      firstDayOfMonth.toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    );
  }, [firstDayOfMonth]);

  useEffect(() => {
    setPaddingDays(weekDays.indexOf(dateString.split(", ")[0]));
  }, [dateString]);

  useEffect(() => {
    setLoading(false);
    const day = dateObj.getDate();
    const dayOfWeek = dateObj.getDay();
    const start = day - dayOfWeek + paddingDays - 1;
    setRowDays(Array.from({ length: 7 }, (_, i) => start + i));
  }, [paddingDays]);

  useEffect(() => {
    const currentDay = dateObj.getDay();
    const startOfWeek = new Date(dateObj);
    startOfWeek.setDate(dateObj.getDate() - currentDay);

    const week = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
    setCurrentWeek(week);
  }, []);

  return (
    <DatesContext.Provider
      value={{
        dt,
        loading,
        paddingDays,
        daysInMonth,
        month,
        year,
        day,
        string,
        nav,
        openModal,
        theDay,
        currentWeek,
        setNav,
        setCurrentWeek,
        setTheDay,
        setOpenModal,
        setString,
        setDt,
        setUpdatedDate,
        finish,
        setDay,
        setMonth,
        setYear,
        dateString,
        rowDays,
        dateObj,
      }}
    >
      {children}
    </DatesContext.Provider>
  );
};

export default DatesContext;
