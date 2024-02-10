import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { Business, BusinessCategory } from "../types";
import { BusinessModel } from "../schemas";
import { User } from "../../user/types";
import { queryHandlesPosts } from "../../post/routes/handles";
import { ServerResponse } from "http";
import { UserModel } from "../../user/schemas";

const getAll: QueryHandle<
  {
    paginateOptions?: PaginateOptions;
    userId?: string;
    routeName?: string;
    search?: string;
  },
  PaginateResult<Business>
> = async ({ paginateOptions, userId, routeName, search }) => {
  const filterQuery: FilterQuery<Business> = {};

  if (userId) {
    filterQuery.createdBy = userId;
  }

  if (routeName) {
    filterQuery.routeName = routeName;
  }

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }

  const out = await BusinessModel.paginate(filterQuery, paginateOptions);

  return out;
};

const addOne: QueryHandle<
  {
    category: BusinessCategory;
    name: string;
    routeName: string;
    userId: string;
  },
  Business
> = async ({ category, userId, routeName, name, res }) => {
  const routeNameExists = await BusinessModel.findOne({ routeName });
  if (routeNameExists) {
    return res.status(400).json({
      message: "Route name already exists",
    });
  }

  const out = new BusinessModel({
    category,
    createdBy: userId,
    name,
    routeName,
  });

  await out.save();

  return out;
};

const findOne: QueryHandle<
  {
    businessId: string;
    userId?: string;
  },
  Business
> = async ({ businessId, userId, res }) => {
  const filterQuery: FilterQuery<Business> = {
    _id: businessId,
  };

  if (userId) {
    filterQuery.createdBy = userId;
  }

  const out = await BusinessModel.findOne(filterQuery);

  if (!out) {
    return res.status(404).json({
      message: "Business not found",
    });
  }

  return out;
};

const deleteOne: QueryHandle<{
  businessId: string;
  userId: string;
}> = async ({ businessId, res, userId }) => {
  await BusinessModel.deleteOne({
    _id: businessId,
    createdBy: userId,
  });

  const out = await queryHandlesPosts.deleteMany({
    businessIds: [businessId],
    res,
    userId,
  });

  return out;
};

export const queryHandlesBusiness = {
  getAll,
  addOne,
  findOne,
  deleteOne,
};
