import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { PostModel } from "../schemas";
import { Post } from "../types";
import { User } from "../../user/types";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    businessIds?: Array<string>;
    search?: string;
  },
  PaginateResult<Post>
> = async ({ paginateOptions, businessIds, search, res }) => {
  const filterQuery: FilterQuery<Post> = {};

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }

  if (businessIds?.length) {
    filterQuery.businessId = { $in: businessIds };
  }

  const out = await PostModel.paginate(filterQuery, paginateOptions);

  return out;
};

const getOne: QueryHandle<
  {
    postId: string;
  },
  Post
> = async ({ postId, res }) => {
  const filterQuery: FilterQuery<Post> = {};

  if (postId) {
    filterQuery._id = postId;
  }

  const out = await PostModel.findOne(filterQuery);

  if (!out) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  return out;
};

const deleteMany: QueryHandle<{
  businessIds?: Array<string>;
  ids?: Array<string>;
  user: User;
}> = async ({ businessIds, ids, res, user }) => {
  if (!businessIds?.length && !ids?.length) {
    return res.status(404).json({
      message: "businessId or ids are required",
    });
  }

  const filterQuery: FilterQuery<Post> = {};

  if (businessIds?.length) {
    filterQuery.businessId = { $in: businessIds };
  }

  if (ids?.length) {
    filterQuery._id = { $in: ids };
  }

  filterQuery.createdAt = user._id;

  const out = await PostModel.deleteMany(filterQuery);

  return out;
};

const addOne: QueryHandle<
  Pick<
    Post,
    | "amountAvailable"
    | "businessId"
    | "currency"
    | "description"
    | "name"
    | "price"
  > & { user?: User },
  Post
> = async ({
  businessId,
  description,
  name,
  amountAvailable,
  currency,
  price,
  user,
}) => {
  const newPost = new PostModel({
    amountAvailable,
    businessId,
    currency,
    description,
    name,
    price,
    createdBy: user?._id,
  });

  await newPost.save();

  return newPost;
};

export const queryHandlesPosts = {
  deleteMany,
  getAll,
  addOne,
  getOne,
};
