import { useContext, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import {
  BsListTask,
  BsPenFill,
  BsShareFill,
  BsTrashFill,
} from "react-icons/bs";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const Tasks = () => {
  const { userTasks, setUserTasks } = useContext(UserContext);
  const { setType, setAddNewEvent, setMenu } = useContext(InteractiveContext);
  const { string, setString, setOpenModal } = useContext(DatesContext);

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("task");
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  // const removeTaskItem = (taskIndex, taskItemIndex) => {
  //   const updatedUserTasks = [...userTasks];
  //   updatedUserTasks[taskIndex].tasks.splice(taskItemIndex, 1);
  //   setUserTasks(updatedUserTasks);
  // };

  return (
    <div className="p-3">
      {userTasks.length < 1 ? (
        <div>
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">No Tasks to Show</h2>
              <BsListTask />
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      ) : (
        userTasks.map((task, taskIndex) => (
          <div
            key={task.id}
            className={`p-3 my-5 rounded-md shadow-md ${task.color}`}
          >
            <div className="mb-3 flex justify-end items-center gap-x-3">
              <BsPenFill />
              <BsShareFill />
              <BsTrashFill />
            </div>
            <div className="rounded-md shadow-md bg-white p-2 mb-2 flex justify-between items-center">
              <p>{task.date}</p>
              <p className="font-semibold">
                {task.tasks.filter((tsk) => tsk.complete).length} /{" "}
                {task.tasks.length}
              </p>
            </div>
            <div>
              {task.tasks.map((taskItem, taskItemIndex) => {
                const [isChecked, setIsChecked] = useState(taskItem.complete);

                const handleChecked = (taskIndex, taskItemIndex, isChecked) => {
                  const updatedUserTasks = [...userTasks];
                  updatedUserTasks[taskIndex].tasks[taskItemIndex].complete =
                    isChecked;
                  setIsChecked(isChecked);
                  setUserTasks(updatedUserTasks);
                };

                const removeTaskItem = (taskIndex, taskItemIndex) => {
                  const updatedUserTasks = [...userTasks];
                  updatedUserTasks[taskIndex].tasks.splice(taskItemIndex, 1);
                  setUserTasks(updatedUserTasks);
                };

                return (
                  <div
                    key={taskItem.id}
                    className="p-3 py-4 border-b border-b-slate-300 bg-white"
                  >
                    <label htmlFor={taskItem} className="flex">
                      <input
                        onChange={(e) =>
                          handleChecked(
                            taskIndex,
                            taskItemIndex,
                            e.target.checked
                          )
                        }
                        type="checkbox"
                        value={taskItem.text}
                        checked={isChecked}
                        className="text-black"
                      />
                      <div className=" ml-5 w-full flex justify-between items-center">
                        <p
                          className={`${
                            isChecked === true
                              ? "line-through text-slate-400"
                              : ""
                          } mr-2`}
                        >
                          {taskItem.text}
                        </p>
                        <div
                          onClick={() =>
                            removeTaskItem(taskIndex, taskItemIndex)
                          }
                        >
                          <AiFillCloseCircle />
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
