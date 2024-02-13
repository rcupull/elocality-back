import { FilterQuery, PaginateOptions } from "mongoose";
import { QueryHandle } from "../../types";
import { PostModel } from "./schemas";
import { Post } from "./types";
import {
  PaginateResult,
  paginationCustomLabels,
} from "../../middlewares/pagination";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    routeNames?: Array<string>;
    search?: string;
    hidden?: boolean;
    hiddenBusiness?: boolean;
    createdBy?: string;
  },
  PaginateResult<Post>
> = async ({
  paginateOptions = {},
  routeNames,
  search,
  hiddenBusiness,
  hidden,
  createdBy,
}) => {
  const filterQuery: FilterQuery<Post> = {};

  ///////////////////////////////////////////////////////////////////

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }
  ///////////////////////////////////////////////////////////////////

  if (routeNames?.length) {
    filterQuery.routeName = { $in: routeNames };
  }

  ///////////////////////////////////////////////////////////////////

  if (hidden !== undefined) {
    filterQuery.hidden = hidden;
  }

  ///////////////////////////////////////////////////////////////////

  if (hiddenBusiness !== undefined) {
    filterQuery.hiddenBusiness = hiddenBusiness;
  }

  ///////////////////////////////////////////////////////////////////

  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }

  ///////////////////////////////////////////////////////////////////

  const out = await PostModel.paginate(filterQuery, {
    ...paginateOptions,
    customLabels: paginationCustomLabels,
  });

  return out as unknown as PaginateResult<Post>;
};

const getOne: QueryHandle<
  {
    postId: string;
    hidden?: boolean;
  },
  Post
> = async ({ postId, res, hidden }) => {
  const filterQuery: FilterQuery<Post> = {};

  if (postId) {
    filterQuery._id = postId;
  }

  if (hidden !== undefined) {
    filterQuery.hidden = hidden;
  }

  const out = await PostModel.findOne(filterQuery);

  if (!out) {
    return res.status(404).json({
      message: "Post not found or you are not access to this post",
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
    | "createdBy"
  >,
  Post
> = async (args) => {
  const newPost = new PostModel(args);

  await newPost.save();

  return newPost;
};

const updateOne: QueryHandle<{
  postId: string;
  partial: Partial<
    Pick<
      Post,
      | "currency"
      | "description"
      | "images"
      | "price"
      | "amountAvailable"
      | "clothingSizes"
      | "colors"
      | "details"
      | "highlights"
      | "hidden"
    >
  >;
}> = async ({ postId, partial }) => {
  const {
    amountAvailable,
    clothingSizes,
    colors,
    currency,
    description,
    details,
    highlights,
    images,
    price,
    hidden,
  } = partial;

  await PostModel.updateOne(
    {
      _id: postId,
    },
    {
      amountAvailable,
      clothingSizes,
      colors,
      currency,
      description,
      details,
      highlights,
      images,
      price,
      hidden,
    }
  );
};

export const queryHandlesPosts = {
  deleteMany,
  getAll,
  addOne,
  getOne,
  updateOne,
};
