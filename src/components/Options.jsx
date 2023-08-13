import { motion } from "framer-motion";
import { FaCogs, FaUserFriends } from "react-icons/fa";
import { AiFillMessage, AiFillCalendar } from "react-icons/ai";

const Options = ({ setOption }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >
      <div className="m-3">
        <div className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm">
          <p>Messages</p>
          <AiFillMessage />
        </div>
        <div
          className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm"
          onClick={() => setOption("connections")}
        >
          <p>Connections</p>
          <FaUserFriends />
        </div>
        <div className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm">
          <p>Calendar</p>
          <AiFillCalendar />
        </div>
        <div className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm" onClick={() => setOption("settings")}>
          <p>Settings</p>
          <FaCogs />
        </div>
      </div>
    </motion.div>
  );
};

export default Options;
