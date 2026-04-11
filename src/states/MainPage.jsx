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
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import { useModalActions } from "../context/ContextHooks/ModalContext";
import ReminderNotifications from "../components/Reminders/ReminderNotifications";

const MainPage = () => {
  const {
    setAddNewEvent,
    setType,
    setEvent,
    setMenu,
    setShowLogin,
    setShowNotifs,
  } = useContext(InteractiveContext);
  const { events } = useContext(UserContext);

  const { openModal } = useModalActions();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/event") {
      setType("event");
      closeMenu();
      openModal();
      setAddNewEvent(true);
    }
    if (location.pathname === "/reminder") {
      setType("reminder");
      closeMenu();
      openModal();
      setAddNewEvent(true);
    }
    if (location.pathname === "/notifications") {
      closeMenu();
      setShowLogin(true);
      setShowNotifs(true);
    }
    if (location.pathname.startsWith("/event/")) {
      const uuid = location.pathname.split("/event/")[1];
      console.log(uuid);

      if (uuid) {
        closeMenu();
        const e = events.find((ev) => ev.id === uuid);

        if (e) {
          setEvent(e);
        }
      }
    }
  }, [location]);

  const closeMenu = () => {
    setMenu((prev) => {
      if (prev) false;
    });
  };

  return (
    <main>
      <Header />
      <Search />
      <SystemNotif />
      <ReminderNotifications />
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
