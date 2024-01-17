import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  keyName: "jwtAccessTokenPrivateKey" | "jwtRefreshTokenPrivateKey",
  options: SignOptions
) => {
  const privateKey = Buffer.from(keyName, "base64").toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "HS256",
  });
};

// the private and public key things seem to take too much time to find a solution to it
export const verifyJwt = <T>(
  token: string,
  keyName: "jwtAccessTokenPrivateKey" | "jwtRefreshTokenPrivateKey"
): T | null => {
  try {
    const publicKey = Buffer.from(keyName, "base64").toString("ascii");
    const decoded = jwt.verify(token, keyName) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
