export const handleSetNumber = (
  value: string,
  setValue: (value: string) => void
) => {
  if (value.match(/[a-zA-Z!@#$&()\\-`.+,/\"]/g)) {
    return null;
  } else if (value.charAt(0) === "0") {
    return null;
  }

  setValue(value);
};
