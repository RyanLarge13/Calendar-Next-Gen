import { getRemindersForDay } from "../../utils/reminderMapHelpers.js";
import { getEventOccurrencesForDay } from "../../utils/eventMapHelpers.js";
import { useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReminderView from "../Reminders/ReminderView/ReminderView.jsx";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { setStateAndPushWindowState } from "../../utils/helpers.js";

const dayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const eventStart = (event) => new Date(event.start?.startTime || event.startDate || event.date);
const eventEnd = (event) => new Date(event.end?.endTime || event.endDate || event.start?.startTime || event.startDate || event.date);

const AgendaView = () => {
  const { setEvent } = useContext(InteractiveContext);
  const { eventMap, remindersMap, preferences } = useContext(UserContext);
  const [activeReminder, setActiveReminder] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
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
    const items = getEventOccurrencesForDay(eventMap, date).sort((a, b) => eventStart(a) - eventStart(b));
    const dayReminders = getRemindersForDay(remindersMap, date).filter((reminder) => {
      const due = new Date(reminder.time);
      return Number.isFinite(due.getTime()) && due >= date && due < next && (showCompleted || !reminder.completed);
    }).sort((a, b) => new Date(a.time) - new Date(b.time));
    return { date, items, dayReminders };
  }), [eventMap, remindersMap, anchor, range, showCompleted]);
  const total = days.reduce((count, day) => count + day.items.length, 0);
  const reminderTotal = days.reduce((count, day) => count + day.dayReminders.length, 0);
  const panel = preferences.darkMode ? "bg-white/5 border-white/10 text-white" : "calendar-surface";
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 pb-32">
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${panel}`}>
        <p className="calendar-accent text-xs font-bold tracking-[0.25em] uppercase">Forward view</p>
        <div className="flex flex-wrap justify-between items-end gap-4 mt-3">
          <div><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your upcoming days</h1><p className="mt-2 text-sm opacity-65">A clear timeline of what is ahead.</p></div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border px-4 py-2 text-sm" onClick={() => setString(today.toLocaleDateString())}>Today</button>
            <select aria-label="Agenda range" value={range} onChange={(e) => setRange(Number(e.target.value))} className="rounded-xl border px-3 py-2 text-sm bg-transparent"><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} /> Include completed reminders</label>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl border p-4"><p className="text-2xl font-semibold">{total}</p><p className="text-xs opacity-60">Scheduled entries</p></div>
          <div className="rounded-2xl border p-4"><p className="text-2xl font-semibold">{reminderTotal}</p><p className="text-xs opacity-60">Reminders due</p></div>
          <div className="rounded-2xl border p-4"><p className="text-2xl font-semibold">{days.filter((d) => d.items.length || d.dayReminders.length).length}</p><p className="text-xs opacity-60">Busy days</p></div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {days.map(({ date, items, dayReminders }) => {
          const isToday = date.getTime() === today.getTime();
          return <motion.section layout key={date.toDateString()} className={`rounded-3xl border p-4 sm:p-5 ${panel}`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div><p className="text-xs uppercase tracking-wider opacity-55">{date.toLocaleDateString(undefined, { weekday: "long" })}</p><h2 className="text-xl font-semibold">{date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} {isToday && <span className="calendar-accent text-xs ml-2">TODAY</span>}</h2></div>
              <span className="rounded-full border px-3 py-1 text-xs">{items.length + dayReminders.length} items</span>
            </div>
            {items.length ? <div className="space-y-2">{items.map((event) => {
              const start = eventStart(event);
              return <button key={event.id} type="button" onClick={() => setStateAndPushWindowState(() => setEvent(event))} className="flex items-start text-left w-full gap-4 rounded-2xl border border-[var(--calendar-border)] p-3 hover:bg-amber-50/10 transition">
                <span className="calendar-accent text-xs font-semibold min-w-[78px]">{Number.isFinite(start.getTime()) ? start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "All day"}</span>
                <span className="min-w-0"><span className="block font-semibold break-words">{event.summary || event.title || "Untitled event"}</span>{event.description && <span className="block text-xs opacity-60 mt-1 line-clamp-2">{event.description}</span>}</span>
              </button>;
            })}</div> : null}
            {dayReminders.length > 0 && <div className="space-y-2 mt-3"><p className="text-xs font-semibold uppercase opacity-60">Reminders</p>{dayReminders.map((reminder) => <button key={reminder.id} type="button" onClick={() => setActiveReminder(reminder)} className="flex items-start gap-3 w-full rounded-2xl border p-3 text-left hover:bg-amber-50/10 transition"><span className="text-xs font-semibold min-w-[78px]">{new Date(reminder.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span><span className="min-w-0"><span className="block font-semibold">{reminder.title || "Untitled reminder"}</span>{reminder.notes && <span className="block text-xs opacity-60 line-clamp-2">{reminder.notes}</span>}</span></button>)}</div>}
            {!items.length && !dayReminders.length && <p className="text-sm opacity-50 py-2">Nothing scheduled — room to breathe.</p>}
          </motion.section>;
        })}
      </div>
      {activeReminder && <ReminderView reminder={activeReminder} setShowFullReminder={(open) => { if (!open) setActiveReminder(null); }} />}
    </div>
  );
};

export default AgendaView;
