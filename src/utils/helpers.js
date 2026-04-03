import { API_GetWeather } from "./api";
import { v4 as uuidv4 } from "uuid";

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

export const H_FetchWeather = async (lng, lat) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const response = await API_GetWeather(lng, lat, timeZone);

    if (response?.data) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log("Weather data fetch error");
    console.log(err);
    return null;
  }
};

export const getDeviceLabel = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  let browser = "Unknown Browser";
  let os = "Unknown OS";

  // Browser detection
  if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

  // OS detection
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os")) os = "Mac";
  else if (ua.includes("iphone")) os = "iPhone";
  else if (ua.includes("ipad")) os = "iPad";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";

  return `${browser} on ${os}`;
};

export const completeSubscription = (sub) => {
  const platform = navigator.userAgentData?.platform || "Unknown Platform";
  const browser = getDeviceLabel(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const screen = { width: window.screen.width, height: window.screen.height };

  // Change this in the future to update with stored app version in ENV maybe?
  const appVersion = 1.0;

  const createdAt = new Date();
  const lastSeenAt = new Date();

  const fullSub = {
    ...sub.toJSON(),
    id: uuidv4(),
    platform,
    browser,
    isStandalone,
    timezone,
    language,
    screen,
    appVersion,
    createdAt,
    lastSeenAt,
    paused: false,
  };

  return fullSub;
};

export const getWeekOfMonthMondayStart = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const dayOfMonth = date.getDate();
  const firstDayOffset = (firstOfMonth.getDay() + 6) % 7;

  return Math.ceil((dayOfMonth + firstDayOffset) / 7);
};

export const returnSortDatedDate = (type, date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const week = getWeekOfMonthMondayStart(date);

  const monthName = date.toLocaleString("en-US", { month: "long" });

  switch (type) {
    case "day":
      return {
        key: `${year}-${month + 1}-${day}`,
        label: `${monthName} ${day}, ${year}`,
      };

    case "week":
      return {
        key: `${year}-${month + 1}-week-${week}`,
        label: `${monthName} ${year} - Week ${week}`,
      };

    case "month":
      return {
        key: `${year}-${month + 1}`,
        label: `${monthName} ${year}`,
      };

    default:
      return null;
  }
};

// Helper methods for checking if event is repeating on a specific day
const isSameCalendarDay = (a, b) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const startOfDay = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const daysBetween = (a, b) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const aStart = startOfDay(a);
  const bStart = startOfDay(b);
  return Math.floor((bStart - aStart) / msPerDay);
};

const monthsBetween = (a, b) => {
  return (
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  );
};

const yearsBetween = (a, b) => {
  return b.getFullYear() - a.getFullYear();
};

export const eventOccursOnDay = (event, candidateDay) => {
  const eventStart = startOfDay(new Date(event.startDate));
  const candidate = startOfDay(candidateDay);

  // no repeat
  if (!event.repeats?.repeat) return false;

  // do not render on original day
  if (isSameCalendarDay(eventStart, candidate)) return false;

  // cannot repeat before start date
  if (candidate < eventStart) return false;

  const rawCount = event.repeats.interval ?? 1;
  const howOften = event.repeats.howOften;
  const repeatCount = rawCount === "infinity" ? Infinity : rawCount - 1;

  switch (howOften) {
    case "Daily": {
      const diffDays = daysBetween(eventStart, candidate);

      // daily repeats happen on day 1..repeatCount
      return diffDays >= 1 && diffDays <= repeatCount;
    }

    case "Weekly": {
      const diffDays = daysBetween(eventStart, candidate);

      // must be same weekday
      if (candidate.getDay() !== eventStart.getDay()) return false;

      const diffWeeks = diffDays / 7;

      // weekly repeats happen on week 1..repeatCount
      return (
        Number.isInteger(diffWeeks) &&
        diffWeeks >= 1 &&
        diffWeeks <= repeatCount
      );
    }

    case "Bi Weekly": {
      const diffDays = daysBetween(eventStart, candidate);

      // must be same weekday
      if (candidate.getDay() !== eventStart.getDay()) return false;

      const diffBiWeeks = diffDays / 14;

      // biweekly repeats happen on 2-week step 1..repeatCount
      return (
        Number.isInteger(diffBiWeeks) &&
        diffBiWeeks >= 1 &&
        diffBiWeeks <= repeatCount
      );
    }

    case "Monthly": {
      const diffMonths = monthsBetween(eventStart, candidate);

      if (candidate.getDate() !== eventStart.getDate()) return false;

      // monthly repeats happen on month 1..repeatCount
      return diffMonths >= 1 && diffMonths <= repeatCount;
    }

    case "Yearly": {
      const diffYears = yearsBetween(eventStart, candidate);

      return (
        candidate.getMonth() === eventStart.getMonth() &&
        candidate.getDate() === eventStart.getDate() &&
        diffYears >= 1 &&
        diffYears <= repeatCount
      );
    }

    default:
      return false;
  }
};

const mergeDateWithTime = (baseDate, newDay) => {
  return new Date(
    newDay.getFullYear(),
    newDay.getMonth(),
    newDay.getDate(),
    baseDate.getHours(),
    baseDate.getMinutes(),
    baseDate.getSeconds(),
    baseDate.getMilliseconds(),
  );
};

export const cloneEventForDay = (event, day) => {
  const originalStart = new Date(event.startDate);
  const originalEnd = new Date(event.endDate);

  const duration = originalEnd.getTime() - originalStart.getTime();

  const newStartDate = mergeDateWithTime(originalStart, day);
  const newEndDate = new Date(newStartDate.getTime() + duration);

  // Parse safely
  const parsedStartTime = event.start?.startTime
    ? new Date(event.start.startTime)
    : null;

  const parsedEndTime = event.end?.endTime ? new Date(event.end.endTime) : null;

  // Validate BOTH must exist and be valid
  const hasValidTimes =
    parsedStartTime &&
    parsedEndTime &&
    !Number.isNaN(parsedStartTime.getTime()) &&
    !Number.isNaN(parsedEndTime.getTime());

  const newStartTime = hasValidTimes
    ? mergeDateWithTime(parsedStartTime, day)
    : null;

  const newEndTime = hasValidTimes
    ? mergeDateWithTime(parsedEndTime, day)
    : null;

  return {
    ...event,
    id: uuidv4(),
    startDate: newStartDate,
    endDate: newEndDate,
    cloneId: event.id,
    start: {
      ...event.start,
      timeZone: event.start?.timeZone ?? null,
      startTime: newStartTime ? newStartTime.toString() : null,
    },
    end: {
      ...event.end,
      timeZone: event.end?.timeZone ?? null,
      endTime: newEndTime ? newEndTime.toString() : null,
    },
  };
};

export const parseCalendarDate = (dateStr) => {
  const [m, d, y] = dateStr.split("/").map(Number);
  const fullYear = y < 100 ? 2000 + y : y;
  return new Date(fullYear, m - 1, d, 0, 0, 0, 0);
};

export const getEasterDate = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};
