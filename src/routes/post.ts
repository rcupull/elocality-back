import { Router } from "express";
import { verifySession } from "../middlewares/verify";

export const router = Router();

router.route("/").get((req, res) => {
  res.send();
});

router.route("/").post(verifySession, (req, res) => {
  res.send();
});
