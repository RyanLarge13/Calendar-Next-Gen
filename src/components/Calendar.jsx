import { useState, useEffect, useContext } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
import { calendar, calendarBlocks } from "../motion";
import Modal from "./Modal";
import EventsContext from "../context/events.js";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = ({ diff, date, loading, setLoading, open }) => {
  const { events, setEvents } = useContext(EventsContext);
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
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
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }, [date]);

  useEffect(() => {
    // localStorage.removeItem("events");
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
  
  useEffect(() => {
  	open(openModal)
  }, [openModal])

  const addEvent = (date) => {
    setOpenModal(true);
    setString(date);
  };

  return (
    <main className="px-2">
      <div className="grid grid-cols-7 gap-2 justify-center items-center my-5">
        {weekDays.map((day) => (
          <p key={day} className="mx-2 text-center">
            {day.split("")[0]}
          </p>
        ))}
      </div>
      <section>
        {!loading ? (
          <div
            style={{ transform: `translateX(${diff}px)` }}
            className="duration-200"
          >
            <motion.div
              variants={calendar}
              initial="hidden"
              animate="show"
              className="grid grid-cols-7 gap-1 h-[78vh]"
            >
              {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
                <motion.div
                  variants={calendarBlocks}
                  onClick={() =>
                    index >= paddingDays &&
                    addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`)
                  }
                  key={index}
                  className={`w-full min-h-[12vh] max-h-[12vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start overflow-hidden cursor-pointer ${
                    index - paddingDays + 1 === day &&
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear() &&
                    "shadow-green-400 shadow-md"
                  }`}
                >
                  <div
                    className={`text-center text-sm my-1 ${
                      index - paddingDays + 1 === day &&
                      month === new Date().getMonth() &&
                      year === new Date().getFullYear() &&
                      "w-[25px] h-[25px] rounded-full bg-green-100 shadow-sm"
                    }`}
                  >
                    <p>{index >= paddingDays && index - paddingDays + 1}</p>
                  </div>
                  {events.length > 0 &&
                    events.map((event) => (
                      <>
                        {event.date ===
                          `${month + 1}/${index - paddingDays + 1}/${year}` && (
                          <motion.div
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
                            className={`rounded-lg ${event.color} shadow-md px-2 py-1 mx-2 my-1 w-full`}
                          >
                            <p className="whitespace-nowrap text-xs">
                              {event.event}
                            </p>
                          </motion.div>
                        )}
                      </>
                    ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Dna
              visible={loading}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
      </section>
      {openModal && (
        <Modal
          setDate={setString}
          selectedDate={string}
          setModal={(bool) => setOpenModal(bool)}
          events={events}
          setEvents={setEvents}
        />
      )}
    </main>
  );
};

export default Calendar;
