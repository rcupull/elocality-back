import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../constants/auth";

interface ValidationCodeT {
  code: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
}

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

export type UserRoleT = "user" | "admin";

export interface UserT {
  name: string;
  email: string;
  password: string;
  role: UserRoleT;
  createdAt: Date;
  validated: boolean;
  generateAccessJWT: () => string;
}

const UserSchema = new Schema<UserT>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  validated: { type: Boolean, default: false },
});

UserSchema.methods.generateAccessJWT = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    SECRET_ACCESS_TOKEN,
    {
      expiresIn: "30d", // TODO handle refreshing token
    }
  );
};

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export const UserModel = model<UserT>("User", UserSchema, "users");

///////////////////////////////////////////////////////////////////////////////

interface SessionT {
  token: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
}

const SessionShema = new Schema<SessionT>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const SessionModel = model<SessionT>(
  "Session",
  SessionShema,
  "sessions"
);
