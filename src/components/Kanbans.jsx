import { useContext } from "react";
import Kanban from "./Kanban";
import UserContext from "../context/UserContext";

const Kanbans = () => {
  const { kanbans } = useContext(UserContext);

  const openModalAndSetType = () => {};

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-5">
      {kanbans.length > 0 ? (
        kanbans.map((kanban) => <Kanban kanban={kanban} key={kanban.id} />)
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
