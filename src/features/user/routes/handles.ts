import { QueryHandle } from "../../../types";
import { User } from "../../user/types";
import { UserModel } from "../../user/schemas";

const addOne: QueryHandle<
  {
    email: string;
    password: string;
    name: string;
  },
  User
> = async ({ email, res, password, name }) => {
  // Check if the email is already registered
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(401).json({ message: "Email already registered" });
  }

  // Create a new user
  const newUser = new UserModel({
    email,
    password,
    passwordVerbose: password,
    name,
  });

  await newUser.save();

  return newUser;
};

export const queryHandlesUser = {
  addOne,
};
