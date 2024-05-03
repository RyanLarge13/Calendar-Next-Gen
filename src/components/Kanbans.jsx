import { useContext, useState } from "react";
import { AiFillFolder } from "react-icons/ai";
import Kanban from "./Kanban";
import UserContext from "../context/UserContext";

const Kanbans = () => {
  const { kanbans } = useContext(UserContext);

  const [kanbanView, setKanbanView] = useState(null);

  const openModalAndSetType = () => {};

  return (
    <div>
      {kanbanView ? (
        <div className="flex justify-start items-start h-screen">
          <aside className="w-80 h-full bg-slate-200 p-3">
            <h2 className="text-2xl mb-3 font-semibold">{kanbanView.title}</h2>
            <div>
              <h3>Project Folders</h3>
              <div>
                {kanbanView.folders.map((folder, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-md my-2 shadow-md ${folder.color} flex justify-between items-center w-full`}
                  >
                    <p>{folder.title}</p>
                    <AiFillFolder />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-5 p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-5 text-black">
          {kanbans.length > 0 ? (
            kanbans.map((kanban) => (
              <Kanban
                kanban={kanban}
                key={kanban.id}
                setKanbanView={setKanbanView}
              />
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
      )}
    </div>
  );
};

export default Kanbans;
