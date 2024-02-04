import { Schema, model } from "mongoose";
import { SessionT, ValidationCodeT } from "../../../types/auth";

const ValidationCodeShema = new Schema<ValidationCodeT>({
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const ValidationCodeModel = model<ValidationCodeT>(
  "ValidationCode",
  ValidationCodeShema,
  "validation_codes"
);

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////

const SessionShema = new Schema<SessionT>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const SessionModel = model<SessionT>(
  "Session",
  SessionShema,
  "sessions"
);
