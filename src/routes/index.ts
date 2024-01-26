import { Router } from "express";
import { router as userRouter } from "./user";
import { router as postRouter } from "./post";
import { router as authRouter } from "./auth";

export const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/post", postRouter);
mainRouter.use("/auth", authRouter);
