import { useState } from "react";
import { motion } from "framer-motion";
import {
  BsFillCalendar2EventFill,
  BsAlarmFill,
  BsListCheck,
  BsFillClipboardDataFill,
  BsListTask,
  BsArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";

const CalendarEventTypeMenu = ({ type }) => {
  const [closed, setClosed] = useState(true);

  return (
    <motion.div
      animate={closed ? { y: "-95%" } : { y: 0 }}
      className="absolute top-0 bottom-0 left-3 w-[50px] bg-white rounded-sm flex flex-col justify-center items-center text-2xl"
    >
      <div>
        <div
          className={`${
            type === "event" ? "text-green-200" : "text-slate-200"
          } my-7 p-1 rounded-sm shadow-md`}
        >
          <BsFillCalendar2EventFill />
        </div>
        <div
          className={`${
            type === "reminder" ? "text-green-200" : "text-slate-200"
          } my-7 p-1 rounded-sm shadow-md`}
        >
          <BsAlarmFill />
        </div>
        <div
          className={`${
            type === "kanban" ? "text-green-200" : "text-slate-200"
          } my-7 p-1 rounded-sm shadow-md`}
        >
          <BsFillClipboardDataFill />
        </div>
        <div
          className={`${
            type === "todo-list" ? "text-green-200" : "text-slate-200"
          } my-7 p-1 rounded-sm shadow-md`}
        >
          <BsListCheck />
        </div>
        <div
          className={`${
            type === "task" ? "text-green-200" : "text-slate-200"
          } my-7 p-1 rounded-sm shadow-md`}
        >
          <BsListTask />
        </div>
      </div>
      <div
        onClick={() => setClosed((prev) => !prev)}
        className="absolute bottom-2"
      >
        {closed ? (
          <BsArrowDownSquareFill className="text-xl" />
        ) : (
          <BsFillArrowUpSquareFill />
        )}
      </div>
    </motion.div>
  );
};

export default CalendarEventTypeMenu;
