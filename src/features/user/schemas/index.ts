import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../../../constants/auth";
import { UserT } from "../../../types/auth";
import { getRouteName } from "../../../utils/general";

const UserSchema = new Schema<UserT>({
  name: { type: String, required: true },
  routeName: { type: String, required: true },
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

const updateUserPassword = (user: UserT): Promise<void> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return reject(err);

        user.password = hash;
        resolve();
      });
    });
  });
};

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("name")) {
    user.routeName = getRouteName(user.name);
  }

  if (user.isModified("password")) {
    try {
      await updateUserPassword(user);
    } catch (err: any) {
      next(err);
    }
  }

  next();
});

export const UserModel = model<UserT>("User", UserSchema, "users");
