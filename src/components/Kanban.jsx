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
      className={`bg-gradient-to-tr ${startColor} ${endColor} p-2 rounded-md shadow-lg w-full cursor-pointer`}
    >
      <div className="from-violet-100 to-violet-300 from-amber-100 to-amber-300 from-indigo-100 to-indigo-300"></div>
      <div className="flex justify-between items-center p-2 rounded-md shadow-md bg-white">
        <h2 className="text-xl font-semibold mr-4">{kanban.title}</h2>
        <div className="flex justify-end items-center gap-x-3 text-sm">
          <button>
            <FaShareAlt />
          </button>
          <button>
            <FaEdit />
          </button>
          <button>
            <FaBell />
          </button>
          <button>
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs bg-white px-2 py-1 rounded-md w-min">
        {new Date(kanban.createdAt).toLocaleDateString()}
      </p>
      <div className="flex justify-start items-center gap-x-2 bg-white px-2 py-1 rounded-md mt-1 w-min">
        <p className="font-semibold text-xs">{kanban.folders.length}</p>
        <FaFolder className="text-slate-500" />
      </div>
      <div className="mt-5 flex justify-between items-center">
        <div className="flex justify-center items-center">
          <img
            src={user.avatarUrl}
            alt="associate"
            className="w-5 h-5 rounded-full shadow-sm"
          />
          {kanban?.users?.map((usr, index) => (
            <div
              key={index}
              style={{ transform: `translateX(-${5 * index})px` }}
            >
              <img
                src={usr.avatarUrl}
                alt="associate"
                className="w-5 h-5 rounded-full shadow-sm"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setKanbanView(kanban)}
          className="p-2 rounded-full bg-white text-center"
        >
          <FaFolderOpen />
        </button>
      </div>
    </div>
  );
};

export default Kanban;
