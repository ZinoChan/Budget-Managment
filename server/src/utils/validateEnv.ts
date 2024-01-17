import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    JWT_SECRET: str(),
    NODE_MAILER_USER: str(),
    NODE_MAILER_PASS: str(),
    NODE_MAILER_HOST: str(),
    NODE_MAILER_PORT: port(),
    NODE_MAILER_SECURE: str(),
    ORIGIN: str(),
    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),
  });
};

export default validateEnv;
