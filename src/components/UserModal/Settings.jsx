import { useContext } from "react";
import { motion } from "framer-motion";
import { RiSunFill } from "react-icons/ri";
import { BiSolidMoon } from "react-icons/bi";
import UserContext from "../context/UserContext";
import Switch from "./Switch";
import { FaMinusCircle } from "react-icons/fa";

const Settings = ({ setOption }) => {
  const { preferences, setPreferences } = useContext(UserContext);

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

  const setTheme = (newVal) => {
    const meta = document.getElementById("theme-color-meta");
    if (meta) {
      meta.setAttribute(
        "content",
        preferences.darkMode ? "#FFFFFF" : "#222222"
      );
    }
    const newPreferences = {
      ...preferences,
      darkMode: newVal,
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
      className={`fixed inset-0 z-50 p-5 lg:left-[60%] ${
        preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-4xl">Settings</h2>
        <button onClick={() => setOption(null)} className="text-xl p-3">
          <FaMinusCircle />
        </button>
      </div>

      <Switch
        title={preferences.darkMode ? <RiSunFill /> : <BiSolidMoon />}
        styles="text-3xl p-3 rounded-md shadow-lg mt-10"
        value={preferences.darkMode}
        toggle={setTheme}
      />
    </motion.div>
  );
};

export default Settings;
