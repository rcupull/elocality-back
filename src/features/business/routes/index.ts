import { Router } from "express";
import { withTryCatch } from "../../../utils/error";
import { BusinessModel } from "../schemas";
import { verifyAuth } from "../../../middlewares/verify";
import { RequestObject } from "../../../types";
import { Business } from "../types";
import {
  getApiValidators,
  validators,
} from "../../../middlewares/express-validator";
import { PostModel } from "../../post/schemas";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/business")
  .get(verifyAuth, (req: RequestObject, res) => {
    withTryCatch(req, res, async () => {
      const { user } = req;

      const business = await BusinessModel.find({
        createdBy: user?._id,
      });

      res.send(business);
    });
  })
  .post(
    verifyAuth,
    ...getApiValidators(
      validators.body("name").notEmpty(),
      validators.body("category").notEmpty()
    ),
    (req: RequestObject<any, any, Business>, res) => {
      withTryCatch(req, res, async () => {
        const { body, user } = req;

        const { name, category } = body;

        const newBusiness = new BusinessModel({
          category,
          createdBy: user?._id,
          name,
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
    (req: RequestObject, res) => {
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
    (req: RequestObject, res) => {
      withTryCatch(req, res, async () => {
        const { user, params } = req;
        const { businessId } = params;

        await BusinessModel.deleteOne({
          _id: businessId,
        });

        res.send();
      });
    }
  );

/////////////////////////////////////////////////////////////////
router
  .route("/business/:businessId/posts")
  .get(
    verifyAuth,
    ...getApiValidators(validators.param("businessId").notEmpty()),
    (req: RequestObject, res) => {
      withTryCatch(req, res, async () => {
        const { params } = req;
        const { businessId } = params;

        const posts = await PostModel.find({
          businessId,
        });

        res.send(posts);
      });
    }
  )
  .post(
    verifyAuth,
    ...getApiValidators(
      validators.param("businessId").notEmpty(),
      validators.body("name").notEmpty(),
      validators.body("description").notEmpty()
    ),
    (req: RequestObject, res) => {
      withTryCatch(req, res, async () => {
        const { params, body } = req;
        const { businessId } = params;
        const { amountAvailable, currency, description, name, price } = body;

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
