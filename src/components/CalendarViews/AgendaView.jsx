import { useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { setStateAndPushWindowState } from "../../utils/helpers.js";

const dayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const eventStart = (event) => new Date(event.start?.startTime || event.startDate || event.date);
const eventEnd = (event) => new Date(event.end?.endTime || event.endDate || event.start?.startTime || event.startDate || event.date);

const AgendaView = () => {
  const { setEvent } = useContext(InteractiveContext);
  const { events, preferences } = useContext(UserContext);
  const { string, setString } = useContext(DatesContext);
  const [range, setRange] = useState(14);
  const anchor = useMemo(() => {
    const parsed = new Date(string);
    return Number.isFinite(parsed.getTime()) ? dayStart(parsed) : dayStart(new Date());
  }, [string]);
  const today = dayStart(new Date());
  const days = useMemo(() => Array.from({ length: range }, (_, index) => {
    const date = new Date(anchor);
    date.setDate(date.getDate() + index);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const items = events.filter((event) => {
      const start = eventStart(event);
      const end = eventEnd(event);
      return Number.isFinite(start.getTime()) && start < next && (Number.isFinite(end.getTime()) ? end >= date : start >= date);
    }).sort((a, b) => eventStart(a) - eventStart(b));
    return { date, items };
  }), [events, anchor, range]);
  const total = days.reduce((count, day) => count + day.items.length, 0);
  const panel = preferences.darkMode ? "bg-white/5 border-white/10 text-white" : "calendar-surface";
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 pb-32">
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${panel}`}>
        <p className="calendar-accent text-xs font-bold tracking-[0.25em] uppercase">Forward view</p>
        <div className="flex flex-wrap justify-between items-end gap-4 mt-3">
          <div><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your upcoming days</h1><p className="mt-2 text-sm opacity-65">A clear timeline of what is ahead.</p></div>
          <div className="flex gap-2">
            <button className="rounded-xl border px-4 py-2 text-sm" onClick={() => setString(today.toLocaleDateString())}>Today</button>
            <select aria-label="Agenda range" value={range} onChange={(e) => setRange(Number(e.target.value))} className="rounded-xl border px-3 py-2 text-sm bg-transparent"><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-2xl border p-4"><p className="text-2xl font-semibold">{total}</p><p className="text-xs opacity-60">Scheduled entries</p></div>
          <div className="rounded-2xl border p-4"><p className="text-2xl font-semibold">{days.filter((d) => d.items.length).length}</p><p className="text-xs opacity-60">Busy days</p></div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {days.map(({ date, items }) => {
          const isToday = date.getTime() === today.getTime();
          return <motion.section layout key={date.toDateString()} className={`rounded-3xl border p-4 sm:p-5 ${panel}`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div><p className="text-xs uppercase tracking-wider opacity-55">{date.toLocaleDateString(undefined, { weekday: "long" })}</p><h2 className="text-xl font-semibold">{date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} {isToday && <span className="calendar-accent text-xs ml-2">TODAY</span>}</h2></div>
              <span className="rounded-full border px-3 py-1 text-xs">{items.length} {items.length === 1 ? "event" : "events"}</span>
            </div>
            {items.length ? <div className="space-y-2">{items.map((event) => {
              const start = eventStart(event);
              return <button key={event.id} type="button" onClick={() => setStateAndPushWindowState(() => setEvent(event))} className="flex items-start text-left w-full gap-4 rounded-2xl border border-[var(--calendar-border)] p-3 hover:bg-amber-50/10 transition">
                <span className="calendar-accent text-xs font-semibold min-w-[78px]">{Number.isFinite(start.getTime()) ? start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "All day"}</span>
                <span className="min-w-0"><span className="block font-semibold break-words">{event.summary || event.title || "Untitled event"}</span>{event.description && <span className="block text-xs opacity-60 mt-1 line-clamp-2">{event.description}</span>}</span>
              </button>;
            })}</div> : <p className="text-sm opacity-50 py-2">Nothing scheduled — room to breathe.</p>}
          </motion.section>;
        })}
      </div>
    </div>
  );
};

export default AgendaView;
