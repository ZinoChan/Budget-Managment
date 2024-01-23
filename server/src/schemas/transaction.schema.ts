import { TransactionType } from "@prisma/client";
import { z, object, TypeOf } from "zod";

export const createTransactionSchema = z.object({
  body: object({
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
  }),
});

export const updateTransactionSchema = z.object({
  body: object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    amount: z.number().optional(),
    transactionType: z.optional(z.nativeEnum(TransactionType)),
    category: z.string().optional(),
    color: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: object({
    id: z.string(),
  }),
});

export const transactionEnvelopeSchema = z.object({
  params: object({
    id: z.string(),
    envelopeTitle: z.string(),
  }),
});
export type CreateTransactionInput = TypeOf<
  typeof createTransactionSchema
>["body"];

export type UpdateTransactionInput = TypeOf<
  typeof updateTransactionSchema
>["body"];

export type TransactionIdInput = TypeOf<typeof transactionIdSchema>["params"];
export type TransactionEnvelopeInput = TypeOf<
  typeof transactionEnvelopeSchema
>["params"];
