import { Router } from "express";
import { validators } from "../../middlewares/express-validator";
import { pagination } from "../../middlewares/pagination";
import { businessHandles } from "./handles";

export const router = Router();

/////////////////////////////////////////////////////////////////

router.route("/business").get(pagination, businessHandles.get_business());

/////////////////////////////////////////////////////////////////

router
  .route("/business/:routeName")
  .get(
    validators.param("routeName").notEmpty(),
    validators.handle,
    businessHandles.get_business_routeName()
  );
