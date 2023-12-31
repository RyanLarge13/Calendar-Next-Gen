import { useContext } from "react";
import { motion } from "framer-motion";
import UserContext from "../context/UserContext";

const Settings = ({ setOption }) => {
  const { user, preferences, setPreferences } = useContext(UserContext);

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

  const setTheme = () => {
    const newPreferences = {
      ...preferences,
      darkMode: !preferences.darkMode,
    };
    localStorage.setItem("preferences", JSON.stringify(newPreferences));
    setPreferences(newPreferences);
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
      className="fixed inset-0 bg-white z-50 p-5"
    >
      <h2 className="text-4xl pb-2 border-b">Settings</h2>
      <button onClick={() => setTheme()}>
        {preferences.darkMode ? "Light Theme" : "Dark Theme"}
      </button>
    </motion.div>
  );
};

export default Settings;
