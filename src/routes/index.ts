import { Router } from "express";
import { router as userRouter } from "./user";
import { router as postRouter } from "./post";

export const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/post", postRouter);
