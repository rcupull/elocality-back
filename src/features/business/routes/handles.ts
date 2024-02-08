import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { Business } from "../types";
import { BusinessModel } from "../schemas";
import { User } from "../../user/types";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    user?: User;
  },
  PaginateResult<Business>
> = async ({ paginateOptions, res, user }) => {
  const filterQuery: FilterQuery<Business> = {};

  if (user?._id) {
    filterQuery.createdBy = user?._id;
  }

  const out = await BusinessModel.paginate(filterQuery, paginateOptions);

  return out;
};

export const queryHandlesBusiness = {
  getAll,
};
