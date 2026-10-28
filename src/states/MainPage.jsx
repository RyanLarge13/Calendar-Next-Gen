import { useContext, useEffect, useRef } from "react";
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
import { useModalState, useModalActions } from "../context/ContextHooks/ModalContext";
import ReminderNotifications from "../components/Reminders/ReminderNotifications";
import { setStateAndPushWindowState } from "../utils/helpers";
import Timers from "../components/Timers/Timers";
import PinLockScreen from "../components/Unlock/PinLockScreen";

const MainPage = () => {
  const {
    setAddNewEvent,
    setType,
    setEvent,
    setMenu,
    setShowLogin,
    setShowNotifs,
    menu, showCategory, setShowCategory, showNotifs, showLogin, event, showDatePicker, setShowDatePicker, showFullDatePicker, setShowFullDatePicker,
  } = useContext(InteractiveContext);
  const { eventsById } = useContext(UserContext);

  const { openModal, closeModal } = useModalActions();
  const modalOpen = useModalState();
  const navRef = useRef(null);
  navRef.current = { menu, showCategory, showNotifs, showLogin, event, showDatePicker, showFullDatePicker, modalOpen };

  // One navigation handler for overlays and keyboard back. Avoid registering
  // competing popstate listeners in individual components.
  useEffect(() => {
    const dismissTop = () => {
      const state = navRef.current;
      if (state.showFullDatePicker) { setShowFullDatePicker(false); return true; }
      if (state.showDatePicker) { setShowDatePicker(false); return true; }
      if (state.showNotifs) { setShowNotifs(false); return true; }
      if (state.modalOpen) { closeModal(); return true; }
      if (state.event) { setEvent(null); return true; }
      if (state.showLogin) { setShowLogin(false); return true; }
      if (state.menu && state.showCategory !== null) { setShowCategory(null); return true; }
      if (state.menu) { setMenu(false); return true; }
      return false;
    };
    const onPopState = () => { dismissTop(); };
    const onKeyDown = (e) => {
      if (e.key !== "Escape" && e.key !== "Backspace") return;
      const target = e.target;
      if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
      if (dismissTop()) e.preventDefault();
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal, setEvent, setMenu, setShowCategory, setShowDatePicker, setShowFullDatePicker, setShowLogin, setShowNotifs]);

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
        const e = eventsById.get(String(uuid));

        if (e) {
          setStateAndPushWindowState(() => setEvent(e));
        }
      }
    }
  }, [location, eventsById]);

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
      {/* <PinLockScreen
        mode="unlock"
        error={null}
        onSubmit={(pin) => {
          console.log("Entered PIN:", pin);
        }}
        onBiometricUnlock={() => {
          console.log("Try biometric unlock");
        }}
      /> */}
      <div className="flex">
        <SideBar />
        <div className="overflow-hidden scrollbar-hide w-full">
          <Calendar />
        </div>
      </div>
      <AddCircle />
      <Views />
      <Timers />
      <Outlet />
    </main>
  );
};

export default MainPage;
