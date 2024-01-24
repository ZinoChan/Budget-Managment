import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import TransactionRepository from "@/repositories/transactionRepository";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/schemas/transaction.schema";
import { Transaction } from "@prisma/client";
import EnvelopeService from "./envelope.service";

class TransactionService {
  private transactionRepository: TransactionRepository;
  private envelopeService: EnvelopeService;

  constructor(
    transactionRepository: TransactionRepository,
    envelopeService: EnvelopeService
  ) {
    this.transactionRepository = transactionRepository;
    this.envelopeService = envelopeService;
  }

  private async updateEnvelopeBalance(
    envelopeTitle: string,
    userId: string,
    amount: number,
    transactionType: string,
    type: "reverse" | "normal" = "normal"
  ) {
    const envelope = await this.envelopeService.getUserEnvelope(
      envelopeTitle,
      userId
    );

    if (!envelope) {
      throw new HttpException(
        HttpStatusCodes.NOT_FOUND,
        `${envelopeTitle} envelope not found`
      );
    }

    let currentBalance = envelope.currentBalance;

    if (type === "reverse") {
      if (transactionType === "DEPOSIT") {
        currentBalance -= amount;
      } else {
        currentBalance += amount;

        if (currentBalance < 0) {
          throw new HttpException(
            HttpStatusCodes.FORBIDDEN,
            `the current envelope doesn't have enough money`
          );
        }
      }
    } else {
      if (transactionType === "DEPOSIT") {
        currentBalance += amount;

        if (currentBalance < 0) {
          throw new HttpException(
            HttpStatusCodes.FORBIDDEN,
            `the current envelope doesn't have enough money`
          );
        }
      } else {
        currentBalance -= amount;
      }
    }

    this.envelopeService.updateEnvelope(userId, envelopeTitle, {
      currentBalance,
    });
  }

  public async createTransaction(
    transactionData: CreateTransactionInput,
    envelopeTitle: string,
    userId: string
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.createTransaction({
      ...transactionData,
      title: transactionData.title.toLocaleLowerCase(),
      date: new Date(transactionData.date),
      envelope: {
        connect: { title: envelopeTitle },
      },
      category: {
        connectOrCreate: {
          where: { title: transactionData.category },
          create: { title: transactionData.category },
        },
      },
      user: {
        connect: { id: userId },
      },
    });
    await this.updateEnvelopeBalance(
      envelopeTitle,
      userId,
      transaction.amount,
      transaction.transactionType
    );
    return transaction;
  }

  public async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getUserTransactions({
      userId,
    });
  }

  public async getEnvelopeTransactions(
    userId: string,
    envelopeTitle: string
  ): Promise<Transaction[]> {
    return this.transactionRepository.getUserTransactions({
      userId,
      envelopeTitle,
    });
  }
  public getTransactionById(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    return this.transactionRepository.findUniqueTransaction({
      id_userId: {
        userId,
        id: transactionId,
      },
    });
  }

  public async updateTransaction(
    transactionData: UpdateTransactionInput,
    transactionId: string,
    envelopeTitle: string,
    userId: string
  ): Promise<Transaction> {
    const existingTransaction =
      await this.transactionRepository.findUniqueTransaction({
        id_userId: {
          userId,
          id: transactionId,
        },
      });
    if (!existingTransaction)
      throw new HttpException(
        HttpStatusCodes.NOT_FOUND,
        "transaction was not found"
      );
    await this.updateEnvelopeBalance(
      envelopeTitle,
      userId,
      existingTransaction.amount,
      existingTransaction.transactionType,
      "reverse"
    );

    const transaction = await this.transactionRepository.updateTransaction(
      { id_userId: { userId, id: transactionId } },
      {
        ...transactionData,
        envelope: {
          connect: { title: envelopeTitle },
        },
        category: {
          connectOrCreate: {
            where: {
              title:
                transactionData.category || existingTransaction.categoryTitle,
            },
            create: {
              title:
                transactionData.category || existingTransaction.categoryTitle,
            },
          },
        },

        user: {
          connect: { id: userId },
        },
      }
    );
    await this.updateEnvelopeBalance(
      envelopeTitle,
      userId,
      transaction.amount,
      transaction.transactionType
    );
    return transaction;
  }

  public async deleteTransaction(
    transactionId: string,
    userId: string
  ): Promise<string> {
    const transaction = await this.transactionRepository.deleteTransaction(
      {
        id_userId: { userId, id: transactionId },
      },
      { envelopeTitle: true, id: true, amount: true, transactionType: true }
    );
    await this.updateEnvelopeBalance(
      transaction.envelopeTitle,
      userId,
      transaction.amount,
      transaction.transactionType,
      "reverse"
    );
    return transaction.id;
  }
}

export default TransactionService;
