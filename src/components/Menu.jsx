import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import Reminders from "./Reminders.jsx";
import Lists from "./Lists.jsx";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext.jsx";

const Menu = () => {
  const { setOpenModal, string, setString } = useContext(DatesContext);
  const { menu, setAddNewEvent, setType } = useContext(InteractiveContext);
  const [showReminders, setShowReminders] = useState(true);
  const [showLists, setShowLists] = useState(true);

  return (
    <motion.div
      initial={{ x: "-110%", opacity: 0 }}
      animate={
        menu
          ? {
              x: 0,
              opacity: 1,
              transition: { duration: 0.25, type: "spring", stiffness: 400 },
            }
          : { x: "-110%", opacity: 0 }
      }
      className="fixed inset-0 top-20 rounded-md bg-white shadow-md shadow-purple-200 overflow-y-auto"
      style={{ fontSize: 12 }}
    >
      <div className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center">
        <div className="flex">
          <RiArrowUpDownFill
            onClick={() => setShowReminders((prev) => !prev)}
            className="font-bold text-lg cursor-pointer mr-3"
          />
          <AiOutlinePlus
            onClick={() => {
              if (!string) {
                setString(new Date().toLocaleDateString());
              }
              setOpenModal(true);
              setAddNewEvent(true);
              setType("reminder");
            }}
            className="font-bold text-lg cursor-pointer mr-5"
          />
        </div>
        <p>Reminders</p>
      </div>
      <Reminders showReminders={showReminders} />
      <div
        onClick={() => setShowLists((prev) => !prev)}
        className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
      >
        <div className="flex">
          <RiArrowUpDownFill />
          <AiOutlinePlus />
        </div>
        <p>Todo Lists</p>
      </div>
      <Lists showLists={showLists} />
      <div
        onClick={() => {}}
        className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
      >
        <RiArrowUpDownFill />
        <p>Boards</p>
      </div>
      <div
        onClick={() => {}}
        className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
      >
        <RiArrowUpDownFill />
        <p>Tasks</p>
      </div>
    </motion.div>
  );
};

export default Menu;
