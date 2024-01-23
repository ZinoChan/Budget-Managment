import App from "./app";
import AuthController from "./controller/auth.controller";
import EnvelopeController from "./controller/envelope.controller";
import TransactionController from "./controller/transaction.controller";
import prismaClient from "./lib/PrismaClient";
import redisClient from "./lib/RedisClient";
import AppMiddleware from "./middlewares/app.middleware";
import AuthMiddleware from "./middlewares/auth.middleware";
import EnvelopeRepository from "./repositories/envelopeRepository";
import TransactionRepository from "./repositories/transactionRepository";
import UserRepository from "./repositories/userRepository";
import AuthRoute from "./routes/auth.route";
import EnvelopeRoute from "./routes/envelope.route";
import IndexRoute from "./routes/index.route";
import TransactionRoute from "./routes/transaction.route";
import AuthService from "./services/auth.service";
import EnvelopeService from "./services/envelope.service";
import TransactionService from "./services/transaction.service";
import Mailer from "./utils/mailer";

const server = new App([
  new IndexRoute(),
  new AuthRoute(
    new AuthController(
      new AuthService(
        new UserRepository(prismaClient, redisClient),
        new Mailer()
      )
    ),
    new AuthMiddleware(new UserRepository(prismaClient, redisClient)),
    new AppMiddleware()
  ),
  new EnvelopeRoute(
    new EnvelopeController(
      new EnvelopeService(new EnvelopeRepository(prismaClient))
    ),
    new AuthMiddleware(new UserRepository(prismaClient, redisClient)),
    new AppMiddleware()
  ),
  new TransactionRoute(
    new TransactionController(
      new TransactionService(new TransactionRepository(prismaClient))
    ),
    new AuthMiddleware(new UserRepository(prismaClient, redisClient)),
    new AppMiddleware()
  ),
]);

server.listen();
