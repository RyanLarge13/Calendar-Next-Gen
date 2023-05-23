import { useState, useContext } from "react";
import { motion, Reorder } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Menu = () => {
  const { menu, setMenu } = useContext(InteractiveContext);
  const { reminders, setReminders } = useContext(UserContext);
  const [showReminders, setShowReminders] = useState(true);
  const [start, setStart] = useState(null);

  const checkEnd = (e) => {
    const width = window.innerWidth / 2;
    e.clientX - start >= width ? setMenu(false) : null;
  };

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin={true}
      dragConstraints={{ right: 0, left: 0 }}
      onDragStart={(e) => setStart(e.clientX)}
      onDragEnd={(e) => checkEnd(e)}
      initial={{ x: "-110%", opacity: 0 }}
      animate={
        menu
          ? {
              x: 0,
              opacity: 1,
              transition: { duration: 0.25, type: "spring", stiffness: 250 },
            }
          : { x: "-110%", opacity: 0 }
      }
      className="fixed inset-4 top-20 rounded-md bg-white shadow-md shadow-purple-200 overflow-y-auto"
      style={{ fontSize: 12 }}
    >
      <div
        onClick={() => setShowReminders((prev) => !prev)}
        className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
      >
        <div className="flex">
          <RiArrowUpDownFill />
          <AiOutlinePlus className="ml-3"/>
        </div>
        <p>Reminders</p>
      </div>
      <motion.div
        animate={
          showReminders
            ? {
                height: "max-content",
              }
            : { height: "0px" }
        }
        className="p-3 overflow-hidden shadow-sm"
      >
        <Reorder.Group axis="y" values={reminders} onReorder={setReminders}>
          {reminders.map((reminder, index) => (
            <Reorder.Item
              key={reminder.id}
              value={reminder}
              className="p-2 rounded-md shadow-sm bg-white my-5"
              style={{ fontSize: 11 }}
            >
              <p>{new Date(reminder.time).toLocaleDateString()}</p>
              <p>{new Date(reminder.time).toLocaleTimeString()}</p>
              <p>{reminder.title}</p>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </motion.div>
      <div
        onClick={() => {}}
        className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
      >
        <div className="flex">
          <RiArrowUpDownFill />
          <AiOutlinePlus />
        </div>
        <p>Todo Lists</p>
      </div>
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
