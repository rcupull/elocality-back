import { Router } from "express";
import { router as postRouter } from "./features/post/routes";
import { router as userRouter } from "./features/user/routes";
import { router as authRouter } from "./features/auth/routes";
import { router as businessRouter } from "./features/business/routes";

export const router = Router();

router.use("/", authRouter, userRouter, postRouter, businessRouter);

export default router;
