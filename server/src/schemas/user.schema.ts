import { RoleEnumType } from "@prisma/client";
import { z, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    username: string({
      required_error: "Username name is required",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).min(8, "Invalid passwrod length"),
  }),
});

export const verifyUserSchema = object({
  params: object({
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Email is invalid"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    resetToken: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(8, "Password must be more than 8 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
