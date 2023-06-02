import { useContext } from "react";
import { motion } from "framer-motion";
import { MdSystemSecurityUpdateGood } from "react-icons/md";
import InteractiveContext from "../context/InteractiveContext";

const Notification = () => {
  const { notifications, setNotifications } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white p-3 rounded-b-md fixed top-0 right-0 left-0 z-20 min-h-[50vh] overflow-y-auto"
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
        notifications.map((notif) => (
          <div
            key={notif.id}
            className="rounded-md p-2 my-3 shadow-md bg-white relative"
          >
            {notif.read === false && (
              <div className="absolute top-[-5px] right-[-5px] rounded-full w-[10px] h-[10px] bg-red-400"></div>
            )}
            <p>
              {new Date(notif.notifData.time).toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm">{notif.notifData.title}</p>
            <p className="text-xs">{notif.notifData.notes}</p>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default Notification;
