export const ConvertIDR = (number: number) => {
  const num = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);

  const result = num.replace(",00", "");
  return result;
};
