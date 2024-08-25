export const reminderSortBtns = [
  {
    title: "Title",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "Important",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "Event",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "Today",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "Tomorrow",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "This Month",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
  {
    title: "This Week",
    callback: (data, on) => {
      const copy = [...data];
      return on
        ? copy.sort((a, b) => a.title.localeCompare(b.title))
        : copy.sort((a, b) => b.title.localeCompare(e.title));
    },
  },
];
