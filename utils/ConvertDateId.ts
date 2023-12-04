export const ConvertDateId = (value: string) => {
  const date = new Date(value);

  const DD = date.getDay();
  const dd = date.getDate();
  const mm = date.getMonth();
  const yy = date.getFullYear();

  let day = "";

  if (DD === 0) day = "Minggu";
  if (DD === 1) day = "Senin";
  if (DD === 2) day = "Selasa";
  if (DD === 3) day = "Rabu";
  if (DD === 4) day = "Kamis";
  if (DD === 5) day = "Jumat";
  if (DD === 5) day = "Sabtu";

  let mounth = "";

  if (mm === 0) mounth = "Januari";
  if (mm === 1) mounth = "Februari";
  if (mm === 2) mounth = "Maret";
  if (mm === 3) mounth = "April";
  if (mm === 4) mounth = "Mei";
  if (mm === 5) mounth = "Juni";
  if (mm === 6) mounth = "Juli";
  if (mm === 7) mounth = "Agustus";
  if (mm === 8) mounth = "September";
  if (mm === 9) mounth = "Oktober";
  if (mm === 10) mounth = "November";
  if (mm === 11) mounth = "Desember";

  return `${day}, ${dd} ${mounth} ${yy}`;
};
