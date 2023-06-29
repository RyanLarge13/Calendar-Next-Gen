import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  BsFillCalendarPlusFill,
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListCheck,
  BsXCircleFill,
  BsFillClipboardDataFill,
  BsListTask,
} from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

export const AddCircle = () => {
  const { setAddNewEvent, setMenu, type, setType, showLogin } =
    useContext(InteractiveContext);
  const { setOpenModal, setString, string } = useContext(DatesContext);

  const [show, setShow] = useState(false);

  const openModalAndSetType = (type) => {
    if (!string) {
      setString(new Date().toLocaleDateString());
    }
    setShow(false);
    setType(type);
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  return (
    <>
      <motion.div
        animate={
          type === null ? { bottom: 20, right: 20 } : { bottom: 80, left: 20 }
        }
        onClick={() => setShow((prev) => !prev)}
        className={`fixed w-[40px] h-[40px] ${
          showLogin
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        } p-3 rounded-full cursor-pointer flex justify-center items-center bg-gradient-to-tr from-lime-200 to-yellow-100 shadow-md`}
      >
        {show ? <BsXCircleFill /> : <BsFillCalendarPlusFill />}
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("task")}
        animate={
          show ? { x: -130, y: 5, scale: 1.25 } : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[100] right-5 bottom-5 bg-gradient-to-r from-pink-300 to-violet-200 shadow-md`}
      >
        <BsListTask />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("kanban")}
        animate={
          show
            ? { x: -120, y: -50, scale: 1.25, transition: { delay: 0.1 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-lime-300 to-emerald-200 shadow-md`}
      >
        <BsFillClipboardDataFill />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("reminder")}
        animate={
          show
            ? { x: -95, y: -105, scale: 1.25, transition: { delay: 0.2 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-red-300 to-rose-200 shadow-md`}
      >
        <BsAlarmFill />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("todo-list")}
        animate={
          show
            ? { x: -55, y: -150, scale: 1.25, transition: { delay: 0.3 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-cyan-300 to-sky-200 shadow-md`}
      >
        <BsListCheck />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("event")}
        animate={
          show
            ? { x: 5, y: -170, scale: 1.25, transition: { delay: 0.4 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md`}
      >
        <BsFillCalendar2EventFill />
      </motion.div>
    </>
  );
};

export default AddCircle;
