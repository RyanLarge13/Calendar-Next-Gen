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

  const addTask = () => {
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
    <div className="mt-20">
      <p className="text-center">Tasks Today</p>
      <input
        value={title}
        placeholder="Task"
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md shadow-md p-2 mt-10 mb-5"
      />
      <button
        type="button"
        onClick={() => addTask()}
        className="w-full rounded-md shadow-md bg-gradient-to-r from-green-300 to-lime-200 py-1"
      >
        Add
      </button>
      <div className="mt-10">
        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <div
              key={index}
              className="bg-slate-100 p-3 border-b border-b-slate-300"
            >
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
      <div className="flex flex-col w-full gap-y-5 mb-5 mt-10 text-center text-xs font-semibold">
        <button
          onClick={() => {}}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddTask;
