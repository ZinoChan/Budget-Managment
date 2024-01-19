import { API_ROUTES } from "@/constants";
import AuthController from "@/controller/auth.controller";
import AuthMiddleware from "@/middlewares/auth.middleware";
import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "@/schemas/user.schema";
import { Route } from "@/types/routes.interface";
import { Router } from "express";
class AuthRoute implements Route {
  public path = API_ROUTES.AUTH;
  public router = Router();
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor(authController: AuthController, authMiddleware: AuthMiddleware) {
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/${this.path}/${API_ROUTES.SIGN_UP}`,
      this.authMiddleware.validateResource(createUserSchema),
      this.authController.signUp
    );
    this.router.post(
      `/${this.path}/${API_ROUTES.VERIFY_EMAIL}/:verificationCode`,
      this.authMiddleware.validateResource(verifyUserSchema),
      this.authController.verifyEmail
    );
    this.router.post(
      `/${this.path}/${API_ROUTES.LOGIN}`,
      this.authMiddleware.validateResource(loginUserSchema),
      this.authController.login
    );
    this.router.get(
      `/${this.path}/${API_ROUTES.REFRESH_TOKEN}`,
      this.authController.refreshAccessToken
    );
    this.router.get(
      `/${this.path}/${API_ROUTES.LOGOUT}`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.authController.logOut
    );
    this.router.post(
      `/${this.path}/${API_ROUTES.FORGOT_PASSWORD}`,
      this.authMiddleware.validateResource(forgotPasswordSchema),
      this.authController.forgotPassword
    );
    this.router.patch(
      `/${this.path}/${API_ROUTES.RESET_PASSWORD}/:resetToken`,
      this.authMiddleware.validateResource(resetPasswordSchema),
      this.authController.resetPassword
    );
  }
}

export default AuthRoute;
