import { Request, Router } from "express";
import { withTryCatch } from "../../../utils/error";
import {
  RequestWithPagination,
  pagination,
} from "../../../middlewares/pagination";
import { queryHandlesBusiness } from "../../business/routes/handles";
import { ServerResponse } from "http";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";
import { Business } from "../../business/types";
import { queryHandlesPosts } from "../../post/routes/handles";
import { verifyUser } from "../../../middlewares/verify";

export const router = Router();

router
  .route("/user/:userId/business")
  .get(
    verifyUser,
    ...getApiValidators(validators.param("userId").notEmpty()),
    pagination,
    (req: RequestWithPagination, res) => {
      withTryCatch(req, res, async () => {
        const { paginateOptions, query, params } = req;

        const { userId } = params;

        const { routeName, search } = query;

        const out = await queryHandlesBusiness.getAll({
          res,
          paginateOptions,
          userId,
          routeName,
          search,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  )
  .post(
    verifyUser,
    ...getApiValidators(
      validators.param("userId").notEmpty(),
      validators.body("name").notEmpty(),
      validators.body("category").notEmpty(),
      validators.body("routeName").notEmpty()
    ),
    (req: Request<any, any, Business>, res) => {
      withTryCatch(req, res, async () => {
        const { body, params } = req;

        const { userId } = params;

        const { name, category, routeName } = body;

        const out = await queryHandlesBusiness.addOne({
          category,
          name,
          routeName,
          userId,
          res,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );

router
  .route("/user/:userId/business/:routeName")
  .delete(
    verifyUser,
    ...getApiValidators(
      validators.param("userId").notEmpty(),
      validators.param("routeName").notEmpty()
    ),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;

        const { routeName, userId } = params;

        const out = await queryHandlesBusiness.deleteOne({
          res,
          routeName,
          userId,
        });

        if (out instanceof ServerResponse) return;

        res.send();
      });
    }
  );

router
  .route("/user/:userId/posts")
  .post(
    verifyUser,
    ...getApiValidators(
      validators.param("userId").notEmpty(),
      validators.body("routeName").notEmpty(),
      validators.body("name").notEmpty(),
      validators.body("description").notEmpty()
    ),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { body, params } = req;

        const { userId } = params;

        const {
          amountAvailable,
          currency,
          description,
          name,
          price,
          routeName,
        } = body;

        const out = await queryHandlesPosts.addOne({
          res,
          amountAvailable,
          routeName,
          currency,
          description,
          name,
          price,
          userId,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );

router
  .route("/user/:userId/posts/:postId")
  .delete(
    verifyUser,
    ...getApiValidators(
      validators.param("userId").notEmpty(),
      validators.param("postId").notEmpty()
    ),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;
        const { postId, userId } = params;

        const out = await queryHandlesPosts.deleteMany({
          res,
          ids: [postId],
          userId,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );
