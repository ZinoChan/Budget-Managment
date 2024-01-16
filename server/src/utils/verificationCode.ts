import crypto from "crypto";

export function generateSecureCode(): {
  verificationCode: string;
  verifyCode: string;
} {
  const verifyCode = crypto.randomBytes(32).toString("hex");
  const verificationCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");

  return { verificationCode, verifyCode };
}

export function hashVerificationCode(verificationCode: string): string {
  return crypto.createHash("sha256").update(verificationCode).digest("hex");
}
