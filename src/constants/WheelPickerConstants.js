export const staticHours = Array.from({ length: 12 }, (_, i) => {
  const value = i + 1;
  return {
    label: value.toString().padStart(2, "0"),
    value: value,
  };
});

export const staticMinutes = Array.from({ length: 60 }, (_, i) => i)
  .filter((i) => i % 5 === 0)
  .map((value) => {
    return {
      label: value.toString().padStart(2, "0"),
      value: value,
    };
  });

export const staticMeridiem = ["AM", "PM"];
