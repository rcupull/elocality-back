import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { QueryHandle } from "../../../types";
import { Business, BusinessCategory } from "../types";
import { BusinessModel } from "../schemas";
import { queryHandlesPosts } from "../../post/routes/handles";

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
    routeName: string;
    userId?: string;
  },
  Business
> = async ({ routeName, userId, res }) => {
  const filterQuery: FilterQuery<Business> = {
    routeName,
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
  routeName: string;
  userId: string;
}> = async ({ routeName, res, userId }) => {
  await BusinessModel.deleteOne({
    routeName,
    createdBy: userId,
  });

  const out = await queryHandlesPosts.deleteMany({
    routeNames: [routeName],
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
