import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AnyRecord } from "../types/general";

export const ExpressValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error: AnyRecord = {};
    //@ts-expect-error ignore
    errors.array().map((err) => (error[err.param] = err.msg));
    return res.status(422).json({ error });
  }
  next();
};
