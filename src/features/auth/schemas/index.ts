import { Schema, model } from "mongoose";
import { Session, ValidationCode } from "../types";

const ValidationCodeShema = new Schema<ValidationCode>({
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const ValidationCodeModel = model<ValidationCode>(
  "ValidationCode",
  ValidationCodeShema,
  "validation_codes"
);

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////

const SessionShema = new Schema<Session>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const SessionModel = model<Session>("Session", SessionShema, "sessions");
