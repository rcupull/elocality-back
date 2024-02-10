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
  userId: string;
}> = async ({ businessIds, ids, res, userId }) => {
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

  filterQuery.createdAt = userId;

  await PostModel.deleteMany(filterQuery);
};

const addOne: QueryHandle<
  {
    businessId: string;
    description: string;
    name: string;
    price?: number;
    currency?: string;
    amountAvailable?: number;
    userId: string;
  },
  Post
> = async ({
  businessId,
  description,
  name,
  amountAvailable,
  currency,
  price,
  userId,
}) => {
  const newPost = new PostModel({
    amountAvailable,
    businessId,
    currency,
    description,
    name,
    price,
    createdBy: userId,
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
