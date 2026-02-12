import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import UserContext from "../../../context/UserContext";
import ConnectionRequests from "./ConnectionRequests";
import FriendRequest from "./FriendRequest";
import Friends from "./Friends";

const Connections = ({ setOption }) => {
  const { preferences } = useContext(UserContext);

  const [options, setOptions] = useState(0);

  const finish = (e, info) => {
    const dragDistance = info.offset.y;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setOption(null);
    }
    if (dragDistance < cancelThreshold) {
      return;
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={finish}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed inset-0 z-50 p-5 lg:left-[60%] scrollbar-hide ${
        preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-4xl pb-2 border-b">Connections</h2>
        <button onClick={() => setOption(null)}>
          <AiOutlineArrowDown />
        </button>
      </div>
      <div className="my-5 flex justify-between items-center">
        <button
          onClick={() => setOptions(0)}
          className={`${options === 0 ? "underline" : ""}`}
        >
          Friends
        </button>
        <button
          onClick={() => setOptions(1)}
          className={`${options === 1 ? "underline" : ""}`}
        >
          Friend Requests
        </button>
        <button
          onClick={() => setOptions(2)}
          className={`${options === 2 ? "underline" : ""}`}
        >
          Connection Requests
        </button>
      </div>
      {options === 0 && <Friends />}
      {options === 1 && <FriendRequest />}
      {options === 2 && <ConnectionRequests />}
    </motion.div>
  );
};

export default Connections;
