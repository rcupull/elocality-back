import { FilterQuery, PaginateOptions } from "mongoose";
import { QueryHandle } from "../../../types";
import { Business, BusinessCategory } from "../types";
import { BusinessModel } from "../schemas";
import { queryHandlesPosts } from "../../post/routes/handles";
import {
  PaginateResult,
  paginationCustomLabels,
} from "../../../middlewares/pagination";
import { ServerResponse } from "http";

interface GetAllArgs {
  paginateOptions?: PaginateOptions;
  createdBy?: string;
  routeName?: string;
  search?: string;
  hidden?: boolean;
}
const getAll: QueryHandle<GetAllArgs, PaginateResult<Business>> = async ({
  paginateOptions = {},
  createdBy,
  routeName,
  search,
  hidden,
}) => {
  const filterQuery: FilterQuery<Business> = {};

  ///////////////////////////////////////////////////////////////////
  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }
  ///////////////////////////////////////////////////////////////////

  if (routeName) {
    filterQuery.routeName = routeName;
  }
  ///////////////////////////////////////////////////////////////////

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }
  ///////////////////////////////////////////////////////////////////

  if (hidden === true) {
    filterQuery.hidden = true;
  }
  ///////////////////////////////////////////////////////////////////

  if (hidden === false) {
    filterQuery.hidden = { $ne: true }; // search by false or null
  }
  ///////////////////////////////////////////////////////////////////

  const out = await BusinessModel.paginate(filterQuery, {
    ...paginateOptions,
    customLabels: paginationCustomLabels,
  });

  return out as unknown as PaginateResult<Business>;
};

const getAllWithoutPagination: QueryHandle<
  Omit<GetAllArgs, "paginateOptions">,
  Array<Business>
> = async (args) => {
  const out = await getAll({
    ...args,
    paginateOptions: {
      pagination: false,
    },
  });

  if (out instanceof ServerResponse) return out;

  return out.data;
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

const updateOne: QueryHandle<{
  routeName: string;
  partial: Partial<Pick<Business, "hidden">>;
}> = async ({ routeName, partial }) => {
  const { hidden } = partial;

  await BusinessModel.updateOne(
    {
      routeName,
    },
    {
      hidden,
    }
  );
};

export const queryHandlesBusiness = {
  getAll,
  getAllWithoutPagination,
  addOne,
  findOne,
  deleteOne,
  updateOne,
};
