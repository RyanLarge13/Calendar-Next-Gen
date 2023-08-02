import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";

const SystemNotif = () => {
  const { systemNotif, setSystemNotif } = useContext(UserContext);

  const handleDrag = (e) => {
    const end = e.clientX;
    const minDistance = window.innerWidth / 1.4;
    if (end > minDistance) {
      setSystemNotif({ show: false });
    }
  };

  return (
    <AnimatePresence>
      {systemNotif.show && (
        <motion.div
          drag="x"
          dragSnapToOrigin={true}
          onDragEnd={handleDrag}
          initial={{ y: -50, opacity: 0 }}
          exit={{ x: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-10 z-[999] p-3  pb-0 rounded-md shadow-md bg-white w-[90vw] left-[5vw] max-w-[400px]"
        >
          <div
            className={`absolute top-0 left-0 bottom-0 ${systemNotif.color} w-[5px] rounded-md`}
          ></div>
          <p className="text-lg font-semibold">{systemNotif.title}</p>
          <p className="text-sm">{systemNotif.text}</p>
          <div className="mt-3 p-1 border-t flex justify-between items-center">
            {systemNotif.actions?.map((action, index) => (
              <p
                key={index}
                onClick={() => action.func()}
                className="text-sm font-semibold"
              >
                {action.text}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotif;
