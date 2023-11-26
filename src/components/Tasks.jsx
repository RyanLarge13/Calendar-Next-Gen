import { useContext, useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import {
  BsListTask,
  BsPenFill,
  BsShareFill,
  BsTrashFill,
} from "react-icons/bs";
import { deleteTask } from "../utils/api";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const Tasks = () => {
  const { userTasks, setUserTasks, setSystemNotif } = useContext(UserContext);
  const { setType, setAddNewEvent, setMenu } = useContext(InteractiveContext);
  const { string, setString, setOpenModal } = useContext(DatesContext);
  const [isChecked, setIsChecked] = useState({});

  useEffect(() => {
    const initialIsCheckedState = {};

    userTasks.forEach((task, taskIndex) => {
      task.tasks.forEach((taskItem, taskItemIndex) => {
        initialIsCheckedState[`${taskIndex}-${taskItemIndex}`] =
          taskItem.complete;
      });
    });

    setIsChecked(initialIsCheckedState);
  }, [userTasks]);

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("task");
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  const handleChecked = (taskIndex, taskItemIndex, isChecked) => {
    const updatedUserTasks = [...userTasks];
    updatedUserTasks[taskIndex].tasks[taskItemIndex].complete = isChecked;
    setIsChecked((prevState) => ({
      ...prevState,
      [`${taskIndex}-${taskItemIndex}`]: isChecked,
    }));
    setUserTasks(updatedUserTasks);
  };

  const removeTaskItem = (taskIndex, taskItemIndex) => {
    const updatedUserTasks = [...userTasks];
    updatedUserTasks[taskIndex].tasks.splice(taskItemIndex, 1);
    setUserTasks(updatedUserTasks);
  };

  const deleteMyTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      deleteTask(token, taskId)
        .then((res) => {
          setSystemNotif({ show: false });
          console.log(res);
          const deletedTaskId = res.data.deletedTaskId;
          const newTasks = userTasks.filter((tsk) => tsk.id !== deletedTaskId);
          setUserTasks(newTasks);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
              <div
                onClick={() => {
                  const newConfirmation = {
                    show: true,
                    title: "Delete Task",
                    text: `Are you sure you want to delete your task? ${
                      task.tasks.filter((tsk) => tsk.complete === true).length <
                      task.tasks.length
                        ? `You have ${
                            task.tasks.filter((tsk) => tsk.complete === false)
                              .length
                          } items left to complete`
                        : ""
                    }`,
                    color: "bg-red-200",
                    hasCancel: true,
                    actions: [
                      {
                        text: "cancel",
                        func: () => setSystemNotif({ show: false }),
                      },
                      {
                        text: "delete",
                        func: () => deleteMyTask(task.id),
                      },
                    ],
                  };
                  setSystemNotif(newConfirmation);
                }}
              >
                <BsTrashFill />
              </div>
            </div>
            <div className="rounded-md shadow-md bg-white p-2 mb-2 flex justify-between items-center">
              <p>{task.date}</p>
              <p className="font-semibold">
                {task.tasks.filter((tsk) => tsk.complete).length} /{" "}
                {task.tasks.length}
              </p>
            </div>
            <div>
              {task.tasks.map((taskItem, taskItemIndex) => (
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
                      checked={isChecked[`${taskIndex}-${taskItemIndex}`]}
                      className="text-black"
                    />
                    <div className=" ml-5 w-full flex justify-between items-center">
                      <p
                        className={`${
                          isChecked[`${taskIndex}-${taskItemIndex}`] === true
                            ? "line-through text-slate-400"
                            : ""
                        } mr-2`}
                      >
                        {taskItem.text}
                      </p>
                      <div
                        onClick={() => removeTaskItem(taskIndex, taskItemIndex)}
                      >
                        <AiFillCloseCircle />
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
