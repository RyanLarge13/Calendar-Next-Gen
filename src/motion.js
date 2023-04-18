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
  hidden: { y: -20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};
