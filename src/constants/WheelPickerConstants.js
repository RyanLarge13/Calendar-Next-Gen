export const staticHours = Array.from(12, (_, i) => {
  const value = i + 1;
  return {
    label: value.toString().padStart(2, "0"),
    value: value,
  };
});

export const staticMinutes = Array.from(60, (_, i) => {
  const value = i;

  if (i % 5 === 0) {
    return {
      label: value.toString().padStart(2, "0"),
      value: value,
    };
  }
});

export const staticMeridiem = ["AM", "PM"];
