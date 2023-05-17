import { useState, useContext } from "react";
import { motion } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";

const Menu = () => {
  const { menu, setMenu } = useContext(InteractiveContext);

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
      <p>I am a menu!!</p>
    </motion.div>
  );
};

export default Menu;
