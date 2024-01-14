import crypto from "crypto";

/**
 * Generates a secure SHA-256 verification code.
 * @returns {string} The generated verification code.
 */
export default function generateSecureCode() {
  const verifyCode = crypto.randomBytes(32).toString("hex");
  const verificationCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");

  return { verificationCode, verifyCode };
}
