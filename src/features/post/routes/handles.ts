import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { PostModel } from "../schemas";
import { Post, PostImage } from "../types";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    routeNames?: Array<string>;
    search?: string;
  },
  PaginateResult<Post>
> = async ({ paginateOptions, routeNames, search, res }) => {
  const filterQuery: FilterQuery<Post> = {};

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }

  if (routeNames?.length) {
    filterQuery.routeName = { $in: routeNames };
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
  routeNames?: Array<string>;
  ids?: Array<string>;
  userId: string;
}> = async ({ routeNames, ids, res, userId }) => {
  if (!routeNames?.length && !ids?.length) {
    return res.status(404).json({
      message: "businessId or ids are required",
    });
  }

  const filterQuery: FilterQuery<Post> = {};

  if (routeNames?.length) {
    filterQuery.routeName = { $in: routeNames };
  }

  if (ids?.length) {
    filterQuery._id = { $in: ids };
  }

  filterQuery.createdBy = userId;

  await PostModel.deleteMany(filterQuery);
};

const addOne: QueryHandle<
  Pick<
    Post,
    | "currency"
    | "description"
    | "images"
    | "price"
    | "routeName"
    | "amountAvailable"
    | "name"
    | "clothingSizes"
    | "colors"
    | "details"
    | "highlights"
  > & { userId: string },
  Post
> = async ({ userId, ...omittedProps }) => {
  const newPost = new PostModel({
    ...omittedProps,
    reviews: [0, 0, 0, 0, 0],
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
