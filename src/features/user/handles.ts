import { Request, RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { ServerResponse } from "http";
import { businessServices } from "../business/services";
import { Business } from "../business/types";
import { RequestWithUser } from "../../middlewares/verify";
import { postServices } from "../post/services";
import { filesDir } from "../../middlewares/files";

const get_users_userId_business: () => RequestHandler = () => {
  return (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions, query, params } = req;

      const { userId } = params;

      const { routeName, search } = query;

      const out = await businessServices.getAll({
        res,
        paginateOptions,
        createdBy: userId,
        routeName,
        search,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_business: () => RequestHandler = () => {
  return (req: Request<any, any, Business>, res) => {
    withTryCatch(req, res, async () => {
      const { body, params } = req;

      const { userId } = params;

      const { name, category, routeName } = body;

      const out = await businessServices.addOne({
        category,
        name,
        routeName,
        userId,
        res,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req as unknown as RequestWithUser;
      const { routeName, userId } = params;

      const out = await businessServices.findOne({
        res,
        routeName,
        createdBy: userId,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const put_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { routeName } = params;

      const out = await businessServices.updateOne({
        res,
        query: {
          routeName,
        },
        update: body,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const delete_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;

      const { routeName, userId } = params;

      const out = await businessServices.deleteOne({
        res,
        routeName,
        userId,
      });

      if (out instanceof ServerResponse) return;

      res.send();
    });
  };
};

/**
 *  //////////////////////////////////////////POSTS
 */

const get_users_userId_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions, params } =
        req as unknown as RequestWithPagination;

      const { userId } = params;

      const { search, routeNames } = query;

      const out = await postServices.getAll({
        res,
        paginateOptions,
        routeNames,
        search,
        createdBy: userId,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { body, params } = req;

      const { userId } = params;

      const out = await postServices.addOne({
        ...body,
        createdBy: userId,
        res,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId } = params;

      const out = await postServices.getOne({ res, postId });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const put_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { postId } = params;

      const out = await postServices.updateOne({
        res,
        postId,
        partial: body,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const delete_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId, userId } = params;

      const out = await postServices.deleteMany({
        res,
        ids: [postId],
        userId,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_business_routeName_image: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { file } = req;
      if (!file) {
        return res.sendStatus(404).json({ message: "Has not file" });
      }

      res.send({
        imageSrc: file.path.replace(filesDir, ""),
      });
    });
  };
};

export const userHandles = {
  get_users_userId_business,
  post_users_userId_business,
  get_users_userId_business_routeName,
  put_users_userId_business_routeName,
  delete_users_userId_business_routeName,
  //
  get_users_userId_posts,
  post_users_userId_posts,
  //
  get_users_userId_posts_postId,
  put_users_userId_posts_postId,
  delete_users_userId_posts_postId,
  post_users_userId_business_routeName_image,
};
