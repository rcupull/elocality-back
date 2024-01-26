import { RequestHandler, Router } from "express";
import { connectCRUD } from "../db";
import { AnyRecord } from "../types/general";

export const router = Router();

router.route("/").get((req: AnyRecord, res) => {
  const { email, password, name } = req;

  res.send("Hola");
  //   connectCRUD({
  //     dbName: "elocality-db",
  //     collectionName: "users",
  //     callback: async ({ client, collection, db }) => {
  //       collection.insertOne({
  //         email,
  //         password,
  //       });

  //       res.send();
  //     },
  //   });
});
