import { useState } from "react";
import { motion } from "framer-motion";

const Event = ({ event, setEvent }) => {
  const [start, setStart] = useState(0);
  const [open, setOpen] = useState(true);

  const checkToClose = (e) => {
    const end = e.clientY;
    if (end - start > window.innerHeight / 2.75) {
      setOpen(false);
      setTimeout(() => {
        setEvent(null);
      }, 100);
    }
  };

  return (
    <motion.div
      drag="y"
      dragSnapToOrigin="true"
      dragConstraints={{ top: 0 }}
      onDragStart={(e) => setStart(e.clientY)}
      onDragEnd={(e) => checkToClose(e)}
      initial={{ y: "100%" }}
      animate={open ? { y: 0 } : { y: "100%" }}
      className="fixed inset-3 top-[7%] rounded-md z-50 bg-white"
    >
      <div
        className={`w-full h-full rounded-md bg-opacity-20 p-3 ${event.color}`}
      >
        <h1>{event.summary}</h1>
      </div>
    </motion.div>
  );
};

export default Event;
