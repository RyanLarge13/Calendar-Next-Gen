import { FaFolder } from "react-icons/fa";

const Kanban = ({ kanban }) => {
  return (
    <div className={`${kanban.color} p-2 rounded-md shadow-md h-40 w-full`}>
      <div className="flex justify-between items-center p-2 rounded-md shadow-md bg-white">
        <h2>{kanban.title}</h2>
        <FaFolder />
      </div>
    </div>
  );
};

export default Kanban;
