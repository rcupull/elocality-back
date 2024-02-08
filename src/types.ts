import { Response } from "express";
import { ServerResponse } from "http";
import { DeleteResult } from "mongodb";

export type AnyRecord = Record<string, any>;

export interface BaseIdentity {
  _id: string;
  createdAt: Date;
}

export type QueryHandle<Args extends AnyRecord = AnyRecord, R = void> = (
  args: Args & { res: Response }
) => Promise<R | ServerResponse | DeleteResult>;
