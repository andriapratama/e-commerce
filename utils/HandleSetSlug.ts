export const handleSetSlug = (
  value: string,
  setValue: (value: string) => void
) => {
  if (value.match(/ /g)) {
    const replaceValue = value.replace(/ /g, "-");
    setValue(replaceValue.toLowerCase());
  } else {
    setValue(value.toLowerCase());
  }
};
