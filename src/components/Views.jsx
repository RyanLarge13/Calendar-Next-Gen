import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarDayFill,
  BsFillCalendarMonthFill,
  BsXCircleFill,
  BsColumnsGap,
} from "react-icons/bs";
import { MdViewAgenda } from "react-icons/md";
import InteractiveContext from "../context/InteractiveContext";

const Views = () => {
  const { setView } = useContext(InteractiveContext);

  const [show, setShow] = useState(false);

  return (
    <>
      <div
        onClick={() => setShow((prev) => !prev)}
        className="absolute bottom-5 left-5 z-[100] p-3 rounded-full flex justify-center items-center bg-gradient-to-tr from-lime-200 to-yellow-100 shadow-md"
      >
        {show ? <BsXCircleFill /> : <BsColumnsGap />}
      </div>
      <motion.div
        animate={
          show ? { x: 130, y: 5, scale: 1.25 } : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs rounded-full absolute z-[700] left-5 bottom-5 bg-gradient-to-r from-pink-300 to-violet-200 shadow-md`}
      >
        <MdViewAgenda />
      </motion.div>
      <motion.div
        animate={
          show
            ? { x: 120, y: -50, scale: 1.25, transition: { delay: 0.1 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs rounded-full absolute z-[700] left-5 bottom-5 bg-gradient-to-r from-lime-300 to-emerald-200 shadow-md`}
      >
        <BsFillCalendarDayFill
          onClick={() => {
            setShow(false);
            setView("day");
          }}
        />
      </motion.div>
      <motion.div
        animate={
          show
            ? { x: 95, y: -105, scale: 1.25, transition: { delay: 0.2 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs rounded-full absolute z-[700] left-5 bottom-5 bg-gradient-to-r from-red-300 to-rose-200 shadow-md`}
      >
        <BsFillCalendarMonthFill
          onClick={() => {
            setShow(false);
            setView("month");
          }}
        />
      </motion.div>
      <motion.div
        animate={
          show
            ? { x: 55, y: -150, scale: 1.25, transition: { delay: 0.3 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs rounded-full absolute z-[700] left-5 bottom-5 bg-gradient-to-r from-cyan-300 to-sky-200 shadow-md`}
      >
        <BsColumnsGap />
      </motion.div>
      <motion.div
        animate={
          show
            ? { x: -5, y: -170, scale: 1.25, transition: { delay: 0.4 } }
            : { x: 0, y: 0, scale: 0 }
        }
        className={`p-3 text-xs rounded-full absolute z-[700] left-5 bottom-5 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md`}
      >
        <BsFillCalendarWeekFill />
      </motion.div>
    </>
  );
};

export default Views;
