import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import InteractiveContext from "../../context/InteractiveContext";
import { useModalActions } from "../../context/ContextHooks/ModalContext";
import Kanban from "./Kanban";

const Kanbans = () => {
  const { kanbans = [], preferences } = useContext(UserContext);
  const { setType, setAddNewEvent, setMenu } = useContext(InteractiveContext);
  const { openModal } = useModalActions();
  const [projectId, setProjectId] = useState(null);
  const [folderId, setFolderId] = useState(null);
  const [query, setQuery] = useState("");
  const project = kanbans.find((item) => item.id === projectId);
  const folders = Array.isArray(project?.folders) ? project.folders : [];
  const folder = folders.find((item, index) => (item.id ?? index) === folderId);
  const surface = preferences.darkMode ? "bg-[#202020] border-white/10 text-white" : "bg-white border-black/10 text-slate-900";
  const createProject = () => { setMenu(false); setType("kanban"); setAddNewEvent(true); openModal(); };
  const projects = kanbans.filter((item) => item.title?.toLowerCase().includes(query.toLowerCase()));

  return <div className="px-3 md:px-6 pt-24 pb-24 max-w-7xl mx-auto">
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div><p className="text-xs opacity-60 uppercase tracking-wider">Workspace</p><h1 className="text-2xl font-semibold">Kanban projects</h1></div>
      <button type="button" onClick={createProject} className="rounded-xl bg-cyan-600 text-white px-4 py-2 text-sm font-semibold">+ New project</button>
    </div>
    {project ? <>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <button type="button" onClick={() => { setProjectId(null); setFolderId(null); }} className="rounded-lg border px-3 py-2 text-sm">← All projects</button>
        <h2 className="text-xl font-semibold">{project.title}</h2>
        <span className="text-xs opacity-60">{folders.length} folders</span>
      </div>
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4">
        <aside className={`rounded-2xl border p-4 space-y-2 ${surface}`}>
          <h3 className="text-sm font-semibold mb-3">Folders</h3>
          {folders.length ? folders.map((item, index) => <button key={item.id ?? index} type="button" onClick={() => setFolderId(item.id ?? index)}
            className={`block w-full text-left rounded-xl border p-3 text-sm ${folderId === (item.id ?? index) ? "border-cyan-500 bg-cyan-500/10" : "border-current/10"}`}>
            <span className="font-medium">{item.title}</span><span className="block text-xs opacity-60">{Array.isArray(item.boards) ? item.boards.length + " boards" : "Folder"}</span>
          </button>) : <p className="text-sm opacity-60">No folders have been created.</p>}
          <p className="text-xs opacity-50 pt-4">Folder editing will be available when the server supports it.</p>
        </aside>
        <main className={`rounded-2xl border p-5 min-h-[260px] ${surface}`}>
          {!folder ? <div><h3 className="font-semibold">Choose a folder</h3><p className="text-sm opacity-60 mt-2">Select a folder to explore its boards and cards.</p></div>
          : <div><h3 className="text-xl font-semibold">{folder.title}</h3><p className="text-sm opacity-60 mt-1">Folder contents</p>
            {Array.isArray(folder.boards) && folder.boards.length ? <div className="grid md:grid-cols-2 gap-3 mt-5">{folder.boards.map((board, index) => <div key={board.id ?? index} className="rounded-xl border border-current/10 p-4"><h4 className="font-semibold">{board.title || board.name || "Untitled board"}</h4>
              {Array.isArray(board.cards) && board.cards.length ? <div className="space-y-2 mt-3">{board.cards.map((card, i) => <div key={card.id ?? i} className="rounded-lg border border-current/10 p-3 text-sm">{card.title || card.name || "Untitled card"}</div>)}</div> : <p className="text-xs opacity-60 mt-3">No cards in this board.</p>}</div>)}</div>
              : <p className="mt-6 text-sm opacity-60">No boards are available in this folder yet.</p>}
          </div>}
        </main>
      </div>
    </> : <>
      <input aria-label="Filter Kanban projects" placeholder="Find a project…" value={query} onChange={(e) => setQuery(e.target.value)} className={`w-full mb-5 rounded-xl border px-4 py-3 text-sm ${surface}`} />
      {projects.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{projects.map((item) => <Kanban key={item.id} kanban={item} setKanbanView={(selected) => { setProjectId(selected.id); setFolderId(null); }} />)}</div>
        : <div className={`rounded-2xl border p-8 text-center ${surface}`}><p className="font-semibold">{kanbans.length ? "No matching projects" : "No projects yet"}</p><p className="text-sm opacity-60 mt-2">Create a project to organize your Kanban folders.</p></div>}
    </>}
  </div>;
};

export default Kanbans;
