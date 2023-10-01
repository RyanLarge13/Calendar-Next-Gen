import {useContext} from "react"
import { motion } from "framer-motion";
import { FaCogs, FaUserFriends } from "react-icons/fa";
import { AiFillMessage, AiFillCalendar } from "react-icons/ai";
import UserContext from "../context/UserContext"

const Options = ({ setOption }) => {
	const {friendRequests} = useContext(UserContext) 
	
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
          className="my-2 p-2 flex justify-between items-center rounded-md shadow-sm relative"
          onClick={() => setOption("connections")}
        >
        {friendRequests.length > 0 && <div className="absolute flex justify-center items-center top-[-8px] right-[-8px] rounded-full shadow-md w-[15px] h-[15px] bg-red-300 text-[12px]">{friendRequests.length > 9 ? "9+" : friendRequests.length}</div>}
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
