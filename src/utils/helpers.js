const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export const formatTime = (date) => {
  if (date === null || date === undefined) {
    return "Try Refreshing Again";
  }
  let duration = (date - new Date()) / 1000;
  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
};

export const formatDbText = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  const delimiter = "|||";
  if (text.includes(delimiter)) {
    const textParts = text.split(delimiter).map((part) => part.trim());
    const filteredTextParts = textParts.filter((part) => part !== "");
    return filteredTextParts;
  } else {
    return [text.trim()];
  }
};

export const formatText = (text) => {
  return text.replace("|||", "\n");
};

export const getTimeZone = async (lng, lat) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
      Date.now() / 1000,
    )}&key=${apiKey}`,
  );
  const data = await response.json();
  return data.timeZoneId;
};

export const validateFormData = (data, rules) => {};

export const tailwindBgToHex = (bgClass) => {
  const colorMap = {
    "bg-black": "#FFFFFF",
    "bg-white": "#000000",
    "bg-rose-300": "#000000",
    "bg-red-300": "#000000",
    "bg-amber-300": "#000000",
    "bg-yellow-300": "#000000",
    "bg-orange-300": "#000000",
    "bg-lime-300": "#000000",
    "bg-green-300": "#000000",
    "bg-emerald-300": "#000000",
    "bg-teal-300": "#000000",
    "bg-cyan-300": "#000000",
    "bg-sky-300": "#000000",
    "bg-blue-300": "#000000",
    "bg-indigo-300": "#000000",
    "bg-violet-300": "#000000",
    "bg-fuchsia-300": "#000000",
    "bg-pink-300": "#000000",
    "bg-slate-300": "#000000",
    "bg-zinc-300": "#000000",
    "bg-stone-300": "#000000",
    "bg-rose-600": "#FFFFFF",
    "bg-red-600": "#FFFFFF",
    "bg-amber-600": "#FFFFFF",
    "bg-yellow-600": "#FFFFFF",
    "bg-orange-600": "#FFFFFF",
    "bg-lime-600": "#FFFFFF",
    "bg-green-600": "#FFFFFF",
    "bg-emerald-600": "#FFFFFF",
    "bg-teal-600": "#FFFFFF",
    "bg-cyan-600": "#FFFFFF",
    "bg-sky-600": "#FFFFFF",
    "bg-blue-600": "#FFFFFF",
    "bg-indigo-600": "#FFFFFF",
    "bg-violet-600": "#FFFFFF",
    "bg-fuchsia-600": "#FFFFFF",
    "bg-pink-600": "#FFFFFF",
    "bg-slate-600": "#FFFFFF",
    "bg-zinc-600": "#FFFFFF",
    "bg-stone-600": "#FFFFFF",
  };

  const colorToReturn = colorMap[bgClass];

  if (colorToReturn) {
    return colorToReturn;
  } else {
    return "#000000";
  }
};

export const eventIsAllDay = (event) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const daysDifference = (endDate - startDate) / (24 * 60 * 60 * 1000);
  if (
    daysDifference >= 1 ||
    event.end?.endTime === null ||
    event.start?.startTime === null
  ) {
    return true;
  } else {
    return false;
  }
};

// Helper function to normalize date (ignore time)
const normalizeDate = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const hasRepeatYear = (repeaters, date) => {
  const target = normalizeDate(date);
  return repeaters.some((r) => {
    const rd = normalizeDate(new Date(r));
    return (
      rd.getMonth() === target.getMonth() && rd.getDate() === target.getDate()
    );
  });
};

export const hasRepeatMonth = (repeaters, date) => {
  const target = normalizeDate(date);
  return repeaters.some((r) => {
    const rd = normalizeDate(new Date(r));
    return rd.getDate() === target.getDate();
  });
};

export const hasRepeatBiWeekly = (repeaters, date) => {
  const target = normalizeDate(date);
  return repeaters.some((r) => {
    const rd = normalizeDate(new Date(r));
    const diffDays = Math.abs((target - rd) / (1000 * 60 * 60 * 24));
    // Bi-weekly = every 14 days
    return diffDays % 14 === 0;
  });
};

export const hasRepeatWeekly = (repeaters, date) => {
  const target = normalizeDate(date);
  return repeaters.some((r) => {
    const rd = normalizeDate(new Date(r));
    const diffDays = Math.abs((target - rd) / (1000 * 60 * 60 * 24));
    // Weekly = every 7 days
    return diffDays % 7 === 0;
  });
};

export const hasRepeatDaily = (repeaters, date) => {
  const target = normalizeDate(date);
  return repeaters.some(
    (r) => normalizeDate(new Date(r)).getTime() === target.getTime(),
  );
};

export const makeDateTime = (string, hour, minute, meridiem) => {
  // Parse date parts
  const [month, day, year] = string.split("/").map(Number);

  // Convert 2-digit year → 4-digit year
  const fullYear = year < 100 ? 2000 + year : year;

  // Convert 12-hour → 24-hour
  let hours24 = hour % 12;
  if (meridiem === "PM") hours24 += 12;

  return new Date(
    fullYear,
    month - 1, // JS months are 0-based
    day,
    hours24,
    minute,
    0,
    0,
  );
};
