import { createContext, useState, useEffect } from "react";
import { holidays, weekDays } from "../constants";

const DatesContext = createContext({});

export const DatesProvider = ({ children }) => {
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
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
    if (diff < -150) {
      setNav((prev) => prev + 1);
    }
    if (diff > 150) {
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
  }, [dateString]);

  return (
    <DatesContext.Provider
      value={{
        dt,
        setNav,
        weekDays,
        setOpenModal,
        setString,
        setStart,
        moveCalendar,
        finish,
        loading,
        paddingDays,
        daysInMonth,
        month,
        year,
        day,
        holidays,
        events,
        setEvents,
        string,
        openModal,
        diff,
        setOpen,
        setDay,
      }}
    >
      {children}
    </DatesContext.Provider>
  );
};

export default DatesContext;
