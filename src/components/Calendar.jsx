import { useState, useEffect } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
import { calendar, calendarBlocks } from "../motion";
import Modal from "./Modal";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = ({ date, loading, setLoading }) => {
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
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
    localStorage.removeItem("events");
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
          <motion.div
            variants={calendar}
            initial="hidden"
            animate="show"
            className="grid grid-cols-5 gap-1 h-[78vh]"
          >
            {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
              <motion.div
                variants={calendarBlocks}
                onClick={() =>
                  index >= paddingDays &&
                  addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`)
                }
                key={index}
                className={`w-full min-h-[9vh] max-h-[9vh] rounded-sm shadow-sm hover:shadow-blue-300 flex flex-col items-center justify-start overflow-hidden cursor-pointer ${
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
                    <div key={event.id} className="w-full">
                      {event.date ===
                        `${month + 1}/${index - paddingDays + 1}/${year}` && (
                        <motion.div
                          initial={{ opacity: 0, y: -50 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.25 },
                          }}
                          className={`rounded-lg ${event.color} overflow-x-hidden shadow-md p-1 m-1`}
                        >
                          <p className="whitespace-nowrap text-xs">
                            {event.event}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="w-full h-screen flex justify-center items-center">
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
