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
              className={`p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md z-10 lg:right-[50%] ${
                !user ? "top-0" : ""
              } ${
                preferences.darkMode
                  ? "bg-[#222] text-white"
                  : "bg-white text-black"
              }`}
            >
              {user ? (
                <div>
                  <div
                    className={`flex justify-between items-center bg-cyan-100 rounded-md shadow-md p-2 mb-5 text-black`}
                  >
                    <BiLogOutCircle
                      onClick={() => confirmLogout()}
                      className="text-xl left-2 top-2 cursor-pointer"
                    />
                    <div
                      onClick={() => setShowNotifs((prev) => !prev)}
                      className="relative cursor-pointer"
                    >
                      {unReadLength > 0 && (
                        <div
                          className={`absolute flex justify-center items-center top-[-8px] right-[-8px] rounded-full shadow-md w-[15px] h-[15px] bg-red-300 text-[12px]`}
                        >
                          {unReadLength > 9 ? "9+" : unReadLength}
                        </div>
                      )}
                      <BsFillBellFill />
                    </div>
                  </div>
                  <div className="flex justify-start items-end">
                    <img
                      src={user.avatarUrl}
                      alt="user"
                      className="w-[50px] h-[50px] rounded-full shadow-sm mr-1"
                    />
                    <button className="text-xs font-semibold">Edit</button>
                  </div>
                  <div className="text-xs font-bold mt-2">
                    <p>{user.username}</p>
                    <a href={`mailto:${user.email}`}>
                      <p>{user.email}</p>
                    </a>
                  </div>
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
