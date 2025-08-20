import {
  Sunny,
  PartlyCloudy,
  Foggy,
  Rainy,
  Slate,
  Snowy,
  Stormy,
} from "../assets/weather-icons/index.js";

const weatherCodeMap = {
  0: {
    name: "Clear sky",
    icon: Sunny,
  },
  1: {
    name: "Mainly clear",
    icon: Sunny,
  },
  2: {
    name: "Partly cloudy",
    icon: PartlyCloudy,
  },
  3: {
    name: "Overcast",
    icon: PartlyCloudy,
  },
  45: {
    name: "Fog",
    icon: Foggy,
  },
  48: {
    name: "Depositing rime fog",
    icon: Foggy,
  },
  51: {
    name: "Light drizzle",
    icon: Rainy,
  },
  53: {
    name: "Moderate drizzle",
    icon: Rainy,
  },
  55: {
    name: "Dense drizzle",
    icon: Rainy,
  },
  56: {
    name: "Light freezing drizzle",
    icon: Slate,
  },
  57: {
    name: "Dense freezing drizzle",
    icon: Slate,
  },
  61: {
    name: "Slight rain",
    icon: Rainy,
  },
  63: {
    name: "Moderate rain",
    icon: Rainy,
  },
  65: {
    name: "Heavy rain",
    icon: Rainy,
  },
  66: {
    name: "Light freezing rain",
    icon: Slate,
  },
  67: {
    name: "Heavy freezing rain",
    icon: Slate,
  },
  71: {
    name: "Slight snow fall",
    icon: Snowy,
  },
  73: {
    name: "Moderate snow fall",
    icon: Snowy,
  },
  75: {
    name: "Heavy snow fall",
    icon: Snowy,
  },
  77: {
    name: "Snow grains",
    icon: Snowy,
  },
  80: {
    name: "Slight rain showers",
    icon: Rainy,
  },
  81: {
    name: "Moderate rain showers",
    icon: Rainy,
  },
  82: {
    name: "Violent rain showers",
    icon: Rainy,
  },
  85: {
    name: "Slight snow showers",
    icon: Snowy,
  },
  86: {
    name: "Heavy snow showers",
    icon: Snowy,
  },
  95: {
    name: "Thunderstorm",
    icon: Stormy,
  },
  96: {
    name: "Thunderstorm with slight hail",
    icon: Stormy,
  },
  99: {
    name: "Thunderstorm with heavy hail",
    icon: Stormy,
  },
};

export default weatherCodeMap;
