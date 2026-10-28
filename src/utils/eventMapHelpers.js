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
