import { useContext } from "react";
import { FaFolder } from "react-icons/fa";
import UserContext from "../context/UserContext";

const Kanbans = () => {
  const { kanbans } = useContext(UserContext);

  const openModalAndSetType = () => {};

  return (
    <div className="mt-5 grid grid-cols-2 place-items-center gap-5">
      {kanbans.length > 0 ? (
        kanbans.map((kanban) => (
          <div
            key={kanban.id}
            className={`${kanban.color} p-2 rounded-md shadow-md h-40 w-full`}
          >
            <div className="flex justify-between items-center p-2 rounded-md shadow-md bg-white">
              <h2>{kanban.title}</h2>
              <FaFolder />
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold mb-2">Create a new project</h2>
          </div>
          <div
            className="text-2xl p-2"
            onClick={() => openModalAndSetType()}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Kanbans;
