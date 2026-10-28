// Month buckets are canonical. "repeat-reminders" is a secondary index.
export const indexRemindersById = (remindersMap) => {
  const byId = new Map();
  if (!(remindersMap instanceof Map)) return byId;
  for (const [key, bucket] of remindersMap) {
    if (key === "repeat-reminders") continue;
    for (const reminder of bucket?.reminders || []) {
      if (reminder?.id != null) byId.set(String(reminder.id), reminder);
    }
  }
  return byId;
};

export const getRemindersForDay = (remindersMap, date) => {
  const day = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(day.getTime())) return [];
  const key = `${day.getFullYear()}-${day.getMonth()}`;
  return (remindersMap?.get(key)?.reminders || []).filter((reminder) => {
    const time = new Date(reminder.time);
    return time.getFullYear() === day.getFullYear() &&
      time.getMonth() === day.getMonth() && time.getDate() === day.getDate();
  });
};

export const upsertReminderInMap = (previous, reminder) => {
  if (reminder?.id == null) return previous;
  const time = new Date(reminder.time);
  if (!Number.isFinite(time.getTime())) return previous;
  const next = removeRemindersFromMap(previous, [reminder.id]);
  const key = `${time.getFullYear()}-${time.getMonth()}`;
  const bucket = next.get(key) || { reminders: [] };
  next.set(key, { ...bucket, reminders: [...bucket.reminders, reminder] });
  if (reminder.repeats?.on) {
    const repeat = next.get("repeat-reminders") || { reminders: [] };
    next.set("repeat-reminders", { ...repeat, reminders: [...repeat.reminders, reminder] });
  }
  return next;
};

export const removeRemindersFromMap = (previous, ids) => {
  const remove = new Set([...ids].map(String));
  const next = new Map();
  for (const [key, bucket] of previous) {
    const filtered = (bucket?.reminders || []).filter((r) => !remove.has(String(r.id)));
    if (filtered.length) next.set(key, { ...bucket, reminders: filtered });
  }
  return next;
};

export const updateReminderInMap = (previous, id, update) => {
  const reminder = indexRemindersById(previous).get(String(id));
  if (!reminder) return previous;
  const patch = typeof update === "function" ? update(reminder) : update;
  return upsertReminderInMap(previous, { ...reminder, ...patch });
};
