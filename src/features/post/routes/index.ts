import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { PostModel } from "../schemas";

import {
  RequestWithPagination,
  pagination,
} from "../../../middlewares/pagination";
import { RequestWithUser, verifyAuth } from "../../../middlewares/verify";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/posts")
  .get(pagination, (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions } = req;

      const { search, businessIds } = query;

      const posts = await PostModel.paginate(
        {
          name: { $regex: new RegExp(search), $options: "i" },
          // businessId: {  } //TODO
        },
        paginateOptions
      );

      res.send(posts);
    });
  })
  .post(
    verifyAuth,
    ...getApiValidators(
      validators.body("businessId").notEmpty(),
      validators.body("name").notEmpty(),
      validators.body("description").notEmpty()
    ),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { body } = req;
        const {
          amountAvailable,
          currency,
          description,
          name,
          price,
          businessId,
        } = body;

        const newPost = new PostModel({
          amountAvailable,
          businessId,
          currency,
          description,
          name,
          price,
        });

        await newPost.save();

        res.send(newPost.toJSON());
      });
    }
  );

router
  .route("/posts/:postId")
  .get(
    verifyAuth,
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { user, params } = req;
        const { postId } = params;

        const post = await PostModel.findOne({
          createdBy: user?._id,
          _id: postId,
        });

        if (!post) {
          return res.status(404).json({
            message: "post not found",
          });
        }

        res.send(post);
      });
    }
  )
  .delete(
    verifyAuth,
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { user, params } = req;
        const { postId } = params;

        await PostModel.deleteOne({
          _id: postId,
        });

        res.send();
      });
    }
  );
