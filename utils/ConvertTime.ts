export const ConvertTime = (date: Date) => {
  const time = new Date(date);

  const res = time.toLocaleTimeString();

  return res;
};
