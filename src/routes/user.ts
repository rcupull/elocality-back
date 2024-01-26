import { RequestHandler, Router } from "express";
import { connectCRUD } from "../db";
import { AnyRecord } from "../types/general";

export const router = Router();

router.route("/register").post((req: AnyRecord, res) => {
  const { email, password, name, body } = req.body;

  connectCRUD({
    dbName: "elocality-db",
    collectionName: "users",
    callback: async ({ collection }) => {
      await collection.insertOne({
        email,
        password,
        name,
      });

      res.send();
    },
  });
});

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
