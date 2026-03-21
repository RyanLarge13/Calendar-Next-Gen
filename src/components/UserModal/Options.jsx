import { motion } from "framer-motion";
import { useContext } from "react";
import { AiFillCalendar, AiFillMessage } from "react-icons/ai";
import { FaCogs, FaUserFriends } from "react-icons/fa";
import UserContext from "../../context/UserContext";

const Options = ({ setOption }) => {
  const { friendRequests, preferences } = useContext(UserContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >
      <div className="m-3">
        <button
          className={`
            border w-full
           ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30" : "bg-white border-black/10 hover:bg-white/20 hover:border-black/30"}
          my-2 p-2 px-4 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200`}
        >
          <p>Messages</p>
          <AiFillMessage />
        </button>
        <button
          className={`
            border w-full
           ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30" : "bg-white border-black/10 hover:bg-white/20 hover:border-black/30"}
          my-2 p-2 px-4 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200`}
          onClick={() => setOption("connections")}
        >
          {friendRequests.length > 0 && (
            <div className="absolute flex justify-center items-center top-[-8px] right-[-8px] rounded-full shadow-md w-[15px] h-[15px] bg-red-300 text-[12px]">
              {friendRequests.length > 9 ? "9+" : friendRequests.length}
            </div>
          )}
          <p>Connections</p>
          <FaUserFriends />
        </button>
        <button
          className={`
            border w-full
           ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30" : "bg-white border-black/10 hover:bg-white/20 hover:border-black/30"}
          my-2 p-2 px-4 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200`}
        >
          <p>Calendar</p>
          <AiFillCalendar />
        </button>
        <button
          className={`
            border w-full
           ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30" : "bg-white border-black/10 hover:bg-white/20 hover:border-black/30"}
          my-2 p-2 px-4 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200`}
          onClick={() => setOption("settings")}
        >
          <p>Settings</p>
          <FaCogs />
        </button>
      </div>
    </motion.div>
  );
};

export default Options;
