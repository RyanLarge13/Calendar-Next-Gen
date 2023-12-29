import { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { holidays } from "../constants";
import Calendar from "../components/Calendar";
import Header from "../components/Header";
import Search from "../components/Search";
import SystemNotif from "../components/SystemNotif";
import Stickies from "../components/Stickies";
import AddCircle from "../components/AddCircle";
import Views from "../components/Views";
import SideBar from "../components/SideBar";
import Menu from "../components/Menu";
import Modal from "../components/Modal";
import ModalHeader from "../components/ModalHeader";
import MenuNavigation from "../components/MenuNavigation";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import AddEvent from "../components/AddEvent";

const MainApp = () => {
  const { events } = useContext(UserContext);
  const { string } = useContext(DatesContext);

  const [allDayEvents, setAllDayEvents] = useState([]);

  useEffect(() => {
    if (string) {
      const eventsForDay = [...events, ...holidays].filter(
        (event) => new Date(event.date).toLocaleDateString === string
      );
      const fullDayEvents = eventsForDay.filter(
        (event) => event.end.endTime === null || event.start.startTime === null
      );
      setAllDayEvents(fullDayEvents);
    }
  }, [string, events]);

  return (
    <Router>
      <Header />
      <Search />
      <SystemNotif />
      <Stickies />
      <AddCircle />
      <Views />
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex">
              <SideBar />
              <div className="overflow-hidden w-full h-full xl:ml-[17vw]">
                <Calendar />
              </div>
            </div>
          }
        >
          <Route
            path="menu"
            element={
              <>
                <MenuNavigation />
                <Menu />
              </>
            }
          />
          <Route
            path="modal"
            element={
              <>
                <ModalHeader allDayEvents={allDayEvents} />
                <Modal />
              </>
            }
          >
            {/* <Route path="event" element={<AddEvent />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default MainApp;
