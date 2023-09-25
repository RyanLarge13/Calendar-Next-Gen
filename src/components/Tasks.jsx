import { useContext } from "react";
import UserContext from "../context/UserContext";
import { IoIosAddCircle} from "react-icons/io";

const Tasks = () => {
  const { userTasks } = useContext(UserContext);

  return (
    <div className="p-3">
      {userTasks.length < 1 && (
        <div>
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">No Tasks to Show</h2>
            </div>
            <div
              className="text-2xl p-2" //onClick={() => openModalAndSetType()}
            >
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
