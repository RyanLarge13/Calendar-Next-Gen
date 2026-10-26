import { AnimatePresence } from "framer-motion";
import { useContext, useRef } from "react";
import { weekDays } from "../../constants/dateAndTimeConstants";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import AgendaView from "../CalendarViews/AgendaView";
import DayView from "./DayView/DayView";
import MasonryView from "../CalendarViews/MasonryView";
import MonthView from "../CalendarViews/MonthView/MonthView";
import WeekView from "../CalendarViews/WeekView";
import DatePicker from "../DatePickers/DatePicker";
import FullDatePicker from "../DatePickers/FullDatePicker";
import Event from "../Events/Event";
import LoginLogout from "../UserModal/LoginLogout/LoginLogout";
import Menu from "../Menu/Menu";
import Modal from "../Modal/Modal";
import ModalHeader from "../Modal/ModalHeader";
import { useModalActions } from "../../context/ContextHooks/ModalContext";

const Calendar = () => {
  const { preferences } = useContext(UserContext);
  const { showFullDatePicker, view, setShowFullDatePicker, addNewEvent, setType, setAddNewEvent } =
    useContext(InteractiveContext);
  const { setTheDay, setSecondString } = useContext(DatesContext);
  const { openModal } = useModalActions();

  const containerRef = useRef(null);

  const setSecondDateObject = (newString) => {
    setSecondString(newString);
    setShowFullDatePicker(false);
    openModal();
    setType("event");
    setAddNewEvent(true);
  };

  const setDayViewDay = (newString) => {
    setTheDay(new Date(newString));
    setShowFullDatePicker(false);
  };

  return (
    <main
      ref={containerRef}
      className={`px-2 pt-[65px] h-[100dvh] min-h-0 flex flex-col overflow-y-auto scrollbar-hide ${
        preferences.darkMode ? "bg-[#222]" : "bg-white"
      }`}
    >
      <section className={view === "month" ? "flex flex-1 min-h-0 flex-col" : ""}>
        <div className={`grid grid-cols-7 gap-2 justify-center items-center my-5 ${view === "month" ? "shrink-0" : ""}`}>
          {view === "month" &&
            weekDays.map((day) => (
              <p
                key={day}
                className={`${
                  preferences.darkMode ? "text-white" : "text-black"
                } mx-2 text-center font-bold`}
              >
                {day.split("")[0]}
              </p>
            ))}
        </div>
        <section className={view === "month" ? "flex-1 min-h-0" : ""}>
          <div className={view === "month" ? "h-full min-h-0" : ""}>
              <div className={view === "month" ? "h-full min-h-0" : ""}>
                {view === "month" && <MonthView />}
                {view === "day" && <DayView containerRef={containerRef} />}
                {view === "week" && <WeekView />}
                {view === "masonry" && (
                  <MasonryView containerRef={containerRef} />
                )}
                {view === "agenda" && <AgendaView />}
              </div>
          </div>
        </section>
        <DatePicker />
        {showFullDatePicker && (
          <FullDatePicker
            stateSetter={addNewEvent ? setSecondDateObject : view === "day" ? setDayViewDay : setSecondDateObject}
          />
        )}
        <ModalHeader />
        <AnimatePresence>
          <Modal />
        </AnimatePresence>
        <Menu />
        <LoginLogout />
        <Event />
      </section>
    </main>
  );
};

export default Calendar;
