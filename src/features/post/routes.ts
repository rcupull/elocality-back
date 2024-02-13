import { Router } from "express";
import { withTryCatch } from "../../utils/error";

import {
  RequestWithPagination,
  pagination,
} from "../../middlewares/pagination";
import {
  getApiValidators,
  validators,
} from "../../middlewares/express-validator";
import { postServices } from "./services";
import { ServerResponse } from "http";

export const router = Router();

router.route("/posts").get(pagination, (req, res) => {
  withTryCatch(req, res, async () => {
    const { query, paginateOptions } = req as unknown as RequestWithPagination;

    const { search, routeNames } = query;

    const out = await postServices.getAll({
      res,
      paginateOptions,
      routeNames,
      search,
      hidden: false,
      hiddenBusiness: false,
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

        const out = await postServices.getOne({
          res,
          postId,
          hidden: false,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );
