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
      <div className="fixed right-[65vw] bottom-5 flex flex-col justify-center items-center px-2">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="p-3 rounded-full shadow-md bg-gradient-to-r from-red-300 to-red-200"
        >
          <MdCancel />
        </button>
        <button
          onClick={() => {}}
          className="rounded-full p-3 shadow-md bg-gradient-to-r from-green-300 to-green-200 mt-5"
        >
          <BsFillSaveFill />
        </button>
      </div>
    </div>
  );
};

export default AddTask;
