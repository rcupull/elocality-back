import { Response, Request } from "express";

export const withTryCatch = async (
  req: Request,
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
