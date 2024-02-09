import { FilterQuery, PaginateOptions, PaginateResult, Schema } from "mongoose";
import { QueryHandle } from "../../../types";
import { Business, BusinessCategory } from "../types";
import { BusinessModel } from "../schemas";
import { User } from "../../user/types";
import { queryHandlesPosts } from "../../post/routes/handles";
import { ServerResponse } from "http";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    user?: User;
    routeName?: string;
  },
  PaginateResult<Business>
> = async ({ paginateOptions, user, routeName }) => {
  const filterQuery: FilterQuery<Business> = {};

  if (user?._id) {
    filterQuery.createdBy = user?._id;
  }

  if (routeName) {
    filterQuery.routeName = routeName;
  }

  const out = await BusinessModel.paginate(filterQuery, paginateOptions);

  return out;
};

const addOne: QueryHandle<
  {
    category: BusinessCategory;
    name: string;
    routeName: string;
    user?: User;
  },
  Business
> = async ({ category, user, routeName, name, res }) => {
  const routeNameExists = await BusinessModel.findOne({ routeName });
  if (routeNameExists) {
    return res.status(400).json({
      message: "Route name already exists",
    });
  }

  const out = new BusinessModel({
    category,
    createdBy: user?._id,
    name,
    routeName,
  });

  await out.save();

  return out;
};

const findOne: QueryHandle<
  {
    businessId: string;
    user?: User;
  },
  Business
> = async ({ businessId, user, res }) => {
  const out = await BusinessModel.findOne({
    createdBy: user?._id,
    _id: businessId,
  });

  if (!out) {
    return res.status(404).json({
      message: "Business not found",
    });
  }

  return out;
};

const deleteOne: QueryHandle<{
  businessId: string;
  user?: User;
}> = async ({ businessId, res, user }) => {
  await BusinessModel.deleteOne({
    _id: businessId,
    createdBy: user?._id,
  });

  const out = await queryHandlesPosts.deleteMany({
    businessIds: [businessId],
    res,
  });

  if (out instanceof ServerResponse) return;
};

export const queryHandlesBusiness = {
  getAll,
  addOne,
  findOne,
  deleteOne,
};