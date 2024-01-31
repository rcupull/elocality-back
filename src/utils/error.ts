import { Response } from "express";

export const withTryCatch =
  (process: string, res: Response) =>
  async (callback: () => Promise<any> | any) => {
    try {
      await callback();
    } catch (error) {
      console.error("Error:", process, error);
      res.status(500).json({ error: `Error: ${process}` });
    }
  };
