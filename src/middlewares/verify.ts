import { RequestHandler } from "express";
import { UserRoleT, UserT } from "../schemas/auth";
import { withTryCatch } from "../utils/error";
import jwt from "jsonwebtoken";
import { UserModel } from "../schemas/auth";
import { SECRET_ACCESS_TOKEN } from "../constants/auth";

export const verifySession: RequestHandler = (req, res, next) => {
  withTryCatch(
    "sessionVerify",
    res
  )(async () => {
    let token = req.headers["token"]; // get the session cookie from request header

    if (!token) {
      return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
    }

    if (token instanceof Array) {
      token = token[0];
    }

    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }

      //@ts-expect-error
      const { id } = decoded; // get user id from the decoded token
      const user = await UserModel.findById(id); // find user by that `id`

      if (!user) {
        return res.status(401).json({ message: "The user does not exist" });
      }

      const { password, ...data } = user?.toJSON(); // return user object without the password

      //@ts-expect-error
      req["user"] = data; // put the data object into req.user
      next();
    });
  });
};

export const getVerifyRole =
  (roleToCheck: UserRoleT): RequestHandler =>
  (req, res, next) => {
    withTryCatch(
      "getVerifyRole",
      res
    )(async () => {
      //@ts-expect-error
      const user = req.user as UserT; // we have access to the user object from the request

      const { role } = user; // extract the user role
      // check if user has no advance privileges
      // return an unathorized response
      if (role !== roleToCheck) {
        return res.status(401).json({
          message: "Wrong role. You are not authorized to do this action.",
        });
      }
      next();
    });
  };