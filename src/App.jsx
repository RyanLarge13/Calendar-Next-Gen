import { useState, useEffect } from "react";
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

const App = () => {
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.register("sw.js");
    Notification.requestPermission(function (result) {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification("Notification with ServiceWorker");
        });
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const updatedDate = new Date();
    updatedDate.setMonth(new Date().getMonth() + nav);
    setDt(updatedDate);
  }, [nav]);

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
      {<Calendar date={dt} loading={loading} setLoading={setLoading} />}
    </LocalizationProvider>
  );
};

export default App;
