import { useState, useEffect, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { RiMenuUnfoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import Calendar from "./components/Calendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EventsContext from "./context/events.js";

const App = () => {
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

  useEffect(() => {
    // navigator.serviceWorker.register("sw.js");
    // Notification.requestPermission(function (result) {
    //   if (result === "granted") {
    //     navigator.serviceWorker.ready.then(function (registration) {
    //       registration.showNotification("Notification with ServiceWorker");
    //     });
    //   }
    // });
  }, []);

  useEffect(() => {
    // (async () => {
    //   await fetch("http://localhost:8080/", { method: "GET" })
    //     .then((res) => res.json())
    //     .then((json) => {
    //       console.log(json);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // })();
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <motion.header
        initial={{ y: -200 }}
        animate={{ y: 0 }}
        className="flex justify-between p-5 mb-5 shadow-md"
      >
        <RiMenuUnfoldFill />
        <div className="flex justify-center items-center">
          <BsFillArrowLeftCircleFill
            onClick={() => setNav((prev) => prev - 1)}
            className="text-xl cursor-pointer"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-5"
          >{`${dt.toLocaleString("default", {
            month: "long",
          })} ${dt.getFullYear()}`}</motion.p>
          <BsFillArrowRightCircleFill
            onClick={() => setNav((prev) => prev + 1)}
            className="text-xl cursor-pointer"
          />
        </div>
        <BsThreeDotsVertical />
      </motion.header>
      <div className="overflow-x-hidden w-full h-full">
        <section
          onTouchStart={(e) => setStart(e.touches[0].clientX)}
          onTouchMove={(e) => moveCalendar(e)}
          onTouchEnd={(e) => finish()}
        >
          <EventsContext.Provider value={{ events, setEvents }}>
            {
              <Calendar
                diff={diff}
                date={dt}
                loading={loading}
                setLoading={setLoading}
                open={(bool) => setOpen(bool)}
              />
            }
          </EventsContext.Provider>
        </section>
      </div>
    </LocalizationProvider>
  );
};

export default App;
