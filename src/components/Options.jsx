import { motion, AnimatePresence } from "framer-motion";

const Options = ({ showLogin }) => {
  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 right-0 left-0 z-[11]"
        >
          <div className="grid grid-cols-2 gap-5 p-5">
            <div className="flex justify-center items-center p-5 rounded-md shadow-md bg-purple-200">
              <p>Settings</p>
            </div>
            <div className="flex justify-center items-center p-5 rounded-md shadow-md bg-purple-200">
              <p>Views</p>
            </div>
            <div className="flex justify-center items-center p-5 rounded-md shadow-md bg-purple-200">
              <p>Settings</p>
            </div>
            <div className="flex justify-center items-center p-5 rounded-md shadow-md bg-purple-200">
              <p>Settings</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Options;
