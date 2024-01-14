import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  NODE_MAILER_USER,
  NODE_MAILER_PASS,
  NODE_MAILER_HOST,
  NODE_MAILER_PORT,
  NODE_MAILER_SECURE,
  ORIGIN,
} = process.env;
