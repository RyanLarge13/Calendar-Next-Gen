const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto"
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" }
];

export const formatTime = date => {
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

export const formatDbText = text => {
  if (typeof text !== "string") {
    return "";
  }
  const delimiter = "|||";
  if (text.includes(delimiter)) {
    const textParts = text.split(delimiter).map(part => part.trim());
    const filteredTextParts = textParts.filter(part => part !== "");
    return filteredTextParts;
  } else {
    return [text.trim()];
  }
};

export const formatText = text => {
  return text.replace("|||", "\n");
};

export const getTimeZone = async (lng, lat) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
      Date.now() / 1000
    )}&key=${apiKey}`
  );
  const data = await response.json();
  return data.timeZoneId;
};

export const validateFormData = (data, rules) => {};

export const getTextColorBasedOnBackground = bgColor => {
  if (typeof bgColor !== "string") return "#000000";

  const hex = bgColor.replace("#", "").trim();

  if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) return "#000000";

  const fullHex =
    hex.length === 3
      ? hex
          .split("")
          .map(c => c + c)
          .join("")
      : hex;

  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? "#000000" : "#FFFFFF";
};

export const tailwindBgToHex = bgClass => {
  const colorMap = {
    "bg-red-300": "#fca5a5",
    "bg-red-600": "#dc2626",
    "bg-green-300": "#86efac",
    "bg-green-600": "#16a34a",
    "bg-blue-300": "#93c5fd",
    "bg-blue-600": "#2563eb",
    "bg-yellow-300": "#fde68a",
    "bg-yellow-600": "#ca8a04",
    "bg-purple-300": "#d8b4fe",
    "bg-purple-600": "#7e22ce",
    "bg-pink-300": "#f9a8d4",
    "bg-pink-600": "#db2777",
    "bg-indigo-300": "#a5b4fc",
    "bg-indigo-600": "#4f46e5",
    "bg-gray-300": "#d1d5db",
    "bg-gray-600": "#4b5563",
    "bg-orange-300": "#fdba74",
    "bg-orange-600": "#ea580c",
    "bg-teal-300": "#5eead4",
    "bg-teal-600": "#0d9488",
    "bg-cyan-300": "#67e8f9",
    "bg-cyan-600": "#0891b2"
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
    event.end.endTime === null ||
    event.start.startTime === null
  ) {
    return true;
  } else {
    return false;
  }
};
