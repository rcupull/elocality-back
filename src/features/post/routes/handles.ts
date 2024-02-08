import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { PostModel } from "../schemas";
import { Post } from "../types";

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

const deleteMany: QueryHandle<{
  businessIds?: Array<string>;
  ids?: Array<string>;
}> = async ({ businessIds, ids, res }) => {
  if (!businessIds?.length && !ids?.length) {
    return res.status(404).json({
      message: "businessId or ids are required",
    });
  }

  if (businessIds?.length) {
    return await PostModel.deleteMany({ businessId: { $in: businessIds } });
  }

  if (ids?.length) {
    return await PostModel.deleteMany({ _id: { $in: ids } });
  }
};

export const queryHandlesPosts = {
  deleteMany,
  getAll,
};
