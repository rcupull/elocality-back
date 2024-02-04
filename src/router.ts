import { Router } from "express";
import { router as postRouter } from "./features/post/routes";
import { router as userRouter } from "./features/user/routes";
import { router as authRouter } from "./features/auth/routes";

export const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/auth", authRouter);

export default router;
