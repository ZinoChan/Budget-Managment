import { Request, Response, NextFunction } from "express";
import {
  CreateTransactionInput,
  TransactionEnvelopeInput,
  TransactionIdInput,
  UpdateTransactionInput,
} from "@/schemas/transaction.schema";
import { HttpStatusCodes } from "@/constants";
import TransactionService from "@/services/transaction.service";
import { EnvelopeTitleInput } from "@/schemas/envelope.schema";

class TransactionController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  public createTransaction = async (
    req: Request<EnvelopeTitleInput, {}, CreateTransactionInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const envelopeTitle = req.params.title;
      const userId = res.locals.user.id;
      const transaction = await this.transactionService.createTransaction(
        body,
        envelopeTitle,
        userId
      );
      res.status(HttpStatusCodes.CREATED).json({
        status: "success",
        message: "Transaction created successfully",
        payload: transaction,
      });
    } catch (error) {
      console.error("Create Transaction Err: ", error);
      next(error);
    }
  };

  public getUserTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const transactions = await this.transactionService.getUserTransactions(
        userId
      );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "Success",
        payload: transactions,
      });
    } catch (error) {
      console.error("Get Transactions Err: ", error);
      next(error);
    }
  };

  public getEnvelopeTransactions = async (
    req: Request<EnvelopeTitleInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const { title: envelopeTitle } = req.params;
      const transactions =
        await this.transactionService.getEnvelopeTransactions(
          userId,
          envelopeTitle
        );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "Success",
        payload: transactions,
      });
    } catch (error) {
      console.error("Get Envelope Transactions Err: ", error);
      next(error);
    }
  };
  public getTransactionById = async (
    req: Request<TransactionIdInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = req.params.id;
      const userId = res.locals.user.id;
      const transaction = await this.transactionService.getTransactionById(
        userId,
        transactionId
      );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "Success",
        payload: transaction,
      });
    } catch (error) {
      console.error("Get Transaction Err: ", error);
      next(error);
    }
  };

  public updateTransaction = async (
    req: Request<TransactionEnvelopeInput, {}, UpdateTransactionInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const userId = res.locals.user.id;
      const { id: transactionId, envelopeTitle } = req.params;

      const updatedTransaction =
        await this.transactionService.updateTransaction(
          body,
          transactionId,
          envelopeTitle,
          userId
        );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "Transaction updated successfully",
        payload: updatedTransaction,
      });
    } catch (error) {
      console.error("Update Transaction Err: ", error);
      next(error);
    }
  };

  public deleteTransaction = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const transactionId = req.params.id;
      const deletedTransactionId =
        await this.transactionService.deleteTransaction(transactionId, userId);
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "Transaction deleted successfully",
        payload: deletedTransactionId,
      });
    } catch (error) {
      console.error("Delete Transaction Err: ", error);
      next(error);
    }
  };
}

export default TransactionController;
