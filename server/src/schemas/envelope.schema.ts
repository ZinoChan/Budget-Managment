import { TypeOf, object, z } from "zod";

export const createEnvelopeSchema = z.object({
  body: object({
    title: z
      .string({
        required_error: "Envelope title is required",
      })
      .min(3, "Title must be more than 3 characters")
      .max(100, "Title can't be more than 100 characters"),
    currentBalance: z
      .number({
        required_error: "current balance is required",
      })
      .min(0, "current balance can't be negative"),
    color: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const envelopeTitleSchema = z.object({
  params: object({
    title: z.string(),
  }),
});

export const updateEnvelopeSchema = z.object({
  body: object({
    title: z.string().optional(),
    initialAmount: z
      .number()
      .min(0, "Initial amount can't be negative")
      .optional(),
    currentBalance: z
      .number()
      .min(0, "current balance can't be negative")
      .optional(),
    color: z.string().optional(),
    image: z.string().optional(),
  }),
});
export type CreateEnvelopeInput = TypeOf<typeof createEnvelopeSchema>["body"];
export type EnvelopeTitleInput = TypeOf<typeof envelopeTitleSchema>["params"];
export type UpdateEnvelopeInput = TypeOf<typeof updateEnvelopeSchema>["body"];
