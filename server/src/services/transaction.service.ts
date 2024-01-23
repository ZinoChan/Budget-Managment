import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import TransactionRepository from "@/repositories/transactionRepository";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/schemas/transaction.schema";
import { Transaction } from "@prisma/client";

class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
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
    return transaction;
  }

  public async getUserTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.getUserTransactions({
      userId,
    });
    return transactions;
  }

  public async getEnvelopeTransactions(
    userId: string,
    envelopeTitle: string
  ): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.getUserTransactions({
      userId,
      envelopeTitle,
    });
    return transactions;
  }
  public async getTransactionById(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findUniqueTransaction({
      id_userId: {
        userId,
        id: transactionId,
      },
    });
    return transaction;
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
    return transaction;
  }

  public async deleteTransaction(
    transactionId: string,
    userId: string
  ): Promise<string> {
    const transaction = await this.transactionRepository.deleteTransaction({
      id_userId: { userId, id: transactionId },
    });

    return transaction.id;
  }
}

export default TransactionService;
