import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { PostModel } from "../schemas";
import { Post } from "../types";
import { RequestObject } from "../../../types";
import { verifyAuth } from "../../../middlewares/verify";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";

export const router = Router();

/////////////////////////////////////////////////////////////////

router.route("/posts").get((req, res) => {
  withTryCatch(req, res, async () => {
    res.send([]);
  });
});
