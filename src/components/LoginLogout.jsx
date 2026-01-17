import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { updateNotification } from "../utils/api";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Notification from "./Notification";
import Options from "./Options";
import Settings from "./Settings";
import Connections from "./Connections";
import SocialLogin from "./SocialLogin";

const LoginLogout = () => {
  const { showLogin, setShowLogin, showNotifs, setShowNotifs } =
    useContext(InteractiveContext);
  const {
    user,
    setUser,
    setGoogleToken,
    notifications,
    setNotifications,
    setAuthToken,
    setEvents,
    setReminders,
    setLists,
    setSystemNotif,
    preferences,
  } = useContext(UserContext);

  const [unReadLength, setUnReadLength] = useState(0);
  const [idsToUpdate, setIdsToUpdate] = useState([]);
  const [option, setOption] = useState(null);

  useEffect(() => {
    if (idsToUpdate.length > 0) {
      updateNotification(
        idsToUpdate,
        localStorage.getItem("authToken"),
        user.username
      )
        .then((res) => {
          console.log(res);
          setIdsToUpdate([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [showNotifs]);

  useEffect(() => {
    const unReadNotifs = notifications.filter(
      (notif) => notif.read === false
    ).length;
    setUnReadLength(unReadNotifs);
  }, [notifications]);

  const confirmLogout = () => {
    const newConfirmation = {
      show: true,
      title: "Logout",
      text: "Are you sure you want to logout?",
      color: "bg-purple-200",
      hasCancel: false,
      actions: [
        {
          text: "close",
          func: () => setSystemNotif({ show: false }),
        },
        { text: "logout", func: () => logout() },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("events");
    localStorage.removeItem("reminders");
    setSystemNotif({ show: false });
    setAuthToken(false);
    setGoogleToken(false);
    setUser(false);
    setEvents([]);
    setNotifications([]);
    setReminders([]);
    setLists([]);
  };

  return (
    <>
      <AnimatePresence>
        {option === "connections" && <Connections setOption={setOption} />}
        {option === "settings" && <Settings setOption={setOption} />}
      </AnimatePresence>
      <Notification idsToUpdate={idsToUpdate} setIdsToUpdate={setIdsToUpdate} />
      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                if (showNotifs) return setShowNotifs(false);
                if (option) return setOption(null);
                setShowLogin(false);
              }}
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"
            ></motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              exit={{ y: 50, opacity: 0 }}
              animate={
                showNotifs ? { y: "85%", opacity: 1 } : { y: 0, opacity: 1 }
              }
              className={`p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md z-10 lg:right-[65%] ${
                !user ? "top-0" : ""
              } ${
                preferences.darkMode
                  ? "bg-[#222] text-white"
                  : "bg-white text-black"
              }`}
            >
              {user ? (
                <div className="space-y-4">
                  {/* Top bar with logout + notifications */}
                  <div
                    className="flex justify-between items-center bg-gradient-to-r from-cyan-200 to-cyan-100 
    rounded-xl shadow-md p-3 text-gray-800"
                  >
                    {/* Logout */}
                    <button
                      onClick={() => confirmLogout()}
                      className="text-xl text-gray-600 hover:text-rose-500 transition"
                    >
                      <BiLogOutCircle />
                    </button>

                    {/* Notifications */}
                    <div
                      onClick={() => setShowNotifs((prev) => !prev)}
                      className="relative cursor-pointer text-gray-600 hover:text-cyan-600 transition"
                    >
                      {unReadLength > 0 && (
                        <span
                          className="absolute -top-2 -right-2 flex justify-center items-center 
          w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-md"
                        >
                          {unReadLength > 9 ? "9+" : unReadLength}
                        </span>
                      )}
                      <BsFillBellFill className="text-lg" />
                    </div>
                  </div>

                  {/* User Avatar + Edit */}
                  <div className="flex items-end gap-2">
                    <img
                      src={user.avatarUrl}
                      alt="user"
                      className="w-14 h-14 rounded-full shadow-md border-2 border-white"
                    />
                    <button className="px-2 py-1 rounded-md text-xs font-semibold bg-cyan-100 hover:bg-cyan-200 text-gray-700 transition">
                      Edit
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="text-sm font-semibold text-gray-800">
                    <p className="text-base">{user.username}</p>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-cyan-600 hover:underline break-words"
                    >
                      {user.email}
                    </a>
                  </div>

                  {/* Options */}
                  <Options setOption={setOption} />
                </div>
              ) : (
                <AnimatePresence>
                  <SocialLogin />
                </AnimatePresence>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginLogout;
