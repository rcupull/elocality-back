import { Router } from "express";
import { AnyRecord } from "../types/general";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import { withTryCatch } from "../utils/error";
import { SessionModel, UserModel, ValidationCodeModel } from "../schemas/auth";
import { sendEmail } from "../features/email";

export const router = Router();

router.route("/sign-in").post(async (req: AnyRecord, res) => {
  withTryCatch(
    "sing-in",
    res
  )(async () => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.validated) {
      return res.status(401).json({
        message: "The user has not been validated",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      `${req.body.password}`,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = user.generateAccessJWT();

    const newSession = new SessionModel({
      token,
      userId: user._id,
    });
    await newSession.save();

    const { password: ommited, ...userData } = user.toJSON();

    res.status(200).json({
      user: userData,
      token,
    });
  });
});

router.route("/sign-out").post(async (req: AnyRecord, res) => {
  withTryCatch(
    "signOut",
    res
  )(async () => {
    const { token } = req.body;

    const session = await SessionModel.findOne({ token });

    if (!session) {
      return res.status(401).json({
        message: "the session does not exist",
      });
    }

    await SessionModel.deleteOne({ token });

    return res.status(201).json({
      message: "the session was closed successfully",
    });
  });
});

router.route("/sign-up").post(async (req: AnyRecord, res) => {
  withTryCatch(
    "sign-up",
    res
  )(async () => {
    const { email, password, name } = req.body;

    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new UserModel({ email, password, name });
    await newUser.save();

    const code = uuid().slice(0, 4).toUpperCase();

    await sendEmail({ email, code });
    const newValidationCode = new ValidationCodeModel({
      code,
      userId: newUser.id,
    });
    await newValidationCode.save();

    res.status(201).json({ message: "User registered successfully" });
  });
});

router.route("/validate").post(async (req: AnyRecord, res) => {
  withTryCatch(
    "validate",
    res
  )(async () => {
    const { email, code } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "This user does not exist" });
    }

    //check validation code
    const validationCode = await ValidationCodeModel.findOne({
      code,
      userId: user.id,
    });
    if (!validationCode) {
      return res
        .status(400)
        .json({ message: "This validation code does not exist" });
    }

    //validate user
    user.validated = true;
    await user.save();

    //delete validation code
    await ValidationCodeModel.deleteOne({ _id: validationCode._id });

    res.status(201).json({ message: "User validated successfully" });
  });
});
