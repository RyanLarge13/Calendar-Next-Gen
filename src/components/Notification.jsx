import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { IoIosAlarm } from "react-icons/io";
import { MdSystemSecurityUpdateGood } from "react-icons/md";
import InteractiveContext from "../context/InteractiveContext";
import Confirm from "./Confirm";

const Notification = ({ idsToUpdate, setIdsToUpdate }) => {
  const { notifications, setNotifications } = useContext(InteractiveContext);

  const [notifOpen, setNotifOpen] = useState("");
  const [confirm, setVonfirm] = useState(false);

  const openNotif = (id, read) => {
    setNotifOpen((prev) => (prev === id ? "" : id));
    if (read) return;
    if (!read) readNotif(id);
  };

  const readNotif = (id) => {
    if (!idsToUpdate.includes(id)) {
      setIdsToUpdate((prev) => [...prev, id]);
    }
    const notif = notifications.filter((notif) => notif.id === id)[0];
    const notifArrayCopy = notifications.filter((notif) => notif.id !== id);
    notif.read = true;
    notifArrayCopy.push(notif);
    setNotifications(notifArrayCopy);
  };

  const getIcon = (type) => {
    if (type === "reminder") return <IoIosAlarm />;
  };

  const deleteNotif = (id) => {};

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
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
                    height: 200,
                  }
                : { height: 100 }
            }
            onClick={() => openNotif(notif.id, notif.read)}
            key={notif.id}
            className="rounded-md p-2 my-5 shadow-md bg-white relative flex flex-col justify-between h-max"
          >
            {notif.read === false && (
              <div className="absolute top-[-5px] left-[-5px] rounded-full w-[10px] h-[10px] bg-red-300"></div>
            )}
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs border-b mb-1">
                  {new Date(notif.notifData.time).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
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
              <div className="text-xs flex justify-between items-center p-1 px-2 mt-4 rounded-b-md bg-purple-100">
                {notif.read ? (
                  <p>Mark As UnOpen</p>
                ) : (
                  <p
                    onClick={() => readNotif(notif.id)}
                    className="border-b border-b-cyan-300"
                  >
                    Mark As Read
                  </p>
                )}
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm(true);
                  }}
                  className="border-b border-b-rose-300"
                >
                  Delete
                </p>
              </div>
            </div>
          </motion.div>
        ))
      )}
      {confirm && <Confirm func={deleteNotif} />}
    </motion.div>
  );
};

export default Notification;
