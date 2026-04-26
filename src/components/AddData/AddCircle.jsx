import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AiFillSchedule } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import {
  BsAlarmFill,
  BsFillCalendar2EventFill,
  BsFillCalendarPlusFill,
  BsFillClipboardDataFill,
  BsFillShareFill,
  BsFillTrashFill,
  BsListCheck,
  BsListTask,
  BsSearch,
  BsXCircleFill,
} from "react-icons/bs";
import { FaStickyNote } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoIosAddCircle, IoMdTimer } from "react-icons/io";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { useModalActions } from "../../context/ContextHooks/ModalContext";

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
  const { setString, string, dateObj } = useContext(DatesContext);
  const { setSystemNotif } = useContext(UserContext);
  const { openModal } = useModalActions();
  // const open = useModalState();

  const [show, setShow] = useState(false);
  const [showMenuBtns, setShowMenuBtns] = useState(false);

  useEffect(() => {
    if (showLogin) {
      setShow(false);
    }
  }, [showLogin]);

  // useEffect(() => {
  //   if (!open) {
  //     setShowMenuBtns(true);
  //   }
  // }, [open]);

  const openModalAndSetType = (type) => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setShow(false);
    setType(type);
    if (menu) {
      setMenu(false);
    }
    openModal();
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

  const baseFab = `
  fixed z-[700] right-5 bottom-5
  flex items-center justify-center
  rounded-full cursor-pointer
  border backdrop-blur-md
  shadow-lg shadow-black/10
  transition-all duration-200 ease-out
  hover:scale-110 active:scale-95
`;

  const mainFab = `
  ${baseFab}
  w-[44px] h-[44px] p-3
  text-slate-900
  bg-gradient-to-tr from-cyan-300 via-sky-200 to-cyan-100
  border-white/40
`;

  const menuFab = (gradient) => `
  ${baseFab}
  p-3 text-sm
  ${gradient}
  border-white/40
  text-slate-900
`;

  return (
    <>
      {menu ? (
        <>
          <div
            onClick={() => setShowMenuBtns((prev) => !prev)}
            className={mainFab}
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
            className={menuFab(
              "bg-gradient-to-tr from-emerald-300 via-lime-200 to-green-100",
            )}
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
            className={menuFab(
              "bg-gradient-to-tr from-rose-400 via-pink-300 to-red-200",
            )}
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
            className={menuFab(
              "bg-gradient-to-tr from-sky-400 via-blue-300 to-cyan-200",
            )}
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
            className={menuFab(
              "bg-gradient-to-tr from-fuchsia-400 via-pink-300 to-violet-200",
            )}
          >
            <BsSearch />
          </motion.div>
        </>
      ) : (
        <motion.div
          onClick={() => setShow((prev) => !prev)}
          className={`
        ${mainFab}
        ${
          showLogin || type !== null
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }
      `}
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
        className={menuFab(
          "bg-gradient-to-tr from-fuchsia-400 via-pink-300 to-violet-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-lime-300 via-emerald-300 to-green-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-rose-400 via-pink-300 to-red-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-cyan-300 via-sky-300 to-blue-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-amber-300 via-orange-300 to-yellow-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-indigo-400 via-purple-300 to-violet-200",
        )}
        onClick={() => setShow(false)}
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
        className={menuFab(
          "bg-gradient-to-tr from-white via-slate-100 to-slate-200",
        )}
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
        className={menuFab(
          "bg-gradient-to-tr from-teal-300 via-cyan-300 to-purple-200",
        )}
        onClick={() => setShow(false)}
      >
        <HiUserGroup />
      </motion.div>

      <motion.div
        onClick={() => openModalAndSetType("timer")}
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -175,
                y: -30,
                scale: 1.25,
                opacity: 1,
                transition: { delay: 0.8 },
              }
            : { x: 0, y: 0, scale: 0 }
        }
        className={menuFab(
          "bg-gradient-to-tr from-yellow-200 via-amber-200 to-pink-200",
        )}
      >
        <IoMdTimer />
      </motion.div>
    </>
  );
};

export default AddCircle;
