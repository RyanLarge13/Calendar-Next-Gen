const weatherCodes = [
  {
    name: "Clear Sky",
    codes: [0],
    icon: 0,
  },
  {
    name: "Partly Cloudy",
    codes: [1, 2, 3],
    icon: 1,
  },
  {
    name: "Rain",
    codes: [61, 63, 65, 66, 67, 80, 81, 82],
    icon: 2,
  },
  {
    name: "Snowy",
    codes: [71, 73, 75, 77, 85, 86],
    icon: 3,
  },
  {
    name: "Thunder Storms",
    codes: [95, 96, 99, "*"],
    icon: 4,
  },
  {
    name: "Foggy",
    codes: [45, 48],
    icon: 5,
  },
  {
    name: "Light Rain",
    codes: [51, 53, 55, 56, 57],
    icon: 6,
  },
];

export default weatherCodes;
