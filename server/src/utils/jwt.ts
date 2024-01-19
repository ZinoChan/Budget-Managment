import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  secretKey: "jwtAccessSecret" | "jwtRefreshSecret",
  options: SignOptions
) => {
  return jwt.sign(payload, secretKey, {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  secretKey: "jwtAccessSecret" | "jwtRefreshSecret"
): T | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
