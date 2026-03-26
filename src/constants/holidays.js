/** Repeat Type
 * repeats: {
          repeat,
          howOften: repeat ? howOften : null,
          nextDate: null,
          interval: interval ? interval : 1,
          repeatId: uuidv4(),
        },
 */

export const holidays = [
  {
    color: "bg-purple-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "New Years Day!!",
    id: 1,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "2/2/1900",
    startDate: "2/2/1900",
    endDate: "2/2/1900",
    summary: "Groundhog Day",
    id: 4,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-red-300",
    date: "2/14/1900",
    startDate: "2/14/1900",
    endDate: "2/14/1900",
    summary: "Valentines Day!!",
    id: 5,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "3/14/1900",
    startDate: "3/14/1900",
    endDate: "3/14/1900",
    summary: "Pi Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "3/17/1900",
    startDate: "3/17/1900",
    endDate: "3/17/1900",
    summary: "St. Patricks Day!!",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "4/1/1900",
    startDate: "4/1/1900",
    endDate: "4/1/1900",
    summary: "April Fools' Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "4/22/1900",
    startDate: "4/22/1900",
    endDate: "4/22/1900",
    summary: "Earth Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "5/4/1900",
    startDate: "5/4/1900",
    endDate: "5/4/1900",
    summary: "Star Wars Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "5/5/1900",
    startDate: "5/5/1900",
    endDate: "5/5/1900",
    summary: "Cinco de Mayo",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "6/19/1900",
    startDate: "6/19/1900",
    endDate: "6/19/1900",
    summary: "Juneteenth",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    kind: "Event",
    color: "bg-blue-300",
    date: "7/4/1900",
    startDate: "7/4/1900",
    endDate: "7/4/1900",
    summary: "Independance Day!!",
    description: "Happy 4th of July!",
    id: 14,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    location: "",
    time: false,
  },
  {
    color: "bg-green-300",
    date: "9/11/1900",
    startDate: "9/11/1900",
    endDate: "9/11/1900",
    summary: "Patriots Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-yellow-600",
    date: "9/29/1900",
    startDate: "9/29/1900",
    endDate: "9/29/1900",
    summary: "National Coffee Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-orange-300",
    date: "10/4/1900",
    startDate: "10/4/1900",
    endDate: "10/4/1900",
    summary: "National Taco Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-orange-300",
    date: "10/31/1900",
    startDate: "10/31/1900",
    endDate: "10/31/1900",
    summary: "Halloween",
    id: 16,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    location: "",
    time: false,
  },
  {
    color: "bg-green-300",
    date: "11/11/1900",
    startDate: "11/11/1900",
    endDate: "11/11/1900",
    summary: "Vetrans Day",
    id: 8,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-green-300",
    date: "12/25/1900",
    startDate: "12/25/1900",
    endDate: "12/25/1900",
    summary: "Christmas!!",
    id: 18,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: false,
      howOften: "Yearly",
      interval: "infinity",
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    location: "",
    time: false,
  },

  // Floating Holidays
  {
    color: "bg-slate-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Martin Luther King Jr. Day",
    id: 1001,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 0, // January
        weekday: 1, // Monday
        nth: 3,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-blue-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Presidents' Day",
    id: 1002,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 1, // February
        weekday: 1, // Monday
        nth: 3,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-yellow-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Daylight Saving Time Begins",
    id: 1003,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 2, // March
        weekday: 0, // Sunday
        nth: 2,
      },
    },
    start: {
      startTime: "2:00 AM",
    },
    end: {
      endTime: null,
    },
    time: true,
  },
  {
    color: "bg-green-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Mother's Day",
    id: 1004,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 4, // May
        weekday: 0, // Sunday
        nth: 2,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-cyan-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Armed Forces Day",
    id: 1005,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 4, // May
        weekday: 6, // Saturday
        nth: 3,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-red-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Memorial Day",
    id: 1006,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "last_weekday",
      rules: {
        month: 4, // May
        weekday: 1, // Monday
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-indigo-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Father's Day",
    id: 1007,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 5, // June
        weekday: 0, // Sunday
        nth: 3,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-orange-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Labor Day",
    id: 1008,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 8, // September
        weekday: 1, // Monday
        nth: 1,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-teal-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Grandparents Day",
    id: 1009,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 8, // September
        weekday: 0, // Sunday
        nth: 1,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-lime-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Columbus Day / Indigenous Peoples' Day",
    id: 1010,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 9, // October
        weekday: 1, // Monday
        nth: 2,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-amber-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Daylight Saving Time Ends",
    id: 1011,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 10, // November
        weekday: 0, // Sunday
        nth: 1,
      },
    },
    start: {
      startTime: "2:00 AM",
    },
    end: {
      endTime: null,
    },
    time: true,
  },
  {
    color: "bg-rose-300",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Election Day",
    id: 1012,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "special_first_tuesday_after_first_monday",
      rules: {
        month: 10, // November
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
  {
    color: "bg-yellow-400",
    date: "1/1/1900",
    startDate: "1/1/1900",
    endDate: "1/1/1900",
    summary: "Thanksgiving",
    id: 1013,
    reminders: {
      reminder: false,
    },
    repeats: {
      repeat: true,
      howOften: "Yearly",
      interval: "infinity",
      kind: "nth_weekday",
      rules: {
        month: 10, // November
        weekday: 4, // Thursday
        nth: 4,
      },
    },
    start: {
      startTime: null,
    },
    end: {
      endTime: null,
    },
    time: false,
  },
];
