import { Request, RequestHandler, Send } from "express";
import { PaginationParameters } from "mongoose-paginate-v2";
import { AnyRecord } from "../types";
import { PaginateOptions } from "mongoose";

export const pagination: RequestHandler = (req, res, next) => {
  // destructuring to see the query in swagger
  const { limit, page, offset, pagination } = req.query as PaginateOptions;

  const parameters = new PaginationParameters(req);

  const paginateOptions = parameters.getOptions();

  paginateOptions.customLabels = {
    totalDocs: "dataCount",
    docs: "data",
    limit: "limit",
    page: "page",
    nextPage: "nextPage",
    prevPage: "prevPage",
    totalPages: "pageCount",
    pagingCounter: "pagingCounter",
    meta: "paginator",
  };

  //@ts-expect-error
  req["paginateOptions"] = paginateOptions;

  Object.keys(paginateOptions).forEach((key) => {
    if (key in req.query) {
      delete req.query[key];
    }
  });

  next();
};

export type RequestWithPagination<
  P = AnyRecord,
  ResBody = any,
  ReqBody = any,
  ReqQuery = AnyRecord,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & {
  paginateOptions?: PaginateOptions;
};
