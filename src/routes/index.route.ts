import { HttpStatusCodes } from "@/constants";
import { Route } from "@/types/routes.interface";
import { Router } from "express";

class IndexRoute implements Route {
  public path = "/";
  public router = Router();

  constructor() {
    this.initilizeRoutes();
  }

  private initilizeRoutes() {
    this.router.get(this.path, (_, res, next) => {
      res.status(HttpStatusCodes.OK).json({ message: "ok" });
    });
  }
}

export default IndexRoute;
