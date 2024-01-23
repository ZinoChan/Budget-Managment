import { Router } from "express";
import {
  createTransactionSchema,
  transactionEnvelopeSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "@/schemas/transaction.schema";
import { API_ROUTES } from "@/constants";
import TransactionController from "@/controller/transaction.controller";
import AuthMiddleware from "@/middlewares/auth.middleware";
import AppMiddleware from "@/middlewares/app.middleware";
import { envelopeTitleSchema } from "@/schemas/envelope.schema";

class TransactionRoute {
  public path = API_ROUTES.TRANSACTIONS;
  public router = Router();
  private transactionController: TransactionController;
  private authMiddleware: AuthMiddleware;
  private appMiddleware: AppMiddleware;

  constructor(
    transactionController: TransactionController,
    authMiddleware: AuthMiddleware,
    appMiddleware: AppMiddleware
  ) {
    this.transactionController = transactionController;
    this.authMiddleware = authMiddleware;
    this.appMiddleware = appMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/${API_ROUTES.ENVELOPES}/:title/${this.path}/`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(envelopeTitleSchema),
      this.appMiddleware.validateResource(createTransactionSchema),
      this.transactionController.createTransaction
    );
    this.router.get(
      `/${API_ROUTES.ENVELOPES}/:title/${this.path}/`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(envelopeTitleSchema),
      this.transactionController.getEnvelopeTransactions
    );
    this.router.get(
      `/${this.path}/:id`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(transactionIdSchema),
      this.transactionController.getTransactionById
    );
    this.router.get(
      `/${this.path}/`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.transactionController.getUserTransactions
    );
    this.router.put(
      `/${API_ROUTES.ENVELOPES}/:envelopeTitle/${this.path}/:id`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(updateTransactionSchema),
      this.appMiddleware.validateResource(transactionEnvelopeSchema),
      this.transactionController.updateTransaction
    );
    this.router.delete(
      `/${this.path}/:id`,
      this.authMiddleware.deserializeUser,
      this.authMiddleware.requireUser,
      this.appMiddleware.validateResource(transactionIdSchema),
      this.transactionController.deleteTransaction
    );
  }
}

export default TransactionRoute;
