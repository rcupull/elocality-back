import { Response } from "express";
import { ServerResponse } from "http";
import { DeleteResult } from "mongodb";
import { Schema } from "mongoose";

export type AnyRecord = Record<string, any>;

export interface BaseIdentity {
  _id: Schema.Types.ObjectId;
  createdAt: string;
}

export type QueryHandle<Args extends AnyRecord = AnyRecord, R = void> = (
  args: Args & { res: Response }
) => Promise<R | ServerResponse>;
