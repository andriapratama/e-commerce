export const ConvertDateId = (value: Date) => {
  const date = new Date(value);

  const DD = date.getDay();
  const dd = date.getDate();
  const mm = date.getMonth();
  const yy = date.getFullYear();

  let day = "";

  if (DD === 0) day = "minggu";
  if (DD === 1) day = "senin";
  if (DD === 2) day = "selasa";
  if (DD === 3) day = "rabu";
  if (DD === 4) day = "kamis";
  if (DD === 5) day = "jumat";
  if (DD === 6) day = "sabtu";

  let month = "";

  if (mm === 0) month = "januari";
  if (mm === 1) month = "februari";
  if (mm === 2) month = "maret";
  if (mm === 3) month = "april";
  if (mm === 4) month = "mei";
  if (mm === 5) month = "juni";
  if (mm === 6) month = "juli";
  if (mm === 7) month = "agustus";
  if (mm === 8) month = "september";
  if (mm === 9) month = "oktober";
  if (mm === 10) month = "november";
  if (mm === 11) month = "desember";

  const fullDateName = `${day}, ${dd} ${month} ${yy}`;

  const fullDateNumber = `${yy}-${mm + 1}-${dd}`;

  return { fullDateName, month, mm, yy, dd, DD, day, fullDateNumber };
};
