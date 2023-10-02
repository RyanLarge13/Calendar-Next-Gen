export const calendar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.1,
      staggerChildren: 0.03,
    },
  },
};

export const calendarBlocks = {
  hidden: { y: -7.5, opacity: 0 },
  show: { y: 0, opacity: 1 },
  // hidden: { opacity: 0 },
  // show: { opacity: 1 },
};
