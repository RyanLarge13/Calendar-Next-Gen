import { eventOccursOnDay, cloneEventForDay } from "./helpers.js";
// Canonical event indexing helpers. The month buckets remain the source of truth.
// The repeat-events bucket is a secondary index and must not create duplicate IDs.
export const indexEventsById = (eventMap) => {
  const byId = new Map();
  if (!(eventMap instanceof Map)) return byId;
  for (const [key, bucket] of eventMap) {
    if (key === "repeat-events") continue;
    for (const event of bucket?.events || []) {
      if (event?.id != null) byId.set(String(event.id), event);
    }
  }
  return byId;
};

export const getEventsForDate = (eventMap, date) => {
  const day = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(day.getTime())) return [];
  const key = `${day.getFullYear()}-${day.getMonth()}`;
  return eventMap?.get(key)?.events || [];
};

export const upsertEventInMap = (previous, event) => {
  if (!event || event.id == null) return previous;
  const next = new Map(previous);
  const id = String(event.id);
  for (const [key, bucket] of next) {
    const original = bucket?.events || [];
    const filtered = original.filter((item) => String(item.id) !== id);
    if (filtered.length !== original.length) {
      if (filtered.length) next.set(key, { ...bucket, events: filtered });
      else next.delete(key);
    }
  }
  const date = new Date(event.date || event.startDate);
  if (!Number.isFinite(date.getTime())) return previous;
  const key = `${date.getFullYear()}-${date.getMonth()}`;
  const bucket = next.get(key) || { events: [] };
  next.set(key, { ...bucket, events: [...bucket.events, event] });
  if (event.repeats?.repeat) {
    const repeat = next.get("repeat-events") || { events: [] };
    next.set("repeat-events", { ...repeat, events: [...repeat.events, event] });
  }
  return next;
};

// Read a calendar day from the canonical month buckets and recurrence index.
// Multi-day entries can start in an earlier month; include those without
// treating the repeat-events index as a second copy of the original.
export const getEventOccurrencesForDay = (eventMap, date) => {
  const day = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(day.getTime()) || !(eventMap instanceof Map)) return [];
  const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const nextDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  const originalById = new Map();
  for (const [key, bucket] of eventMap) {
    if (key === "repeat-events") continue;
    for (const event of bucket?.events || []) {
      if (event?.id == null) continue;
      const start = new Date(event.startDate || event.date);
      const end = new Date(event.endDate || event.startDate || event.date);
      if (!Number.isFinite(start.getTime())) continue;
      if (start < nextDay && (Number.isFinite(end.getTime()) ? end >= startOfDay : start >= startOfDay)) {
        originalById.set(String(event.id), event);
      }
    }
  }
  const result = [...originalById.values()];
  for (const event of eventMap.get("repeat-events")?.events || []) {
    if (event?.id == null || originalById.has(String(event.id))) continue;
    if (event.repeats?.kind && !["fixed"].includes(event.repeats.kind)) continue;
    if (!eventOccursOnDay(event, startOfDay)) continue;
    const occurrence = cloneEventForDay(event, startOfDay);
    // Keep the original identity for event editing and navigation.
    result.push({ ...occurrence, id: event.id, occurrenceDate: startOfDay.toISOString() });
  }
  return result;
};
