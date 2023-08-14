import { motion } from "framer-motion";
import { FaStickyNote } from "react-icons/fa";
import { AiTwotoneHome, AiFillSchedule } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";
import {
  BsListCheck,
  BsFillClipboardDataFill,
  BsListTask,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { IoIosAlarm } from "react-icons/io";
import InteractiveContext from "../context/InteractiveContext";
import { useContext } from "react";

const MenuNavigation = () => {
  const { showCategory, setShowCategory } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 bg-white z-20 grid grid-cols-4 place-items-center mb-10 shadow-md rounded-md"
    >
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "reminders" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) => (prev === "reminders" ? null : "reminders"))
        }
      >
        <IoIosAlarm />
        <p className="text-xs">reminders</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "lists" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) => (prev === "lists" ? null : "lists"))
        }
      >
        <BsListCheck />
        <p className="text-xs">lists</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "tasks" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) => (prev !== "tasks" ? "tasks" : null))
        }
      >
        <BsListTask />
        <p className="text-xs">tasks</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "kanban" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) => (prev !== "kanban" ? "kanban" : null))
        }
      >
        <BsFillClipboardDataFill />
        <p className="text-xs">kanban</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "events" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) => (prev !== "events" ? "events" : null))
        }
      >
        <BsFillCalendar2EventFill />
        <p className="text-xs">events</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "groupevents" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) =>
            prev !== "groupevents" ? "groupevents" : null
          )
        }
      >
        <HiUserGroup />
        <p className="text-xs">group</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "stickynotes" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) =>
            prev !== "stickynotes" ? "stickynotes" : null
          )
        }
      >
        <FaStickyNote />
        <p className="text-xs">sticky</p>
      </div>
      <div
        className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
          showCategory === "appointment" ? "bg-cyan-100" : "bg-white"
        }`}
        onClick={() =>
          setShowCategory((prev) =>
            prev !== "appointment" ? "appointment" : null
          )
        }
      >
        <AiFillSchedule />
        <p className="text-xs">appointments</p>
      </div>
      <div
        className="bottom-[-15px] absolute right-5 left-5 p-1 rounded-md shadow-md bg-cyan-100 flex justify-center items-center"
        onClick={() => setShowCategory(null)}
      >
        <AiTwotoneHome />
      </div>
    </motion.div>
  );
};

export default MenuNavigation;
