import { Router } from "express";
import { withTryCatch } from "../../../utils/error";

import {
  RequestWithPagination,
  pagination,
} from "../../../middlewares/pagination";
import { RequestWithUser, verifyUser } from "../../../middlewares/verify";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";
import { queryHandlesPosts } from "./handles";
import { ServerResponse } from "http";

export const router = Router();

router.route("/posts").get(pagination, (req, res) => {
  withTryCatch(req, res, async () => {
    const { query, paginateOptions } = req as unknown as RequestWithPagination;

    const { search, routeNames } = query;

    const out = await queryHandlesPosts.getAll({
      res,
      paginateOptions,
      routeNames,
      search,
      hidden: false,
    });

    if (out instanceof ServerResponse) return;

    res.send(out);
  });
});

///////////////////////////////////////////////////////////////////////////

router
  .route("/posts/:postId")
  .get(
    ...getApiValidators(validators.param("postId").notEmpty()),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;
        const { postId } = params;

        const out = await queryHandlesPosts.getOne({
          res,
          postId,
          hidden: false,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );
