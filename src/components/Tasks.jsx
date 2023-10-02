import { useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";
import TaskItem from "./TaskItem";

const Tasks = () => {
  const { userTasks } = useContext(UserContext);
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
        userTasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 my-5 rounded-md shadow-md ${task.color}`}
          >
            <div className="rounded-md shadow-md bg-white p-2 mb-2 flex justify-between items-center">
              <p>{task.date}</p>
              <p className="font-semibold">
                {task.tasks.filter((tsk) => tsk.complete).length} /{" "}
                {task.tasks.length}
              </p>
            </div>
            <div>
              {task.tasks.map((item) => (
                <TaskItem key={item.id} taskItem={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
