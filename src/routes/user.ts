import { RequestHandler, Router } from "express";
import { connectCRUD } from "../db";
import { AnyRecord } from "../types/general";

export const router = Router();

router.route("/").get((req: AnyRecord, res) => {
  const { name } = req;

  connectCRUD({
    dbName: "elocality-db",
    collectionName: "users",
    callback: async ({ collection }) => {
      const users = await collection.find().toArray();
      res.send(users);
    },
  });
});
