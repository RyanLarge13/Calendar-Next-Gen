import { FaFolder } from "react-icons/fa";

const Kanban = ({ kanban, setKanbanView }) => {
  return (
    <div
      onClick={() => setKanbanView(kanban)}
      className={`${kanban.color} p-2 rounded-md shadow-md h-40 w-full cursor-pointer`}
    >
      <div className="flex justify-between items-center p-2 rounded-md shadow-md bg-white">
        <h2>{kanban.title}</h2>
        <div className="flex justify-center items-center gap-x-3">
          <p>{kanban.folders.length}</p>
          <FaFolder />
        </div>
      </div>
      <p className="mt-2 font-semibold text-xs">
        {new Date(kanban.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default Kanban;
