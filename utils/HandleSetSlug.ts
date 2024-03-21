export const handleSetSlug = (
  value: string,
  setValue: (value: string) => void
) => {
  if (value.match(/ /g)) {
    const replaceValue = value.replace(/ /g, "-");
    setValue(replaceValue.toLowerCase());
  } else if (value.match(/[,.`'"]/g)) {
    return null;
  } else {
    setValue(value.toLowerCase());
  }
};
