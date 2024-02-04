import { Request, Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { SalePostModel } from "../schemas";

export const router = Router();

router.route("/").get((req, res) => {
  withTryCatch(req, res, async () => {
    res.send([]);
  });
});

router.route("/").post((req: Request, res) => {
  withTryCatch(req, res, async () => {
    const {
      amountAvailable,
      category,
      currency,
      description,
      images,
      name,
      price,
      user,
    } = req.body;

    const newPost = new SalePostModel({
      amountAvailable,
      category,
      currency,
      description,
      name,
      price,
      userId: user._id,
    });

    await newPost.save();

    res.send([]);
  });
});
