import { Router } from "express";
import { pagination } from "../../middlewares/pagination";
import { validators } from "../../middlewares/express-validator";
import { verifyUser } from "../../middlewares/verify";

import { userHandles } from "./handles";
import { uploadMiddleware } from "../../middlewares/files";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business")
  .get(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.handle,
    pagination,
    userHandles.get_users_userId_business()
  )
  .post(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.body("name").notEmpty(),
    validators.body("category").notEmpty(),
    validators.body("routeName").notEmpty(),
    validators.handle,
    userHandles.post_users_userId_business()
  );

router
  .route("/user/:userId/business/allRouteNames")
  .get(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.handle,
    pagination,
    userHandles.get_users_userId_business_all_routeNames()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business/:routeName")
  .get(
    verifyUser,
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    userHandles.get_users_userId_business_routeName()
  )
  .put(
    verifyUser,
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    userHandles.put_users_userId_business_routeName()
  )
  .delete(
    verifyUser,
    //TODO add a middlware to check acces to this business
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    userHandles.delete_users_userId_business_routeName()
  );

/////////////////////////////////////////////////////////////////

router.route("/user/:userId/business/:routeName/image").post(
  verifyUser,
  //TODO add a middlware to check acces to this business
  validators.param("userId").notEmpty(),
  validators.param("routeName").notEmpty(),
  validators.handle,
  uploadMiddleware.single("image"),
  userHandles.post_users_userId_business_routeName_image()
);

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/posts")
  .get(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.handle,
    pagination,
    userHandles.get_users_userId_posts()
  )
  .post(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.body("routeName").notEmpty(),
    validators.body("name").notEmpty(),
    validators.body("description").notEmpty(),
    validators.handle,
    userHandles.post_users_userId_posts()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/posts/:postId")
  .get(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    userHandles.get_users_userId_posts_postId()
  )
  .put(
    verifyUser,
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    userHandles.put_users_userId_posts_postId()
  )
  .delete(
    verifyUser,
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,

    userHandles.delete_users_userId_posts_postId()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/payment/plan")
  .get(
    verifyUser,
    validators.param("userId").notEmpty(),
    validators.handle,
    userHandles.get_users_userId_payment_plan()
  );
