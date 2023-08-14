import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarDayFill,
  BsFillCalendarMonthFill,
  BsXCircleFill,
  BsColumnsGap,
  BsSearch,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { MdViewAgenda } from "react-icons/md";
import { TbSwitch3 } from "react-icons/tb";
import InteractiveContext from "../context/InteractiveContext";

const Views = () => {
  const { setView, setFilters, showLogin, menu, setMenu } =
    useContext(InteractiveContext);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showLogin) {
      setShow(false);
    }
  }, [showLogin]);

  return (
    <>
      {menu ? (
        <div
          onClick={() => setMenu(false)}
          className="fixed cursor-pointer bottom-5 left-5 z-[700] p-3 rounded-full flex justify-center items-center bg-gradient-to-tr from-lime-200 to-yellow-100 shadow-md"
        >
          <BsFillCalendar2EventFill className="text-md" />
        </div>
      ) : (
        <div
          onClick={() => setShow((prev) => !prev)}
          className={`fixed cursor-pointer bottom-5 left-5 z-[700] ${
            showLogin
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          } p-3 rounded-full flex justify-center items-center bg-gradient-to-tr from-lime-200 to-yellow-100 shadow-md`}
        >
          {show ? <BsXCircleFill /> : <BsColumnsGap />}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          show
            ? { x: 130, y: 5, scale: 1.25, opacity: 1 }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-pink-300 to-violet-200 shadow-md`}
        onClick={() => {
          setShow(false);
          setView("agenda");
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-lime-300 to-emerald-200 shadow-md`}
        onClick={() => {
          setShow(false);
          setView("day");
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-red-300 to-rose-200 shadow-md`}
        onClick={() => {
          setShow(false);
          setView("month");
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-cyan-300 to-sky-200 shadow-md`}
        onClick={() => {
          setShow(false);
          setView("masonry");
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md`}
        onClick={() => {
          setShow(false);
          setView("week");
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-indigo-300 to-purple-200 shadow-md`}
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-white to-slate-200 shadow-md`}
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
        className={`p-3 text-xs cursor-pointer rounded-full fixed z-[700] left-5 bottom-5 bg-gradient-to-r from-teal-300 to-purple-200 shadow-md`}
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
