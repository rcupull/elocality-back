import { Router } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithUser } from "../../middlewares/verify";
import {
  getApiValidators,
  validators,
} from "../../middlewares/express-validator";
import {
  RequestWithPagination,
  pagination,
} from "../../middlewares/pagination";
import { businessServices } from "./services";
import { ServerResponse } from "http";

export const router = Router();

/////////////////////////////////////////////////////////////////

router.route("/business").get(pagination, (req, res) => {
  withTryCatch(req, res, async () => {
    const { paginateOptions, query } = req as unknown as RequestWithPagination;

    const { routeName, search } = query;

    const out = await businessServices.getAll({
      res,
      paginateOptions,
      routeName,
      search,
      hidden: false,
    });

    if (out instanceof ServerResponse) return;

    res.send(out);
  });
});

/////////////////////////////////////////////////////////////////

router
  .route("/business/:routeName")
  .get(
    ...getApiValidators(validators.param("routeName").notEmpty()),
    (req, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req as unknown as RequestWithUser;
        const { routeName } = params;

        const out = await businessServices.findOne({
          res,
          routeName,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );
