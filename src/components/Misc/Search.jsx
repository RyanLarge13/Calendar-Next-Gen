import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Portal from "./Portal";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import ReminderView from "../Reminders/ReminderView/ReminderView.jsx";
import { setStateAndPushWindowState } from "../../utils/helpers";

const asText = (...values) => values.filter((value) => typeof value === "string").join(" ").toLowerCase();
const validDate = (value) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

const Search = () => {
  const { filters, setFilters, setEvent } = useContext(InteractiveContext);
  const { eventsById = new Map(), remindersById = new Map(), lists = [], userTasks = [], stickies = [], preferences } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [activeReminder, setActiveReminder] = useState(null);
  const inputRef = useRef(null);
  const open = filters === "search";

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (activeReminder) setActiveReminder(null);
        else setFilters(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, activeReminder, setFilters]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const matches = (value) => value.includes(needle);
    const items = [];
    const add = (kind, record, title, details, date, searchable) => {
      if ((type === "all" || type === kind) && matches(searchable)) {
        items.push({ kind, record, title, details, date, key: kind + "-" + record.id });
      }
    };
    eventsById.forEach((event) => add("event", event, event.summary || event.title || "Untitled event",
      event.description || "", validDate(event.start?.startTime || event.startDate || event.date),
      asText(event.summary, event.title, event.description, event.date, event.location?.name, event.location?.address)));
    remindersById.forEach((reminder) => add("reminder", reminder, reminder.title || "Untitled reminder",
      reminder.notes || "", validDate(reminder.time), asText(reminder.title, reminder.notes, reminder.time)));
    lists.forEach((list) => add("list", list, list.title || "Untitled list",
      (list.items || []).map((item) => item.text || "").join(", "), null,
      asText(list.title, ...(list.items || []).map((item) => item.text))));
    userTasks.forEach((task) => add("task", task, task.title || "Untitled task",
      (task.tasks || []).map((item) => item.title || item.text || "").join(", "), null,
      asText(task.title, ...(task.tasks || []).map((item) => item.title || item.text))));
    stickies.forEach((sticky) => add("sticky", sticky, sticky.title || "Untitled sticky",
      sticky.text || sticky.body || sticky.content || "", null,
      asText(sticky.title, sticky.text, sticky.body, sticky.content)));
    return items.sort((a, b) => {
      const aTitle = a.title.toLowerCase().startsWith(needle) ? 0 : 1;
      const bTitle = b.title.toLowerCase().startsWith(needle) ? 0 : 1;
      return aTitle - bTitle || (a.date?.getTime() || Infinity) - (b.date?.getTime() || Infinity);
    }).slice(0, 80);
  }, [query, type, eventsById, remindersById, lists, userTasks, stickies]);

  const activate = (item) => {
    if (item.kind === "event") {
      setFilters(null);
      setStateAndPushWindowState(() => setEvent(item.record));
    } else if (item.kind === "reminder") {
      setActiveReminder(item.record);
    } else {
      setExpanded((previous) => previous === item.key ? null : item.key);
    }
  };

  const dark = preferences.darkMode;
  return (
    <>
      <AnimatePresence>
        {open && (
          <Portal>
            <motion.div className="fixed inset-0 z-[100] flex justify-center items-start pt-[min(12vh,100px)] px-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button type="button" aria-label="Close search" className="absolute inset-0 bg-black/45" onClick={() => setFilters(null)} />
              <motion.section role="dialog" aria-modal="true" aria-label="Search your calendar data"
                initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }}
                className={`relative w-full max-w-2xl max-h-[80dvh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${dark ? "bg-[#191919] border-white/15 text-white" : "bg-white border-black/10 text-slate-900"}`}>
                <div className="flex items-center gap-3 p-4 border-b border-current/10">
                  <BsSearch className="shrink-0 opacity-60" />
                  <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setExpanded(null); }}
                    placeholder="Search events, reminders, lists, tasks, notes…" aria-label="Search"
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm" />
                  {query && <button type="button" onClick={() => { setQuery(""); setExpanded(null); }} className="text-xs opacity-70">Clear</button>}
                  <button type="button" onClick={() => setFilters(null)} aria-label="Close" className="p-2 text-lg">×</button>
                </div>
                <div className="flex gap-2 overflow-x-auto p-3 border-b border-current/10">
                  {["all", "event", "reminder", "list", "task", "sticky"].map((kind) =>
                    <button key={kind} type="button" onClick={() => setType(kind)}
                      className={`capitalize whitespace-nowrap px-3 py-1.5 rounded-full text-xs border ${type === kind ? "bg-cyan-600 text-white border-cyan-600" : "border-current/20"}`}>{kind === "all" ? "All" : kind === "sticky" ? "Notes" : kind + "s"}</button>)}
                </div>
                <div className="overflow-y-auto min-h-0 p-3" aria-live="polite">
                  {!query.trim() ? <p className="p-6 text-center text-sm opacity-60">Start typing to search your saved data. Your calendar stays exactly where it is.</p>
                    : results.length === 0 ? <p className="p-6 text-center text-sm opacity-60">No matching items found.</p>
                    : <>
                      <p className="px-2 pb-2 text-xs opacity-60">{results.length === 80 ? "Showing first 80 matches" : `${results.length} matches`}</p>
                      <div className="space-y-2">{results.map((item) =>
                        <div key={item.key} className={`rounded-xl border ${dark ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-slate-50"}`}>
                          <button type="button" onClick={() => activate(item)} className="w-full text-left p-3">
                            <span className="flex justify-between gap-3 items-center">
                              <span className="font-medium text-sm break-words">{item.title}</span>
                              <span className="shrink-0 uppercase text-[10px] tracking-wider opacity-60">{item.kind}</span>
                            </span>
                            {item.date && <span className="block mt-1 text-xs opacity-60">{item.date.toLocaleString()}</span>}
                            {item.details && <span className="block mt-1 text-xs opacity-60 line-clamp-2">{item.details}</span>}
                          </button>
                          {expanded === item.key && <div className="border-t border-current/10 p-3 text-sm whitespace-pre-wrap break-words opacity-80">
                            {item.details || "No additional details."}
                          </div>}
                        </div>)}</div>
                    </>}
                </div>
                <p className="px-4 py-2 text-xs opacity-60 border-t border-current/10">Events and reminders open their details. Lists, tasks and notes expand here without changing views.</p>
              </motion.section>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
      {activeReminder && <ReminderView reminder={activeReminder} setShowFullReminder={(value) => { if (!value) setActiveReminder(null); }} />}
    </>
  );
};

export default Search;
