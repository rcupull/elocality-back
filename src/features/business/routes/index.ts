import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { BusinessModel } from "../schemas";
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
import { queryHandlesPosts } from "../../post/routes/handles";
import { queryHandlesBusiness } from "./handles";
import { ServerResponse } from "http";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/business")
  .get(
    verifyAuth,
    pagination,
    (req: RequestWithUser & RequestWithPagination, res) => {
      withTryCatch(req, res, async () => {
        const { user, paginateOptions } = req;

        const out = await queryHandlesBusiness.getAll({
          res,
          paginateOptions,
          user,
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

        const newBusiness = new BusinessModel({
          category,
          createdBy: user?._id,
          name,
          routeName,
        });

        await newBusiness.save();

        res.send(newBusiness);
      });
    }
  );

/////////////////////////////////////////////////////////////////
router
  .route("/business/:businessId")
  .get(
    verifyAuth,
    ...getApiValidators(validators.param("businessId").notEmpty()),
    (req: RequestWithUser, res) => {
      withTryCatch(req, res, async () => {
        const { user, params, query } = req;
        const { businessId } = params;

        const business = await BusinessModel.findOne({
          createdBy: user?._id,
          _id: businessId,
        });

        if (!business) {
          return res.status(404).json({
            message: "Business not found",
          });
        }

        res.send(business);
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

        const out = await queryHandlesPosts.deleteMany({
          businessIds: [businessId],
          res,
        });

        if (out instanceof ServerResponse) return;

        await BusinessModel.deleteOne({
          _id: businessId,
        });

        res.send();
      });
    }
  );
