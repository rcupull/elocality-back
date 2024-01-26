import { Router } from "express";
import { AnyRecord } from "../types/general";
import { firebaseAuth } from "../features/firebase";
import {
  signInWithEmailAndPassword,
  revokeAccessToken,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { connectCRUD } from "../db";

export const router = Router();

router.route("/sign-in").post(async (req: AnyRecord, res) => {
  const { email, password } = req.body;
  const user = await signInWithEmailAndPassword(firebaseAuth, email, password);
  res.send(user);
});

router.route("/sign-out").post(async (req: AnyRecord, res) => {
  const { accessToken } = req.body;
  await revokeAccessToken(firebaseAuth, accessToken);
  res.send();
});

router.route("/sign-up").post((req: AnyRecord, res) => {
  const { email, password, name, body } = req.body;

  // try {
  //   const { email, username, password } = req.body;
  //   createUserWithEmailAndPassword(firebaseAuth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       var user = userCredential.user;
  //       console.log(user);
  //     })
  //     .catch((error) => {
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       console.log(error);
  //     });
  //   res.redirect("/");
  // } catch (e) {
  //   res.redirect("register");
  // }

  // connectCRUD({
  //   dbName: "elocality-db",
  //   collectionName: "users",
  //   callback: async ({ collection }) => {
  //     await collection.insertOne({
  //       email,
  //       password,
  //       name,
  //     });

  //     res.send();
  //   },
  // });

  res.send();
});
