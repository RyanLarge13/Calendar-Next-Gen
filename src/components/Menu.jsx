import { useState, useContext } from "react";
import { motion, Reorder } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { deleteReminder } from "../utils/api.js";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const Menu = () => {
  const { menu, setMenu } = useContext(InteractiveContext);
  const { reminders, setReminders, user } = useContext(UserContext);
  const [showReminders, setShowReminders] = useState(true);
  const [start, setStart] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectable, setSelectable] = useState(false);
  let timeout;

  const checkEnd = (e) => {
    const width = window.innerWidth / 2;
    e.clientX - start >= width ? setMenu(false) : null;
  };

  const calcWidth = (time) => {
    const nowMinutes = new Date().getMinutes();
    const reminderMinutes = new Date(time).getMinutes();
    const nowHours = new Date().getHours() * 60;
    const reminderHours = new Date(time).getHours() * 60;
    const reminderTime = reminderMinutes + reminderHours;
    const now = nowMinutes + nowHours;
    const percentage = (now / reminderTime) * 100;
    if (percentage >= 100) {
      return 100;
    }
    return Math.floor(percentage);
  };

  const startTime = (id) => {
    if (selected.length > 1 && selected.includes(id)) {
      return removeSelected(id);
    }
    if (selected.length === 1 && selected.includes(id)) {
      setSelectable(false);
      return removeSelected(id);
    }
    if (selectable === true) {
      return addSelected(id);
    }
    timeout = setTimeout(() => {
      setSelectable(true);
      addSelected(id);
    }, 750);
  };

  const stopTime = (id) => {
    if (selectable === false) {
      clearTimeout(timeout);
    }
  };

  const addSelected = (id) => {
    setSelected((prev) => [...prev, id]);
  };

  const removeSelected = (id) => {
    const newList = selected.filter((item) => item !== id);
    setSelected(newList);
  };

  const deleteAReminder = (id) => {
    const token = localStorage.getItem("authToken");
    //test
    const newReminders = reminders.filter(
      (reminder) => reminder.id !== res.data.reminderId
    );
    return setReminders(newReminders);

    if (token) {
      deleteReminder(user.username, id, token)
        .then((res) => {
          const newReminders = reminders.filter(
            (reminder) => reminder.id !== res.data.reminderId
          );
          setReminders(newReminders);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin={true}
      dragConstraints={{ right: 0, left: 0 }}
      dragListener={false}
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
          <AiOutlinePlus className="ml-3" />
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
        <div>
          {reminders.map((reminder, index) => (
            <motion.div
              animate={
                selected.includes(reminder.id)
                  ? {
                      scaleX: 1.025,
                      scaleY: 1.1,
                      opacity: 0.75,
                      boxShadow: "0 0.1em 0.5em 0 #f00",
                    }
                  : { scale: 1, opacity: 1, boxShadow: "0 0.1em 0.5em 0 #eee" }
              }
              key={reminder.id}
              className={"p-2 relative rounded-md my-5"}
              style={{ fontSize: 11 }}
              onPointerDown={() => startTime(reminder.id)}
              onPointerUp={() => stopTime(reminder.id)}
              onPointerCancel={() => clearTimeout(timeout)}
            >
              <div className="z-50 pointer-events-none">
                <p>{new Date(reminder.time).toLocaleDateString()}</p>
                <p>{new Date(reminder.time).toLocaleTimeString()}</p>
                <p>{reminder.title}</p>
              </div>
              {selected.includes(reminder.id) && (
                <motion.button
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="px-4 py-1 rounded-md shadow-md bg-rose-300 absolute right-3 top-3"
                  onClick={(e) => deleteAReminder(reminder.id)}
                >
                  Delete
                </motion.button>
              )}
              <div
                className={`absolute inset-0 rounded-md bg-gradient-to-tr pointer-events-none ${
                  calcWidth(reminder.time) < 100
                    ? "from-green-100 to-lime-100"
                    : "from-red-100 to-rose-100"
                } z-[-1]`}
                style={{ width: `${calcWidth(reminder.time)}%` }}
              ></div>
            </motion.div>
          ))}
        </div>
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
