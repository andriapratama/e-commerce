export const ConvertTime = (date: string) => {
  const time = new Date(date);

  const res = time.toLocaleTimeString();

  return res;
};
