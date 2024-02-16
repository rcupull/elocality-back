import { Schema } from "mongoose";

export const replaceAll = (
  value: string,
  match: string,
  replace: string
): string => value.split(match).join(replace);

export const isEqualIds = (
  id1: string | Schema.Types.ObjectId,
  id2: string | Schema.Types.ObjectId
): boolean => {
  const id1Str = typeof id1 === "string" ? id1 : id1.toString();
  const id2Str = typeof id2 === "string" ? id2 : id2.toString();

  return id1Str === id2Str;
};
