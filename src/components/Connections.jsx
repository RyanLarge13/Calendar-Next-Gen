import { useContext } from "react";
import { motion } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import UserContext from "../context/UserContext";

const Connections = ({ setOption }) => {
  const { user, friends, setFriends } = useContext(UserContext);

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
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-white z-50 p-5"
    >
      <h2 className="text-4xl pb-2 border-b">Connections</h2>
      <div className="mt-5">
        <p>Your Friends</p>
        <div className="mt-3">
          {friends.length > 0 ? (
            friends.map((friend) => <div></div>)
          ) : (
            <div className="p-5 flex flex-col justify-center items-center bg-cyan-100 shadow-md rounded-md">
              <p>No friends</p>
              <button className="flex flex-col justify-center items-center mt-3 py-1 px-3 rounded-md shadow-md bg-white">
                <p>Create Connection</p>
                <IoIosAddCircle />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Connections;
