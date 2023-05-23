import { useContext } from "react";
import { motion } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";

const Confirm = ({ func }) => {
  const { setConfirm } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center fixed bottom-20 right-10 left-10 bg-white z-50 py-3 px-5 rounded-md shadow-md"
    >
      <button
        onClick={() => func()}
        className="border-b bg-green-200 px-3 rounded-md"
      >
        Yes
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="border-b bg-rose-200 px-3 rounded-md"
      >
        No
      </button>
    </motion.div>
  );
};

export default Confirm;
