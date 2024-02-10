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
  .post(
    verifyAuth,
    ...getApiValidators(
      validators.body("businessId").notEmpty(),
      validators.body("name").notEmpty(),
      validators.body("description").notEmpty()
    ),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { body, user } = req as unknown as RequestWithUser;

        const {
          amountAvailable,
          currency,
          description,
          name,
          price,
          businessId,
        } = body;

        const out = await queryHandlesPosts.addOne({
          res,
          amountAvailable,
          businessId,
          currency,
          description,
          name,
          price,
          user,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  )
  .delete(verifyAuth, (req, res) => {
    withTryCatch(req, res, async () => {
      const { body, user } = req as unknown as RequestWithUser;
      const { businessIds, ids } = body;

      const out = await queryHandlesPosts.deleteMany({
        res,
        businessIds,
        ids,
        user,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  });

///////////////////////////////////////////////////////////////////////////

router
  .route("/public/posts/:postId")
  .get(
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;
        const { postId } = params;

        const out = await queryHandlesPosts.getOne({ res, postId });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );

router
  .route("/posts/:postId")
  .delete(
    verifyAuth,
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { user, params } = req as unknown as RequestWithUser;
        const { postId } = params;

        const out = await queryHandlesPosts.deleteMany({
          res,
          ids: [postId],
          user,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );
