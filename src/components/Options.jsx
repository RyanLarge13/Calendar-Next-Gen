import { motion } from "framer-motion";

const Options = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >
      <div className="m-3">
        <div className="my-2 py-2 rounded-md shadow-sm">
          <p>Settings</p>
        </div>
        <div className="my-2 py-2 rounded-md shadow-sm">
          <p>Views</p>
        </div>
        <div className="my-2 py-2 rounded-md shadow-sm">
          <p>Settings</p>
        </div>
        <div className="my-2 py-2 rounded-md shadow-sm">
          <p>Settings</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Options;
