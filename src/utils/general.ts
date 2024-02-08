export const replaceAll = (
  value: string,
  match: string,
  replace: string
): string => value.split(match).join(replace);
