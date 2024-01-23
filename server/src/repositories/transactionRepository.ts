import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/schemas/transaction.schema";
import { Transaction, Prisma, PrismaClient } from "@prisma/client";

class TransactionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createTransaction = async (
    transactionData: Prisma.TransactionCreateInput
  ): Promise<Transaction> => {
    const transaction = await this.prisma.transaction.create({
      data: transactionData,
    });
    return transaction;
  };

  getUserTransactions = async (
    where: Prisma.TransactionWhereInput,
    select?: Prisma.TransactionSelect
  ): Promise<Transaction[]> => {
    return this.prisma.transaction.findMany({
      where,
      select,
    });
  };

  getEnvelopeTransactions = async (
    where: Prisma.TransactionWhereInput,
    select?: Prisma.TransactionSelect
  ): Promise<Transaction[]> => {
    return this.prisma.transaction.findMany({
      where,
      select,
    });
  };

  findTransaction = async (
    where: Prisma.TransactionWhereInput,
    select?: Prisma.TransactionSelect
  ) => {
    return (await this.prisma.transaction.findFirst({
      where,
      select,
    })) as Transaction;
  };

  findUniqueTransaction = async (
    where: Prisma.TransactionWhereUniqueInput,
    select?: Prisma.TransactionSelect
  ) => {
    return (await this.prisma.transaction.findUnique({
      where,
      select,
    })) as Transaction;
  };

  updateTransaction = async (
    where: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput,
    select?: Prisma.TransactionSelect
  ) => {
    return (await this.prisma.transaction.update({
      where,
      data,
      select,
    })) as Transaction;
  };

  deleteTransaction = async (
    where: Prisma.TransactionWhereUniqueInput,
    select?: Prisma.TransactionSelect
  ) => {
    return (await this.prisma.transaction.delete({
      where,
      select,
    })) as Transaction;
  };
}

export default TransactionRepository;
