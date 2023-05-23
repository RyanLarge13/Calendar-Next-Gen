import { useContext } from "react";
import { motion } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";

const Confirm = ({ func }) => {
  const { setConfirm } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center fixed bottom-20 right-5 left-5 bg-white z-50 p-3 rounded-md shadow-md"
    >
      <button onClick={() => func()}>Yes</button>
      <button onClick={() => setConfirm(false)}>No</button>
    </motion.div>
  );
};

export default Confirm;
