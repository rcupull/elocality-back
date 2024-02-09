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
import { queryHandlesPosts } from "./handles";
import { ServerResponse } from "http";

export const router = Router();

/////////////////////////////////////////////////////////////////
router
  .route("/public/posts")
  .get(pagination, (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions } = req;

      const { search, businessIds } = query;

      const out = await queryHandlesPosts.getAll({
        res,
        paginateOptions,
        businessIds,
        search,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  });

router
  .route("/posts")
  .get(verifyAuth, pagination, (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions } = req;

      const { search, businessIds } = query;

      const out = await queryHandlesPosts.getAll({
        res,
        paginateOptions,
        businessIds,
        search,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
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
  )
  .delete(verifyAuth, (req: RequestWithUser, res) => {
    withTryCatch(req, res, async () => {
      const { body } = req;
      const { businessIds, ids } = body;

      const out = await queryHandlesPosts.deleteMany({ res, businessIds, ids });

      if (out instanceof ServerResponse) return;

      res.send();
    });
  });

///////////////////////////////////////////////////////////////////////////

router
  .route("/public/posts/:postId")
  .get(
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;
        const { postId } = params;

        const post = await PostModel.findOne({
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
