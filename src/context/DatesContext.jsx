import { createContext, useState, useEffect } from "react";
import { weekDays } from "../constants";

const DatesContext = createContext({});

export const DatesProvider = ({ children }) => {
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [diff, setDiff] = useState(0);
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

  useEffect(() => {
    const difference = end - start;
    setDiff(difference);
  }, [end]);

  const moveCalendar = (e) => {
    if (open) return;
    setEnd(e.touches[0].clientX);
  };

  const finish = () => {
    if (diff < -120) {
      setNav((prev) => prev + 1);
    }
    if (diff > 120) {
      setNav((prev) => prev - 1);
    }
    setTimeout(() => {
      setStart(null);
      setEnd(null);
      setDiff(0);
    }, 100);
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
    const day = new Date().getDate();
    const dayOfWeek = new Date().getDay();
    const end = day + (6 - dayOfWeek) + paddingDays - 1;
    const start = day - dayOfWeek + paddingDays - 1;
    let rowDays = [];
    for (let i = start; i <= end; i++) {
      rowDays.push(i);
    }
    let column = new Date().getDay();
    let columnDays = [];
    for (let i = column; i < 40; i++) {
      if (
        i === column ||
        i === column + 7 ||
        i === column + 14 ||
        i === column + 21 ||
        i === column + 28 ||
        i === column + 35
      ) {
        columnDays.push(i);
      }
    }
    setColumnDays(columnDays);
    setRowDays(rowDays);
  }, [dateString, paddingDays]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

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
        diff,
        theDay,
        currentWeek,
        setCurrentWeek,
        setTheDay,
        setNav,
        setOpenModal,
        setString,
        setStart,
        moveCalendar,
        finish,
        setOpen,
        setDay,
        dateString,
        rowDays,
        columnDays,
      }}
    >
      {children}
    </DatesContext.Provider>
  );
};

export default DatesContext;
