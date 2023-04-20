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
  const [diff, setDiff] = useState(0);
  let end;
  let difference;

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

  const moveCalendar = (e) => {
    end = e.touches[0].clientX;
    difference = end - start;
    setDiff(() => difference);
  };

  const finish = () => {
    if (start > end && start - end > 100) {
      setNav((prev) => prev + 1);
    }
    if (start < end && end - start > 100) {
      setNav((prev) => prev - 1);
    }
    setTimeout(function () {
      setStart(() => null);
      setDiff(() => 0);
      end = 0;
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
            className="text-xl"
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
            className="text-xl"
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
              />
            }
          </EventsContext.Provider>
        </section>
      </div>
    </LocalizationProvider>
  );
};

export default App;
