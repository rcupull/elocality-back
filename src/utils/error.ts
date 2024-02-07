import { Response } from "express";
import { RequestWithPagination } from "../middlewares/pagination";
import { RequestWithUser } from "../middlewares/verify";

export const withTryCatch = async (
  req: RequestWithUser & RequestWithPagination,
  res: Response,
  callback: () => Promise<any> | any
) => {
  const { originalUrl, method } = req;

  const tag = `${method}-${originalUrl}`;

  try {
    await callback();
  } catch (error) {
    console.error("Error:", tag, error);
    res.status(500).json({ error: `Error: ${tag}` });
  }
};
