import { useContext } from "react";
import {
  FaBell,
  FaEdit,
  FaFolder,
  FaFolderOpen,
  FaShareAlt,
  FaTrashAlt,
} from "react-icons/fa";
import UserContext from "../context/UserContext";

const Kanban = ({ kanban, setKanbanView }) => {
  const { user } = useContext(UserContext);

  const endColor = `to-${kanban.color.replace("bg-", "")}`;
  const startColor = `from-${kanban.color
    .replace("300", "100")
    .replace("bg-", "")}`;

  return (
    <div
      onContextMenu={() => {}}
      className={`${
        startColor && endColor
          ? `bg-gradient-to-tr ${startColor} ${endColor}`
          : "bg-white"
      } p-4 rounded-2xl shadow-lg w-full cursor-pointer transition-all duration-300 hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-sm px-4 py-3">
        <h2 className="text-lg font-semibold truncate">{kanban.title}</h2>
        <div className="flex items-center gap-x-3 text-slate-600">
          <button className="hover:text-indigo-500 transition-colors">
            <FaShareAlt />
          </button>
          <button className="hover:text-green-500 transition-colors">
            <FaEdit />
          </button>
          <button className="hover:text-amber-500 transition-colors">
            <FaBell />
          </button>
          <button className="hover:text-red-500 transition-colors">
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex gap-2 mt-3">
        <p className="text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          Created On,{" "}
          {new Date(kanban.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <p className="font-semibold text-xs">{kanban.folders.length}</p>
          <FaFolder className="text-slate-500" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-between items-center">
        {/* Avatars */}
        <div className="flex items-center">
          <img
            src={user.avatarUrl}
            alt="associate"
            className="w-7 h-7 rounded-full shadow-sm border-2 border-white"
          />
          {kanban?.users?.map((usr, index) => (
            <div
              key={index}
              style={{ transform: `translateX(-${6 * (index + 1)}px)` }}
            >
              <img
                src={usr.avatarUrl}
                alt="associate"
                className="w-7 h-7 rounded-full shadow-sm border-2 border-white"
              />
            </div>
          ))}
        </div>

        {/* Open button */}
        <button
          onClick={() => setKanbanView(kanban)}
          className="p-2 rounded-full bg-white/90 shadow-md hover:bg-indigo-100 transition-colors"
        >
          <FaFolderOpen className="text-indigo-600" />
        </button>
      </div>
    </div>
  );
};

export default Kanban;
