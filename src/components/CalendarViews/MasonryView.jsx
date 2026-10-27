import { motion } from "framer-motion";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import ReminderView from "../Reminders/ReminderView/ReminderView";
import { setStateAndPushWindowState } from "../../utils/helpers";

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
const parseMonth = (key) => {
  const parts = key.split("-").map(Number);
  if (
    parts.length !== 2 ||
    !Number.isInteger(parts[0]) ||
    !Number.isInteger(parts[1]) ||
    parts[1] < 0 ||
    parts[1] > 11
  )
    return null;
  return new Date(parts[0], parts[1], 1);
};

const MasonryView = ({ containerRef }) => {
  const { eventMap, reminders = [], preferences } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);
  const [range, setRange] = useState(12);
  const [activeReminder, setActiveReminder] = useState(null);
  const dateMapRef = useRef(null);
  const anchor = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);

  const groups = useMemo(() => {
    const center = anchor.getFullYear() * 12 + anchor.getMonth();
    const byMonth = new Map();
    for (const [key, value] of eventMap || []) {
      const month = parseMonth(key);
      if (
        !month ||
        Math.abs(month.getFullYear() * 12 + month.getMonth() - center) > range
      )
        continue;
      const events = Array.isArray(value?.events) ? value.events : [];
      if (events.length)
        byMonth.set(key, { date: month, events, reminders: [] });
    }
    for (const reminder of reminders) {
      const date = new Date(reminder.time);
      if (
        !Number.isFinite(date.getTime()) ||
        Math.abs(date.getFullYear() * 12 + date.getMonth() - center) > range
      )
        continue;
      const key = monthKey(date);
      if (!byMonth.has(key))
        byMonth.set(key, {
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          events: [],
          reminders: [],
        });
      byMonth.get(key).reminders.push(reminder);
    }
    return Array.from(byMonth.entries())
      .sort((a, b) => a[1].date - b[1].date)
      .map(([key, value]) => ({
        key,
        ...value,
        reminders: value.reminders.sort(
          (a, b) => new Date(a.time) - new Date(b.time),
        ),
      }));
  }, [eventMap, reminders, anchor.getFullYear(), anchor.getMonth(), range]);

  useEffect(() => {
    if (!containerRef?.current || !groups.length) return;
    const center = anchor.getFullYear() * 12 + anchor.getMonth();
    const nearest = groups.reduce(
      (best, item) => {
        const distance = Math.abs(
          item.date.getFullYear() * 12 + item.date.getMonth() - center,
        );
        return distance < best.distance ? { key: item.key, distance } : best;
      },
      { key: null, distance: Infinity },
    );
    const element = document.getElementById(`masonry-month-${nearest.key}`);
    if (element)
      containerRef.current.scrollTo({
        top: Math.max(0, element.offsetTop - 140),
        behavior: "smooth",
      });
  }, [groups, containerRef]);

  const jumpTo = (key) => {
    const element = document.getElementById(`masonry-month-${key}`);
    if (element && containerRef?.current)
      containerRef.current.scrollTo({
        top: Math.max(0, element.offsetTop - 140),
        behavior: "smooth",
      });
  };
  const columns = { default: 4, 1100: 3, 700: 2, 480: 1 };
  const surface = preferences.darkMode
    ? "bg-[#202020] border-white/10 text-white"
    : "bg-white border-black/10 text-slate-900";

  return (
    <div className="pb-16 w-full">
      <div
        className={`sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border shadow-sm ${surface}`}
      >
        <div>
          <h2 className="font-semibold text-sm">Timeline</h2>
          <p className="opacity-60 text-xs">
            Events and reminders near{" "}
            {anchor.toLocaleDateString([], { month: "long", year: "numeric" })}
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs">
          Show
          <select
            aria-label="Masonry timeline range"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className={`rounded-lg border p-2 ${surface}`}
          >
            <option value="6">± 6 months</option>
            <option value="12">± 12 months</option>
            <option value="24">± 24 months</option>
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <nav
          ref={dateMapRef}
          aria-label="Timeline months"
          className="top-16 sticky self-start w-[76px] max-h-[75dvh] overflow-y-auto shrink-0 scrollbar-hide"
        >
          {groups.map(({ key, date, events, reminders: due }) => (
            <button
              key={key}
              type="button"
              onClick={() => jumpTo(key)}
              className="block hover:bg-cyan-500/10 my-2 p-2 rounded-lg w-full text-xs text-left"
            >
              <span className="block font-semibold">
                {date.toLocaleDateString([], { month: "short" })}
              </span>
              <span className="opacity-60">{date.getFullYear()}</span>
              <span className="block opacity-50">
                {events.length + due.length} items
              </span>
            </button>
          ))}
        </nav>
        <div className="flex-1 min-w-0">
          {!groups.length && (
            <div
              className={`rounded-xl border p-8 mt-6 text-center ${surface}`}
            >
              No events or reminders in this range.
            </div>
          )}
          {groups.map(({ key, date, events, reminders: due }) => (
            <section
              key={key}
              id={`masonry-month-${key}`}
              className="mt-8 scroll-mt-80"
            >
              <h3 className="bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-3 font-semibold text-transparent text-lg">
                {date.toLocaleDateString([], {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Masonry
                breakpointCols={columns}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {events.map((event) => (
                  <motion.button
                    key={`event-${event.id}`}
                    type="button"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    onClick={() =>
                      setStateAndPushWindowState(() => setEvent(event))
                    }
                    className={`block w-full text-left my-2 relative p-4 pl-5 rounded-xl border shadow-sm ${surface}`}
                  >
                    <span
                      className={`absolute left-0 inset-y-0 w-1 rounded-l-xl ${event.color || "bg-cyan-500"}`}
                    />
                    <span className="opacity-50 text-[10px] uppercase">
                      Event
                    </span>
                    <span className="block mt-1 font-semibold text-sm break-words">
                      {event.summary || event.title || "Untitled event"}
                    </span>
                    <span className="block opacity-60 mt-1 text-xs">
                      {event.start?.startTime &&
                      Number.isFinite(new Date(event.start.startTime).getTime())
                        ? new Date(event.start.startTime).toLocaleString()
                        : event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "All day"}
                    </span>
                    {event.description && (
                      <span className="block opacity-70 mt-2 text-xs break-words whitespace-pre-wrap">
                        {event.description}
                      </span>
                    )}
                  </motion.button>
                ))}
                {due.map((reminder) => (
                  <motion.button
                    key={`reminder-${reminder.id}`}
                    type="button"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    onClick={() => setActiveReminder(reminder)}
                    className={`block w-full text-left my-2 relative p-4 pl-5 rounded-xl border shadow-sm ${surface}`}
                  >
                    <span className="left-0 absolute inset-y-0 bg-amber-400 rounded-l-xl w-1" />
                    <span className="text-[10px] text-amber-500 uppercase">
                      Reminder {reminder.completed ? "· Completed" : ""}
                    </span>
                    <span className="block mt-1 font-semibold text-sm break-words">
                      {reminder.title || "Untitled reminder"}
                    </span>
                    <span className="block opacity-60 mt-1 text-xs">
                      {new Date(reminder.time).toLocaleString()}
                    </span>
                    {reminder.notes && (
                      <span className="block opacity-70 mt-2 text-xs break-words whitespace-pre-wrap">
                        {reminder.notes}
                      </span>
                    )}
                  </motion.button>
                ))}
              </Masonry>
            </section>
          ))}
        </div>
      </div>
      {activeReminder && (
        <ReminderView
          reminder={activeReminder}
          setShowFullReminder={(open) => {
            if (!open) setActiveReminder(null);
          }}
        />
      )}
    </div>
  );
};
export default MasonryView;
