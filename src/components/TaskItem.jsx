import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const TaskItem = ({ taskItem }) => {
  const [isChecked, setIsChecked] = useState(taskItem.complete);

  const handleChecked = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="p-3 py-4 border-b border-b-slate-300 bg-white">
      <label htmlFor={taskItem} className="flex">
        <input
          onChange={(e) => handleChecked(e)}
          type="checkbox"
          value={taskItem.text}
          checked={isChecked}
          className="text-black"
        />
        <div className=" ml-5 w-full flex justify-between items-center">
          <p
            className={`${
              isChecked === true ? "line-through text-slate-400" : ""
            } mr-2`}
          >
            {taskItem.text}
          </p>
          <div>
            <AiFillCloseCircle />
          </div>
        </div>
      </label>
    </div>
  );
};

export default TaskItem;
