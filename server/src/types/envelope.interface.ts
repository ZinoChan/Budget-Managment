import { Prisma } from "@prisma/client";

export type EnvelopeUpdateInputWithRequiredFields = {
  userId: string;
  title: string;
} & Omit<Prisma.EnvelopeUpdateInput, "userId" | "title">;
