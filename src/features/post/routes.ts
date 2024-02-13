import { Router } from "express";

import { pagination } from "../../middlewares/pagination";
import { validators } from "../../middlewares/express-validator";
import { postHandles } from "./handles";

export const router = Router();

router.route("/posts").get(pagination, postHandles.get_posts());

///////////////////////////////////////////////////////////////////////////

router
  .route("/posts/:postId")
  .get(
    validators.param("postId").notEmpty(),
    validators.handle,
    postHandles.get_posts_postId()
  );
