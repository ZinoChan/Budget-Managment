import { API_ROUTES } from "@/constants";
import EnvelopeController from "@/controller/envelope.controller";
import AppMiddleware from "@/middlewares/app.middleware";
import AuthMiddleware from "@/middlewares/auth.middleware";
import {
  createEnvelopeSchema,
  envelopeTitleSchema,
  updateEnvelopeSchema,
} from "@/schemas/envelope.schema";
import { Router } from "express";

class EnvelopeRoute {
  public path = API_ROUTES.ENVELOPES;
  public router = Router();
  private envelopeController: EnvelopeController;
  private authMiddleware: AuthMiddleware;
  private appMiddleware: AppMiddleware;

  constructor(
    envelopeController: EnvelopeController,
    authMiddleware: AuthMiddleware,
    appMiddleware: AppMiddleware
  ) {
    this.envelopeController = envelopeController;
    this.authMiddleware = authMiddleware;
    this.appMiddleware = appMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/${this.path}/`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(createEnvelopeSchema),
      this.envelopeController.createEnvelope
    );
    this.router.get(
      `/${this.path}/`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.envelopeController.getUserEnvelopes
    );
    this.router.get(
      `/${this.path}/:title`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(envelopeTitleSchema),
      this.envelopeController.getUserEnvelope
    );
    this.router.put(
      `/${this.path}/:title`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(updateEnvelopeSchema),
      this.appMiddleware.validateResource(envelopeTitleSchema),
      this.envelopeController.updateEnvelope
    );
    this.router.delete(
      `/${this.path}/:title`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(envelopeTitleSchema),
      this.envelopeController.deleteEnvelope
    );
  }
}

export default EnvelopeRoute;
