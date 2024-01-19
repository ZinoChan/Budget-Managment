import { HttpStatusCodes } from "@/constants";
import redisClient from "@/lib/RedisClient";
import { Route } from "@/types/routes.interface";
import { Router } from "express";

class IndexRoute implements Route {
  public path = "/";
  public router = Router();

  constructor() {
    this.initilizeRoutes();
  }

  private initilizeRoutes() {
    this.router.get(this.path, async (_, res, next) => {
      const message = await redisClient.get("try");
      res.status(HttpStatusCodes.OK).json({ message });
    });
  }
}

export default IndexRoute;
