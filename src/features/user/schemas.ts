import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../../constants/auth";
import { User } from "./types";
import { createdAtSchemaDefinition } from "../../utils/schemas";

const UserSchema = new Schema<User>({
  ...createdAtSchemaDefinition,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  passwordVerbose: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  validated: { type: Boolean, default: false },
  payment: {
    planHistory: {
      type: [
        {
          planType: {
            type: String,
            enum: ["free", "beginner", "professional", "company"],
            required: true,
          },
          dateOfPurchase: { type: String, required: true },
          trialMode: { type: Boolean, required: true },
        },
      ],
      default: [
        {
          planType: "free",
          dateOfPurchase: new Date().toISOString(),
          trialMode: true,
        },
      ],
    },
  },
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

const updateUserPassword = (user: User): Promise<void> => {
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

  if (user.isModified("password")) {
    try {
      await updateUserPassword(user);
    } catch (err: any) {
      next(err);
    }
  }

  next();
});

export const UserModel = model<User>("User", UserSchema, "users");
