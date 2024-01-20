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
      try {
        const message = await redisClient.get("try");
        res.status(HttpStatusCodes.OK).json({ message });
      } catch (error) {
        console.error("Error retrieving message from Redis:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Unable to retrieve message from Redis",
        });
      }
    });
  }
}

export default IndexRoute;
