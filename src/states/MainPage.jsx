import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Calendar from "../components/CalendarViews/Calendar";
import Header from "../components/Misc/Header";
import Search from "../components/Misc/Search";
import SystemNotif from "../components/Misc/SystemNotif";
import Stickies from "../components/Stickies/Stickies";
import AddCircle from "../components/AddData/AddCircle";
import Views from "../components/CalendarViews/Views";
import SideBar from "../components/Misc/SideBar";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const MainPage = () => {
  const {
    setAddNewEvent,
    setType,
    setMenu,
    menu,
    setShowLogin,
    setShowNotifs,
  } = useContext(InteractiveContext);
  const { setOpenModal, setString, string, dateObj } = useContext(DatesContext);

  const location = useLocation();

  useEffect(() => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    if (location.pathname === "/event") {
      setType("event");
      closeMenu();
      setOpenModal(true);
      setAddNewEvent(true);
    }
    if (location.pathname === "/reminder") {
      setType("reminder");
      closeMenu();
      setOpenModal(true);
      setAddNewEvent(true);
    }
    if (location.pathname === "/notifications") {
      closeMenu();
      setShowLogin(true);
      setShowNotifs(true);
    }
    if (location.pathname === "/event") {
      console.log("Event");
    }
  }, [location]);

  const closeMenu = () => {
    if (menu) {
      setMenu(false);
    }
  };

  return (
    <main>
      <Header />
      <Search />
      <SystemNotif />
      <Stickies />
      <div className="flex">
        <SideBar />
        <div className="overflow-hidden scrollbar-hide w-full">
          <Calendar />
        </div>
      </div>
      <AddCircle />
      <Views />
      <Outlet />
    </main>
  );
};

export default MainPage;
