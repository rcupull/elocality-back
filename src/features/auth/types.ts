import { Schema } from "mongoose";
import { BaseIdentity } from "../../types";

export interface Session extends BaseIdentity {
  token: string;
  userId: Schema.Types.ObjectId;
}

export interface ValidationCode extends BaseIdentity {
  code: string;
  userId: Schema.Types.ObjectId;
}
