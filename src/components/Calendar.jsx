import { useState, useEffect } from "react";
import { Dna } from "react-loader-spinner";
import { motion } from "framer-motion";
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

const Calendar = ({ date }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(
    localStorage.getItem("events") ? localStorage.getItem("events") : []
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
  const [dateString, setDateString] = useState(
    firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  );
  const [paddingDays, setPaddingDays] = useState(
    weekDays.indexOf(dateString.split(", ")[0])
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }, [date]);

  useEffect(() => {
    //localStorage.removeItem("events");
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

  const [string, setString] = useState("");

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
          <div className="grid grid-cols-7 gap-1 h-[80vh]">
            {[...Array(paddingDays + daysInMonth)].map((abs, index) => (
              <div
                onClick={() =>
                  index >= paddingDays &&
                  addEvent(`${month + 1}/${index - paddingDays + 1}/${year}`)
                }
                key={index}
                className={`w-full h-full rounded-sm shadow-sm hover:shadow-blue-300 duration-200 flex flex-col items-center justify-start overflow-hidden ${
                  index - paddingDays + 1 === day &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear() &&
                  "shadow-green-400 shadow-md"
                }`}
              >
                <p
                  className={`text-center text-sm mb-[2px] ${
                    index - paddingDays + 1 === day &&
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear() &&
                    ""
                  }`}
                >
                  {index >= paddingDays && index - paddingDays + 1}
                </p>
                {events.length > 0 &&
                  JSON.parse(events).map((event) => (
                    <>
                      {event.date ===
                        `${month + 1}/${index - paddingDays + 1}/${year}` && (
                        <motion.div
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={event.event}
                          className={`w-full rounded-lg bg-${event.color}-400 overflow-x-hidden shadow-md p-1`}
                        >
                          <p className="whitespace-nowrap text-xs">
                            {event.event}
                          </p>
                        </motion.div>
                      )}
                    </>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Dna
              visible={loading}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
      </section>
      {openModal && (
        <Modal
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
