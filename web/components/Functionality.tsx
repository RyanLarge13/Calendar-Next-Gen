"use client";

import { AiOutlineSchedule } from "react-icons/ai";
import {
  BsFillCalendarEventFill,
  BsFillAlarmFill,
  BsStickyFill,
  BsFillKanbanFill,
} from "react-icons/bs";
import { GiArtificialHive, GiHabitatDome } from "react-icons/gi";
import { GoProjectSymlink, GoTasklist } from "react-icons/go";
import { GrGroup } from "react-icons/gr";
import { MdMeetingRoom } from "react-icons/md";

const Functionality = () => {
  return (
    <div className="flex flex-wrap justify-center lg:justify-end items-center gap-5">
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Events</h3>
        <BsFillCalendarEventFill className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Reminders</h3>
        <BsFillAlarmFill className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">AI Scheduling</h3>
        <GiArtificialHive className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Regimes</h3>
        <GiHabitatDome className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Project</h3>
        <GoProjectSymlink className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Notes</h3>
        <BsStickyFill className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Kanban Boards</h3>
        <BsFillKanbanFill className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Lists & Tasks</h3>
        <GoTasklist className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Group Events</h3>
        <GrGroup className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Scheduling</h3>
        <AiOutlineSchedule className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
      <div className="bg-slate-900 rounded-sm shadow-md flex justify-center items-center flex-col gap-y-3 hover:bg-slate-800 duration-200 hover:translate-y-[-5px] w-40 h-40">
        <h3 className="text-lg">Appointments</h3>
        <MdMeetingRoom className="text-5xl bg-gradient-to-tr from-cyan-200 to-cyan-300 text-black rounded-md p-1" />
      </div>
    </div>
  );
};

export default Functionality;
