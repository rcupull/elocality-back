import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { RequestWithUser, verifyAuth } from "../../../middlewares/verify";
import { Business } from "../types";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";
import {
  RequestWithPagination,
  pagination,
} from "../../../middlewares/pagination";
import { queryHandlesBusiness } from "./handles";
import { ServerResponse } from "http";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/public/business")
  .get(pagination, (req: RequestWithUser & RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions, query } = req;

      const { routeName, search } = query;

      const out = await queryHandlesBusiness.getAll({
        res,
        paginateOptions,
        routeName,
        search,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  });

/////////////////////////////////////////////////////////////////

router
  .route("/business")
  .get(
    verifyAuth,
    pagination,
    (req: RequestWithUser & RequestWithPagination, res) => {
      withTryCatch(req, res, async () => {
        const { user, paginateOptions, query } = req;

        const { routeName, search } = query;

        const out = await queryHandlesBusiness.getAll({
          res,
          paginateOptions,
          user,
          routeName,
          search,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  )
  .post(
    verifyAuth,
    ...getApiValidators(
      validators.body("name").notEmpty(),
      validators.body("category").notEmpty(),
      validators.body("routeName").notEmpty()
    ),
    (req: RequestWithUser<any, any, Business>, res) => {
      withTryCatch(req, res, async () => {
        const { body, user } = req;

        const { name, category, routeName } = body;

        const out = await queryHandlesBusiness.addOne({
          category,
          name,
          routeName,
          user,
          res,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );

/////////////////////////////////////////////////////////////////

router
  .route("/public/business/:businessId")
  .get(
    ...getApiValidators(validators.param("businessId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { params, query } = req;
        const { businessId } = params;

        const out = await queryHandlesBusiness.findOne({
          res,
          businessId,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  );

router
  .route("/business/:businessId")
  .get(
    verifyAuth,
    ...getApiValidators(validators.param("businessId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { user, params, query } = req;
        const { businessId } = params;

        const out = await queryHandlesBusiness.findOne({
          user,
          res,
          businessId,
        });

        if (out instanceof ServerResponse) return;

        res.send(out);
      });
    }
  )
  .delete(
    verifyAuth,
    ...getApiValidators(validators.param("businessId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { user, params } = req;
        const { businessId } = params;

        const out = await queryHandlesBusiness.deleteOne({
          res,
          businessId,
          user,
        });

        if (out instanceof ServerResponse) return;

        res.send();
      });
    }
  );
