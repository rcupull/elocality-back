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
    user?: User;
    routeName?: string;
    search?: string;
  },
  PaginateResult<Business>
> = async ({ paginateOptions, user, routeName, search }) => {
  const filterQuery: FilterQuery<Business> = {};

  if (user?._id) {
    filterQuery.createdBy = user?._id;
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
    user: User;
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
  const filterQuery: FilterQuery<Business> = {
    _id: businessId,
  };

  if (user?._id) {
    filterQuery.createdBy = user?._id;
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
  user: User;
}> = async ({ businessId, res, user }) => {
  await BusinessModel.deleteOne({
    _id: businessId,
    createdBy: user._id,
  });

  const out = await queryHandlesPosts.deleteMany({
    businessIds: [businessId],
    res,
    user,
  });

  return out;
};

export const queryHandlesBusiness = {
  getAll,
  addOne,
  findOne,
  deleteOne,
};
