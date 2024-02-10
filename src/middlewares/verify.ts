import { NextFunction, Request, RequestHandler, Response } from "express";
import { withTryCatch } from "../utils/error";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../constants/auth";
import { UserModel } from "../features/user/schemas";
import { User, UserRole } from "../features/user/types";
import { AnyRecord } from "../types";

export const verifyUser: RequestHandler = (req, res, next) => {
  withTryCatch(req, res, async () => {
    let token = req.headers["token"]; // get the session cookie from request header
    let userIdInParams = req.params["userId"]; // get the session cookie from request header

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
      const autehticatedUser = await UserModel.findById(id); // find user by that `id`

      if (!autehticatedUser) {
        return res.status(401).json({ message: "The user does not exist" });
      }

      if (
        autehticatedUser.role === "user" &&
        autehticatedUser._id.toString() !== userIdInParams
      ) {
        return res
          .status(401)
          .json({ message: "This user has not access to this information" });
      }
      next();
    });
  });
};

export type RequestWithUser<
  P = AnyRecord,
  ResBody = any,
  ReqBody = any,
  ReqQuery = AnyRecord,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & {
  user: User;
};

// export const verifyBussiness = (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//   withTryCatch(req, res, async () => {
//     const user = req.user as User | undefined;
//     const businessId = req.params.businessId as string | undefined;

//     if (!businessId) {
//       return res
//         .sendStatus(404)
//         .json({ message: "The businessId does not exist" });
//     }

//     if (!user) {
//       return res.sendStatus(404).json({ message: "The user does not exist" });
//     }

//     const out = await queryHandlesBusiness.findOne({
//       businessId,
//       user,
//       res,
//     });

//     if (out instanceof ServerResponse) return;

//     //@ts-expect-error
//     req["business"] = out;

//     next();
//   });
// };

// export const getVerifyRole =
//   (roleToCheck: UserRole): RequestHandler =>
//   (req, res, next) => {
//     withTryCatch(req, res, async () => {
//       //@ts-expect-error
//       const user = req.user as User; // we have access to the user object from the request

//       const { role } = user; // extract the user role
//       // check if user has no advance privileges
//       // return an unathorized response
//       if (role !== roleToCheck) {
//         return res.status(401).json({
//           message: "Wrong role. You are not authorized to do this action.",
//         });
//       }
//       next();
//     });
//   };
