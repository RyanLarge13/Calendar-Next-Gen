import { useContext } from "react";
import { motion } from "framer-motion";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import InteractiveContext from "../context/InteractiveContext";

const Confirm = ({ func }) => {
  const { setConfirm } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center fixed top-5 right-5 left-5 bg-white z-[999] py-3 px-5 rounded-md shadow-md"
    >
      <button
        onClick={() => func()}
        className="border-b bg-green-200 p-3 rounded-md shadow-md 
        "
      >
        <AiFillCheckCircle />
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="border-b bg-rose-200 p-3 rounded-md shadow-md"
      >
        <MdCancel />
      </button>
    </motion.div>
  );
};

export default Confirm;
