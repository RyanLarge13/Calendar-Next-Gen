import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AiFillSchedule } from "react-icons/ai";
import { FaStickyNote } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import {
  BsFillCalendarPlusFill,
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListCheck,
  BsXCircleFill,
  BsFillClipboardDataFill,
  BsListTask,
  BsFillShareFill,
  BsFillTrashFill,
  BsSearch,
} from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

export const AddCircle = () => {
  const {
    setAddNewEvent,
    setMenu,
    type,
    setType,
    showLogin,
    menu,
    showCategory,
  } = useContext(InteractiveContext);
  const { setOpenModal, setString, string, dateObj } = useContext(DatesContext);
  const { setSystemNotif } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const [showMenuBtns, setShowMenuBtns] = useState(false);

  useEffect(() => {
    if (showLogin) {
      setShow(false);
    }
  }, [showLogin]);

  const openModalAndSetType = (type) => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setShow(false);
    setType(type);
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  const prepareDelete = (type) => {
    const newNotif = {
      show: true,
      title: `Delete All ${type}s`,
      text: `Are you sure you want to delete all of your ${type}s? Your data will be lost forever`,
      color: "bg-red-500",
      hasCancel: true,
      actions: [
        {
          text: "CLOSE",
          func: () => {
            setSystemNotif({ show: false });
          },
        },
        { text: "Delete All Lists", func: () => {} },
      ],
    };
    setSystemNotif(newNotif);
  };

  return (
    <>
      {menu ? (
        <>
          <div
            onClick={() => setShowMenuBtns((prev) => !prev)}
            className="fixed w-[40px] h-[40px] z-[700] p-3 rounded-full cursor-pointer flex justify-center items-center bg-gradient-to-tr right-5 bottom-5 from-cyan-200 to-cyan-100 shadow-md"
          >
            <BiCategoryAlt />
          </div>
          <motion.div
            onClick={() => openModalAndSetType(showCategory)}
            initial={{ opacity: 0 }}
            animate={
              showMenuBtns
                ? { x: -75, y: -45, scale: 1.25, opacity: 1 }
                : { x: 0, y: 0, scale: 0 }
            }
            className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-green-300 to-lime-200 shadow-md`}
          >
            <IoIosAddCircle />
          </motion.div>
          <motion.div
            onClick={() => prepareDelete(showCategory)}
            initial={{ opacity: 0 }}
            animate={
              showMenuBtns
                ? { x: -40, y: -90, scale: 1.25, opacity: 1 }
                : { x: 0, y: 0, scale: 0 }
            }
            className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-red-300 to-rose-200 shadow-md`}
          >
            <BsFillTrashFill />
          </motion.div>
          <motion.div
            onClick={() => {}}
            initial={{ opacity: 0 }}
            animate={
              showMenuBtns
                ? { x: 5, y: -120, scale: 1.25, opacity: 1 }
                : { x: 0, y: 0, scale: 0 }
            }
            className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-blue-300 to-sky-200 shadow-md`}
          >
            <BsFillShareFill />
          </motion.div>
          <motion.div
            onClick={() => {}}
            initial={{ opacity: 0 }}
            animate={
              showMenuBtns
                ? { x: -90, y: 5, scale: 1.25, opacity: 1 }
                : { x: 0, y: 0, scale: 0 }
            }
            className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-pink-300 to-violet-200 shadow-md`}
          >
            <BsSearch />
          </motion.div>
        </>
      ) : (
        <motion.div
          onClick={() => setShow((prev) => !prev)}
          className={`fixed w-[40px] h-[40px] z-[700] ${
            showLogin || type !== null
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          } p-3 rounded-full cursor-pointer flex justify-center items-center bg-gradient-to-tr right-5 bottom-5 from-cyan-200 to-cyan-100 shadow-md`}
        >
          {show ? <BsXCircleFill /> : <BsFillCalendarPlusFill />}
        </motion.div>
      )}
      <motion.div
        onClick={() => openModalAndSetType("task")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? { x: -130, y: 5, scale: 1.25, opacity: 1 }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-pink-300 to-violet-200 shadow-md`}
      >
        <BsListTask />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("kanban")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -120,
                y: -50,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.1 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-lime-300 to-emerald-200 shadow-md`}
      >
        <BsFillClipboardDataFill />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("reminder")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -95,
                y: -105,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.2 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-red-300 to-rose-200 shadow-md`}
      >
        <BsAlarmFill />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("todo-list")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -55,
                y: -150,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.3 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-cyan-300 to-sky-200 shadow-md`}
      >
        <BsListCheck />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("event")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 5,
                y: -170,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.4 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md`}
      >
        <BsFillCalendar2EventFill />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -10,
                y: -110,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.5 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-indigo-300 to-purple-200 shadow-md`}
        onClick={() => {
          setShow(false);
        }}
      >
        <AiFillSchedule />
      </motion.div>
      <motion.div
        onClick={() => openModalAndSetType("stickynote")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -50,
                y: -70,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.6 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-white to-slate-200 shadow-md`}
      >
        <FaStickyNote />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -75,
                y: -20,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.7 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] right-5 bottom-5 bg-gradient-to-r from-teal-300 to-purple-200 shadow-md`}
        onClick={() => {
          setShow(false);
        }}
      >
        <HiUserGroup />
      </motion.div>
    </>
  );
};

export default AddCircle;
