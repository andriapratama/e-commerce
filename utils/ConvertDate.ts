export const ConvertDate = (value: string) => {
  const date = new Date(value);

  const day = date.getDate();
  const mounth = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${mounth}/${year}`;
};
