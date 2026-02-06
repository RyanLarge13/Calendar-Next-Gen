import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { updateNotification } from "../../utils/api";
import UserContext from "../../context/UserContext";
import InteractiveContext from "../../context/InteractiveContext";
import Notification from "../Notification";
import Options from "../Options";
import Settings from "../Settings";
import Connections from "../Connections";
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
        user.username,
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
      (notif) => notif.read === false,
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
                    className={`
      flex justify-between items-center
      rounded-2xl border shadow-sm px-4 py-3 backdrop-blur-md
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10 text-white"
          : "bg-white/90 border-black/10 text-slate-900"
      }
    `}
                  >
                    {/* Logout */}
                    <button
                      onClick={() => confirmLogout()}
                      className={`
        grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
        active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-300"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-500"
        }
      `}
                      aria-label="Log out"
                    >
                      <BiLogOutCircle className="text-xl" />
                    </button>

                    {/* Notifications */}
                    <button
                      type="button"
                      onClick={() => setShowNotifs((prev) => !prev)}
                      className={`
        relative grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
        active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-cyan-200"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-cyan-600"
        }
      `}
                      aria-label="Notifications"
                    >
                      {unReadLength > 0 && (
                        <span
                          className="
            absolute -top-2 -right-2 grid place-items-center
            min-w-[18px] h-[18px] px-1
            rounded-full bg-gradient-to-tr from-rose-500 to-red-500
            text-white text-[11px] font-bold shadow-md
          "
                        >
                          {unReadLength > 9 ? "9+" : unReadLength}
                        </span>
                      )}
                      <BsFillBellFill className="text-lg" />
                    </button>
                  </div>

                  {/* User Avatar + Edit */}
                  <div
                    className={`
      flex items-end justify-between gap-3
      rounded-2xl border shadow-sm p-4
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10"
          : "bg-white border-black/10"
      }
    `}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt="user"
                        className={`
          w-14 h-14 rounded-full object-cover shadow-md border
          ${preferences.darkMode ? "border-white/15" : "border-black/10"}
        `}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-base font-semibold truncate ${preferences.darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {user.username}
                        </p>
                        <a
                          href={`mailto:${user.email}`}
                          className={`
            text-sm font-semibold break-words transition
            ${preferences.darkMode ? "text-cyan-200 hover:underline" : "text-cyan-600 hover:underline"}
          `}
                        >
                          {user.email}
                        </a>
                      </div>
                    </div>

                    <button
                      className={`
        rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm border transition
        active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
            : "bg-black/[0.03] border-black/10 text-slate-700 hover:bg-black/[0.06]"
        }
      `}
                    >
                      Edit
                    </button>
                  </div>

                  {/* Options */}
                  <div
                    className={`
      rounded-2xl border shadow-sm p-3
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10"
          : "bg-white border-black/10"
      }
    `}
                  >
                    <Options setOption={setOption} />
                  </div>
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
