import React, { useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../../context/UserContext";

const SystemNotif = () => {
  const { systemNotif, setSystemNotif, preferences } = useContext(UserContext);

  const notifTimeoutRef = useRef(null);

  const handleDrag = (e) => {
    const end = e.clientX;
    const minDistance = window.innerWidth / 1.4;
    if (end > minDistance) {
      setSystemNotif({ show: false });
    }
  };

  useEffect(() => {
    if (systemNotif.show === true && systemNotif.hasCancel === false) {
      notifTimeoutRef.current = setTimeout(() => {
        setSystemNotif({ show: false });
      }, 5000);
    } else {
      clearTimeout(notifTimeoutRef.current);
    }

    return () => {
      clearTimeout(notifTimeoutRef.current);
    };
  }, [systemNotif, setSystemNotif]);

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
          className={`will-change-transform fixed top-10 z-[999] px-4 py-3 pb-1 rounded-xl shadow-lg w-[90vw] left-[5vw] max-w-[400px] backdrop-blur-sm border 
    ${
      preferences.darkMode
        ? "bg-[#222]/90 text-white border-white/10"
        : "bg-white/90 text-black border-black/10"
    }`}
          onPointerDown={() =>
            !systemNotif.hasCancel
              ? setSystemNotif({ ...systemNotif, hasCancel: true })
              : null
          }
        >
          {/* Progress bar */}
          {!systemNotif.hasCancel && (
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: "100%",
                transition: { duration: 5 },
              }}
              className={`absolute top-0 left-0 h-[3px] ${systemNotif.color} rounded-full`}
            />
          )}

          {/* Accent strip */}
          <div
            className={`absolute top-0 left-0 bottom-0 ${systemNotif.color} w-[4px] rounded-l-xl`}
          />

          {/* Content */}
          <div className="ml-3">
            <p className="text-base font-semibold tracking-tight">
              {systemNotif.title}
            </p>
            <p
              className={`text-sm leading-snug ${
                preferences.darkMode ? "text-white" : "text-black"
              } mt-1`}
            >
              {systemNotif.text.split(/\|\|\||\n/).map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Actions */}
          {systemNotif.actions?.length > 0 && (
            <div className="mt-4 pt-1 border-t border-white/10 dark:border-gray-700 flex justify-end gap-2">
              {systemNotif.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.func()}
                  className="text-sm font-medium px-3 py-2 rounded-md 
                     hover:bg-black/5 dark:hover:bg-white/10 
                     transition-colors"
                >
                  {action.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotif;
