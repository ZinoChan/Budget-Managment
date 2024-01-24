import { z } from "zod";

export enum TransactionType {
  "WITHDRAW",
  "DEPOSIT",
  "PURCHASE",
}

export const envelopeSchema = z.object({
  title: z
    .string({
      required_error: "Envelope title is required",
    })
    .min(3, "Title must be more than 3 characters")
    .max(100, "Title can't be more than 100 characters"),
  initialAmount: z
    .number({
      required_error: "Initial amount is required",
    })
    .min(0, "Initial amount can't be negative"),
  currentBalance: z
    .number({
      required_error: "current balance is required",
    })
    .min(0, "current balance can't be negative"),
  color: z.string().optional(),
  image: z.string().optional(),
});

export const transactionSchema = z.object({
  title: z
    .string({
      required_error: "Transaction title is required",
    })
    .min(3, "Title must be more than 3 characters")
    .max(100, "Title can't be more than 100 characters"),
  description: z.string().optional(),
  date: z.string({
    required_error: "Date is required",
  }),
  amount: z
    .number({
      required_error: "Amount is required",
    })
    .min(0, "Amount can't be negative"),
  transactionType: z.nativeEnum(TransactionType),
  category: z.string({
    required_error: "Category title is required",
  }),
  color: z.string().optional(),
  image: z.string().optional(),
});
