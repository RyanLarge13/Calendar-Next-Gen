import { useState, useContext } from "react";
import { motion } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Menu = () => {
  const { menu, setMenu } = useContext(InteractiveContext);
  const { reminders } = useContext(UserContext);

  const [start, setStart] = useState(0);

  const checkToClose = (e) => {
    const end = e.clientX;
    if (start - end > window.innerWidth / 3) {
      setMenu(false);
    }
  };

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin="true"
      dragConstraints={{ right: 0 }}
      onDragStart={(e) => setStart(e.clientX)}
      onDragEnd={(e) => checkToClose(e)}
      initial={{ x: "-150%" }}
      animate={menu ? { x: 0 } : { x: "-150%" }}
      className="fixed p-3 inset-3 rounded-md bg-white shadow-md"
    >
      <h2>Reminders</h2>
      <div className="p-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="p-2 rounded-md shadow-md my-5">
            <p>{new Date(reminder.time).toLocaleDateString()}</p>
            <p>{new Date(reminder.time).toLocaleTimeString()}</p>
            <p>{reminder.title}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Menu;
