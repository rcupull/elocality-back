import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { UserModel } from "../schemas";

export const router = Router();

router.route("/user").get((req, res) => {
  withTryCatch(req, res, async () => {
    const users = await UserModel.find();
    res.send(users);
  });
});
