import { useContext, useState } from "react";
import { deleteNotification } from "../utils/api";
import { formatTime } from "../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAlarm } from "react-icons/io";
import { MdSystemSecurityUpdateGood } from "react-icons/md";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Notification = ({ idsToUpdate, setIdsToUpdate }) => {
  const { notifications, setNotifications, setSystemNotif } =
    useContext(UserContext);
  const { showNotifs } = useContext(InteractiveContext);

  const [notifOpen, setNotifOpen] = useState("");

  const openNotif = (id, read) => {
    setNotifOpen((prev) => (prev === id ? "" : id));
    if (read) return;
    if (!read) readNotif(id);
  };

  const readNotif = (id) => {
    if (!idsToUpdate.includes(id)) {
      setIdsToUpdate((prev) => [...prev, id]);
    }
    // Create a new array with the updated notification
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    // Sort the updatedNotifications array by time from newest to oldest
    const sortedNotifications = updatedNotifications.sort(
      (a, b) => b.time - a.time
    );
    setNotifications(sortedNotifications);
  };

  const getIcon = (type) => {
    if (type === "reminder") return <IoIosAlarm />;
  };

  const initiateDeletion = (notifId) => {
    const newConfirmation = {
      show: true,
      title: "Delete Notification",
      text: "Are you sure you want to delete this notification?",
      color: "bg-red-200",
      actions: [
        { text: "close", func: () => setSystemNotif({ show: false }) },
        {
          text: "delete",
          func: () => {
            deleteNotif(notifId);
            setSystemNotif({ show: false });
          },
        },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteNotif = (notifId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const newNotifs = notifications.filter((item) => item.id !== notifId);
    setNotifications(newNotifs);
    deleteNotification(token, notifId)
      .then((res) => {
        console.log(`Notification deleted: ${res.data}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AnimatePresence>
      {showNotifs && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="py-3 px-5 rounded-b-md fixed top-0 right-0 left-0 z-20 max-h-[60vh] overflow-y-auto bg-purple-100"
        >
          {notifications.length < 1 ? (
            <div className="flex flex-col items-center justify-center w-full">
              <motion.p
                initial={{ y: "-200%", opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
              >
                All Caught Up!
              </motion.p>
              <MdSystemSecurityUpdateGood className="text-3xl mt-5" />
            </div>
          ) : (
            notifications.map((notif, index) => (
              <motion.div
                animate={
                  notifOpen === notif.id
                    ? {
                        height: 220,
                      }
                    : { height: 120 }
                }
                onClick={() => openNotif(notif.id, notif.read)}
                key={notif.id}
                className="rounded-md p-2 my-5 shadow-md bg-white relative flex flex-col justify-between h-max"
              >
                {notif.read === false && (
                  <div className="absolute top-[-5px] left-[-5px] rounded-full w-[10px] h-[10px] bg-red-300"></div>
                )}
                <div>
                  <div className="flex justify-between items-start">
                    <div className="text-xs mb-1">
                      <p className="border-b">
                        {new Date(notif.time).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p>{formatTime(new Date(notif.time))}</p>
                    </div>
                    {getIcon(notif.type)}
                  </div>
                  <p className="text-sm">{notif.notifData.title}</p>
                  {notifOpen === notif.id && (
                    <div className="p-3 bg-slate-100 mt-1 rounded-md shadow-sm max-h-[100px] overflow-y-auto">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.25, duration: 0.5 },
                        }}
                        className="text-sm"
                      >
                        {notif.notifData.notes}
                      </motion.p>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs flex justify-between items-center p-1 px-2 mt-4 rounded-b-md bg-purple-100 cursor-pointer">
                    {notif.read ? (
                      <p>Mark As UnOpen</p>
                    ) : (
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          readNotif(notif.id);
                        }}
                        className="border-b border-b-cyan-300 cursor-pointer"
                      >
                        Mark As Read
                      </p>
                    )}
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        initiateDeletion(notif.id);
                      }}
                      className="border-b border-b-rose-300 cursor-pointer"
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
