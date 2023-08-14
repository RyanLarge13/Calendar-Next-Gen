import { createContext, useState, useEffect } from "react";
import { weekDays } from "../constants";

const DatesContext = createContext({});

export const DatesProvider = ({ children }) => {
  const dateObj = new Date();
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
  const [columnDays, setColumnDays] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    setLoading(true);
    const updatedDate = new Date();
    updatedDate.setMonth(new Date().getMonth() + nav);
    setDt(updatedDate);
  }, [nav]);

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
    setLoading(false);
    const day = dateObj.getDate();
    const dayOfWeek = dateObj.getDay();
    const end = day + (6 - dayOfWeek) + paddingDays - 1;
    const start = day - dayOfWeek + paddingDays - 1;
    let rowDays = [];
    for (let i = start; i <= end; i++) {
      rowDays.push(i);
    }
    setRowDays(rowDays);
  }, [dateString, paddingDays]);

  useEffect(() => {
    // const today = new Date();
    const currentDay = dateObj.getDay();
    const startOfWeek = new Date(dateObj);
    startOfWeek.setDate(dateObj.getDate() - currentDay);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
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
        openModal,
        theDay,
        currentWeek,
        setCurrentWeek,
        setTheDay,
        setNav,
        setOpenModal,
        setString,
        finish,
        setOpen,
        setDay,
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
