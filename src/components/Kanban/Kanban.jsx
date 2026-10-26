import { useContext } from "react";
import UserContext from "../../context/UserContext";

const Kanban = ({ kanban, setKanbanView }) => {
  const { preferences } = useContext(UserContext);
  const folders = Array.isArray(kanban.folders) ? kanban.folders : [];
  const created = kanban.createdAt ? new Date(kanban.createdAt) : null;
  return <article className={`relative rounded-2xl border overflow-hidden shadow-sm ${preferences.darkMode ? "bg-[#202020] border-white/10 text-white" : "bg-white border-black/10 text-slate-900"}`}>
    <div className={`absolute inset-y-0 left-0 w-2 ${kanban.color || "bg-cyan-500"}`} />
    <div className="p-5 pl-7">
      <p className="text-xs uppercase tracking-wider opacity-60">Kanban project</p>
      <h2 className="text-xl font-semibold mt-2 break-words">{kanban.title || "Untitled project"}</h2>
      <div className="flex gap-3 flex-wrap text-xs opacity-65 mt-4"><span>{folders.length} folders</span>{created && Number.isFinite(created.getTime()) && <span>Created {created.toLocaleDateString()}</span>}</div>
      <button type="button" onClick={() => setKanbanView(kanban)} className="mt-5 rounded-xl bg-cyan-600 text-white px-4 py-2 text-sm font-semibold">Open project</button>
    </div>
  </article>;
};
export default Kanban;
