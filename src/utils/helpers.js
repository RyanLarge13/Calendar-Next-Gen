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

export const tailwindBgToHex = bgClass => {
  const colorMap = {
    "bg-red-300": "#000000",
    "bg-red-600": "#ffffff",
    "bg-green-300": "#000000",
    "bg-green-600": "#ffffff",
    "bg-blue-300": "#000000",
    "bg-blue-600": "#ffffff",
    "bg-yellow-300": "#000000",
    "bg-yellow-600": "#ffffff",
    "bg-purple-300": "#000000",
    "bg-purple-600": "#ffffff",
    "bg-pink-300": "#000000",
    "bg-pink-600": "#ffffff",
    "bg-indigo-300": "#000000",
    "bg-indigo-600": "#ffffff",
    "bg-gray-300": "#000000",
    "bg-gray-600": "#ffffff",
    "bg-orange-300": "#000000",
    "bg-orange-600": "#ffffff",
    "bg-teal-300": "#000000",
    "bg-teal-600": "#ffffff",
    "bg-cyan-300": "#000000",
    "bg-cyan-600": "#ffffff"
  };

  const colorToReturn = colorMap[bgClass];

  if (colorToReturn) {
    return colorToReturn;
  } else {
    return "#000000";
  }
};

export const eventIsAllDay = event => {
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
