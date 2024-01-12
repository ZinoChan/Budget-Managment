import { API_ROUTES } from "@/constants";
import AuthController from "@/controller/auth.controller";
import validateResource from "@/middlewares/validateResources.midleware";
import { createUserSchema } from "@/schemas/user.schema";
import { Route } from "@/types/routes.interface";
import { Router } from "express";
class AuthRoute implements Route {
  public path = API_ROUTES.AUTH;
  public router = Router();
  private authController: AuthController;

  constructor(authController: AuthController) {
    this.authController = authController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/${this.path}/${API_ROUTES.SIGN_UP}`,
      validateResource(createUserSchema),
      this.authController.signUp
    );
  }
}

export default AuthRoute;