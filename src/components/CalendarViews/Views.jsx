import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  BsColumnsGap,
  BsFillCalendar2EventFill,
  BsFillCalendarDayFill,
  BsFillCalendarMonthFill,
  BsFillCalendarWeekFill,
  BsSearch,
  BsXCircleFill,
} from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { MdViewAgenda } from "react-icons/md";
import { TbSwitch3 } from "react-icons/tb";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { useModalState } from "../../context/ContextHooks/ModalContext";

const Views = () => {
  const { setView, setFilters, showLogin, menu, setMenu } =
    useContext(InteractiveContext);
  const { preferences } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const [invisible, setInvisible] = useState(false);

  const open = useModalState();

  useEffect(() => {
    if (showLogin) {
      setShow(false);
    }
    if (open) {
      setInvisible(true);
    }
    if (!open && invisible) {
      setInvisible(false);
    }
  }, [showLogin, open]);

  const updateViewPreferences = (viewType) => {
    try {
      const newPreferences = { ...preferences, view: viewType };
      localStorage.setItem("preferences", JSON.stringify(newPreferences));
    } catch (err) {
      console.log("Error updating view in preferences");
      console.log(err);
    }
  };

  const baseFab = `
  fixed z-[700] left-5 bottom-5
  flex items-center justify-center
  rounded-full cursor-pointer
  border backdrop-blur-md
  shadow-lg shadow-black/10
  transition-all duration-200 ease-out
  hover:scale-110 active:scale-95
`;

  const mainFab = `
  ${baseFab}
  p-3
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
      {!invisible ? (
        menu ? (
          <div onClick={() => setMenu(false)} className={mainFab}>
            <BsFillCalendar2EventFill className="text-md" />
          </div>
        ) : (
          <div
            onClick={() => setShow((prev) => !prev)}
            className={`
          ${mainFab}
          ${
            showLogin
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }
        `}
          >
            {show ? <BsXCircleFill /> : <BsColumnsGap />}
          </div>
        )
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? { x: 130, y: 5, scale: 1.25, opacity: 1 }
            : { x: 0, y: 0, scale: 0 }
        }
        className={menuFab(
          "bg-gradient-to-tr from-fuchsia-400 via-pink-300 to-violet-200",
        )}
        onClick={() => {
          setShow(false);
          setView("agenda");
          updateViewPreferences("agenda");
        }}
      >
        <MdViewAgenda />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 120,
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
        onClick={() => {
          setShow(false);
          setView("day");
          updateViewPreferences("day");
        }}
      >
        <BsFillCalendarDayFill />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 95,
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
        onClick={() => {
          setShow(false);
          setView("month");
          updateViewPreferences("month");
        }}
      >
        <BsFillCalendarMonthFill />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 55,
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
        onClick={() => {
          setShow(false);
          setView("masonry");
          updateViewPreferences("masonry");
        }}
      >
        <BsColumnsGap />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: -5,
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
        onClick={() => {
          setShow(false);
          setView("week");
          updateViewPreferences("week");
        }}
      >
        <BsFillCalendarWeekFill />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 10,
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
        onClick={() => {
          setShow(false);
          setFilters("search");
        }}
      >
        <BsSearch />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 50,
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
        onClick={() => {
          setShow(false);
          setView("week");
        }}
      >
        <CgOptions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? {
                x: 75,
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
        onClick={() => {
          setShow(false);
          setView("week");
        }}
      >
        <TbSwitch3 />
      </motion.div>
    </>
  );
};

export default Views;
