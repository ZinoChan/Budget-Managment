import { API_ROUTES } from "@/constants";
import StatsController from "@/controller/stats.controller";
import { Router } from "express";
import { Route } from "@/types/routes.interface";
import AuthMiddleware from "@/middlewares/auth.middleware";

class StatsRoute implements Route {
  public path = API_ROUTES.STATS;
  public router = Router();
  private statsController: StatsController;
  private authMiddleware: AuthMiddleware;

  constructor(
    statsController: StatsController,
    authMiddleware: AuthMiddleware
  ) {
    this.statsController = statsController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `/${this.path}`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.statsController.getStats
    );
  }
}

export default StatsRoute;
