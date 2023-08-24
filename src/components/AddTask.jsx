import { useState, useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BsFillSaveFill } from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";

const AddTask = () => {
  const { setType, setAddNewEvent } = useContext(InteractiveContext);

  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState([]);
  const [title, setTitle] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    setTasks((prev) => [...prev, title]);
    setTitle("");
  };

  const removeTask = (aTask) => {
    const newTaskList = tasks.filter((tsk) => tsk !== aTask);
    setTasks(newTaskList);
  };

  const handleChecked = (e, task) => {
    if (e.target.checked) {
      setChecked((prev) => [...prev, task]);
    }
    if (!e.target.checked) {
      const newList = checked.filter((check) => check !== task);
      setChecked(newList);
    }
  };

  return (
    <div>
      <form onSubmit={addTask}>
        <input
          value={title}
          placeholder="Task"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full focus:outline-none text-4xl p-2 mt-10 mb-5"
        />
      </form>
      <button
        type="submit"
        onClick={addTask}
        className="w-full text-xs underline rounded-md shadow-md bg-gradient-to-r from-green-300 to-lime-200 py-2"
      >
        Add
      </button>
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <div key={index} className="p-3 py-4 border-b border-b-slate-300">
              <label htmlFor={task} className="flex">
                <input
                  onChange={(e) => handleChecked(e, task)}
                  type="checkbox"
                  value={task}
                  id={task}
                  name={task}
                  className="text-black"
                />
                <div className=" ml-5 w-full flex justify-between items-center">
                  <p
                    className={`${
                      checked.includes(task) ? "line-through" : ""
                    }`}
                  >
                    {task}
                  </p>
                  <AiFillCloseCircle onClick={() => removeTask(task)} />
                </div>
              </label>
            </div>
          ))}
      </div>
      <div className="absolute bottom-4 right-4 left-4 text-xs">
        <button
          onClick={() => {}}
          className="w-full px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="w-full mt-3 px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddTask;
