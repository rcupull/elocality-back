export const replaceAll = (
  value: string,
  match: string,
  replace: string
): string => value.split(match).join(replace);

export const getRouteName = (name: string): string => {
  let out = name.toLowerCase();
  out = replaceAll(out, " ", "-");

  return out;
};
