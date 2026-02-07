import { motion } from "framer-motion";
import { useContext } from "react";
import { AiFillCalendar, AiFillMessage } from "react-icons/ai";
import { FaCogs, FaUserFriends } from "react-icons/fa";
import UserContext from "../../context/UserContext";

const Options = ({ setOption }) => {
  const { friendRequests } = useContext(UserContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >
      <div className="m-3">
        <button className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200 hover:bg-cyan-200 hover:text-black w-full">
          <p>Messages</p>
          <AiFillMessage />
        </button>
        <button
          className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm relative hover:scale-[1.005] duration-200 hover:bg-cyan-200 hover:text-black w-full"
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
        <button className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200 hover:bg-cyan-200 hover:text-black w-full">
          <p>Calendar</p>
          <AiFillCalendar />
        </button>
        <button
          className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm hover:scale-[1.005] duration-200 hover:bg-cyan-200 hover:text-black w-full"
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
